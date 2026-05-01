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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

export default function EditSessionModal({ 
  isOpen, 
  onClose, 
  session,
  onSessionUpdated 
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    class_date: '',
    class_start_time: '',
    class_end_time: '',
    google_meet_link: '',
    new_or_repeat_session: true,
    is_requested: false,
    completed_or_cancelled: false
  })

  // Initialize form data when session changes
  useEffect(() => {
    if (session) {
      const classDate = new Date(session.class_date)
      const startTime = new Date(session.class_start_time)
      const endTime = new Date(session.class_end_time)
      
      // Format dates for HTML date/time inputs
      const formatDate = (date) => {
        return date.toISOString().split('T')[0] // YYYY-MM-DD
      }
      
      const formatTime = (date) => {
        return date.toTimeString().slice(0, 5) // HH:MM
      }
      
      setFormData({
        class_date: formatDate(classDate),
        class_start_time: formatTime(startTime),
        class_end_time: formatTime(endTime),
        google_meet_link: session.google_meet_link || '',
        new_or_repeat_session: session.new_or_repeat_session || false,
        is_requested: session.is_requested || false,
        completed_or_cancelled: session.completed_or_cancelled || false
      })
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.class_date) {
      toast.error('Please provide a class date')
      return
    }

    if (!formData.class_start_time) {
      toast.error('Please provide a start time')
      return
    }

    if (!formData.class_end_time) {
      toast.error('Please provide an end time')
      return
    }

    // Create datetime objects for validation
    const startDateTime = new Date(`${formData.class_date}T${formData.class_start_time}`)
    const endDateTime = new Date(`${formData.class_date}T${formData.class_end_time}`)

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        class_date: new Date(`${formData.class_date}T${formData.class_start_time}`).toISOString(),
        class_start_time: startDateTime.toISOString(),
        class_end_time: endDateTime.toISOString(),
        google_meet_link: formData.google_meet_link.trim() || null,
        new_or_repeat_session: formData.new_or_repeat_session,
        is_requested: formData.is_requested,
        completed_or_cancelled: formData.completed_or_cancelled
      }

      console.log('Updating session with payload:', payload)

      const response = await axios.patch(`/student-tutoring-sessions/${session.id}`, payload)
      
      console.log('Session updated successfully:', response.data)
      
      toast.success('Session updated successfully!')
      
      // Call callback if provided
      if (onSessionUpdated) {
        onSessionUpdated(response.data?.data || response.data)
      }
      
      onClose()
      
    } catch (error) {
      console.error('Error updating session:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update session. Please try again.'
      
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

  if (!session) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Session
          </DialogTitle>
          <DialogDescription>
            Update the details of your tutoring session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="class_date" className="text-sm font-medium">
                  Class Date *
                </Label>
                <Input
                  id="class_date"
                  type="date"
                  value={formData.class_date}
                  onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="class_start_time" className="text-sm font-medium">
                  Start Time *
                </Label>
                <Input
                  id="class_start_time"
                  type="time"
                  value={formData.class_start_time}
                  onChange={(e) => setFormData({ ...formData, class_start_time: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="class_end_time" className="text-sm font-medium">
                  End Time *
                </Label>
                <Input
                  id="class_end_time"
                  type="time"
                  value={formData.class_end_time}
                  onChange={(e) => setFormData({ ...formData, class_end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="google_meet_link" className="text-sm font-medium">
                Google Meet Link
              </Label>
              <Input
                id="google_meet_link"
                type="url"
                placeholder="https://meet.google.com/xyz-abc-def"
                value={formData.google_meet_link}
                onChange={(e) => setFormData({ ...formData, google_meet_link: e.target.value })}
              />
            </div>
          </div>

          {/* Session Settings
          <div className="space-y-4">
            <h3 className="font-medium">Session Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new_or_repeat_session"
                  checked={formData.new_or_repeat_session}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, new_or_repeat_session: checked })
                  }
                />
                <Label htmlFor="new_or_repeat_session" className="text-sm">
                  This is a new session (unchecked = repeat session)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_requested"
                  checked={formData.is_requested}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_requested: checked })
                  }
                />
                <Label htmlFor="is_requested" className="text-sm">
                  This session was requested by student
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed_or_cancelled"
                  checked={formData.completed_or_cancelled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, completed_or_cancelled: checked })
                  }
                />
                <Label htmlFor="completed_or_cancelled" className="text-sm">
                  Session is completed or cancelled
                </Label>
              </div>
            </div>
          </div> */}

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
