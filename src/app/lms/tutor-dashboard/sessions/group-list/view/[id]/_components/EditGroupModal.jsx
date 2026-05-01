'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

export default function EditGroupModal({ 
  isOpen, 
  onClose, 
  group,
  onGroupUpdated 
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    course_name: '',
    topic: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    session_link: '',
    session_password: ''
  })

  // Initialize form data when group changes
  useEffect(() => {
    if (group) {
      let startDate = '', startTime = '', endDate = '', endTime = ''
      
      // Only format dates if they exist and are valid
      if (group.start_time) {
        try {
          const startDateTime = new Date(group.start_time)
          if (!isNaN(startDateTime.getTime())) {
            startDate = startDateTime.toISOString().split('T')[0] // YYYY-MM-DD
            startTime = startDateTime.toTimeString().slice(0, 5) // HH:MM
          }
        } catch (error) {
          console.error('Error parsing start time:', error)
        }
      }
      
      if (group.end_time) {
        try {
          const endDateTime = new Date(group.end_time)
          if (!isNaN(endDateTime.getTime())) {
            endDate = endDateTime.toISOString().split('T')[0] // YYYY-MM-DD
            endTime = endDateTime.toTimeString().slice(0, 5) // HH:MM
          }
        } catch (error) {
          console.error('Error parsing end time:', error)
        }
      }
      
      setFormData({
        title: group.title || '',
        course_name: group.course_name || '',
        topic: group.topic || '',
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
        session_link: group.session_link || '',
        session_password: group.session_password || ''
      })
    }
  }, [group])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please provide a group session title')
      return
    }

    // Validate time order if both start and end times are provided
    const hasStartTime = formData.start_date && formData.start_time
    const hasEndTime = formData.end_date && formData.end_time
    
    if (hasStartTime && hasEndTime) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)

      // Check if dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast.error('Please provide valid dates and times')
        return
      }

      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time')
        return
      }
    }
    
    // If only one time is provided, show a helpful message
    if ((hasStartTime && !hasEndTime) || (!hasStartTime && hasEndTime)) {
      toast.error('Please provide both start and end times, or leave both empty')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        title: formData.title.trim(),
        course_name: formData.course_name.trim(),
        topic: formData.topic.trim(),
        session_link: formData.session_link.trim() || null,
        session_password: formData.session_password.trim() || null
      }

      // Only include start_time and end_time if both date and time are provided
      if (formData.start_date && formData.start_time) {
        const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
        payload.start_time = startDateTime.toISOString()
      }

      if (formData.end_date && formData.end_time) {
        const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)
        payload.end_time = endDateTime.toISOString()
      }

      console.log('Updating group session with payload:', payload)

      const response = await axios.patch(`/group-tutoring-sessions/${group.id}`, payload)
      
      console.log('Group session updated successfully:', response.data)
      
      toast.success('Group session updated successfully!')
      
      // Call callback if provided
      if (onGroupUpdated) {
        onGroupUpdated(response.data?.data || response.data)
      }
      
      onClose()
      
    } catch (error) {
      console.error('Error updating group session:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update group session. Please try again.'
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!group) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Group Session
          </DialogTitle>
          <DialogDescription>
            Update the details of your group session. Only the title is required - all other fields are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Session Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter session title (e.g., Advanced Mathematics Group Session)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="course_name" className="text-sm font-medium">
                Course Name
              </Label>
              <Input
                id="course_name"
                placeholder="Enter course name (e.g., Advanced Mathematics)"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="topic" className="text-sm font-medium">
                Topic/Description
              </Label>
              <Textarea
                id="topic"
                placeholder="Describe what will be covered in this session..."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Schedule Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Schedule</h3>
            
            {/* Start Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Start Time</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
            </div>

            {/* End Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">End Time</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Meeting Information (Optional)</h3>
            
            <div>
              <Label htmlFor="session_link" className="text-sm font-medium">
                Meeting Link
              </Label>
              <Input
                id="session_link"
                type="url"
                placeholder="https://meet.google.com/xyz-abc-def or Zoom meeting link"
                value={formData.session_link}
                onChange={(e) => setFormData({ ...formData, session_link: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="session_password" className="text-sm font-medium">
                Meeting Password
              </Label>
              <Input
                id="session_password"
                placeholder="Enter meeting password if required"
                value={formData.session_password}
                onChange={(e) => setFormData({ ...formData, session_password: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
