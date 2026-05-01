"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DateTimePicker } from "./DateTimePicker"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks"

export function GroupSessionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentTutorId, setCurrentTutorId] = useState(null)

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user)

  const [formData, setFormData] = useState({
    title: "",
    course_name: "",
    session_link: "",
    session_password: "",
    topic: "",
    start_time: null,
    end_time: null,
    user_id: null,
    tutor_id: null
  })

  // Get current user and tutor IDs
  useEffect(() => {
    const getUserData = () => {
      try {
        // Get user data from Redux state
        const userData = user;
        
        console.log("User data from Redux store:", userData)
        
        if (userData) {
          const userId = userData.id
          const tutorId = userData.tutor_id
          
          console.log("Extracted IDs:", { userId, tutorId })
          
          setCurrentUserId(userId)
          setCurrentTutorId(tutorId)
          
          // Set the IDs in form data immediately
          setFormData(prev => {
            const updated = {
              ...prev,
              user_id: userId,
              tutor_id: tutorId
            }
            console.log("Updated form data with IDs:", updated)
            return updated
          })
        } else {
          console.error("No user data received from Redux store")
          toast.error("Failed to load user data - no data received")
        }
      } catch (error) {
        console.error("Error getting user data:", error)
        toast.error("Failed to load user data")
      }
    }

    if (user) {
      getUserData()
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manual refresh function for debugging
  const refreshUserData = () => {
    try {
      console.log("Manual refresh of user data...")
      const userData = user;
      
      console.log("Manual refresh - User data from Redux:", userData)
      
      if (userData) {
        const userId = userData.id
        const tutorId = userData.tutor_id
        
        setCurrentUserId(userId)
        setCurrentTutorId(tutorId)
        
        setFormData(prev => ({
          ...prev,
          user_id: userId,
          tutor_id: tutorId
        }))
        
        toast.success("User data refreshed successfully")
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
      toast.error("Failed to refresh user data")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate required fields
    if (!formData.title?.trim()) {
      toast.error("Please enter a session title")
      return
    }
    
    // Validate time order if both times are provided
    if (formData.start_time && formData.end_time && new Date(formData.start_time) >= new Date(formData.end_time)) {
      toast.error("End time must be after start time")
      return
    }
    
    // Get current IDs (fallback to state if form data is null)
    const finalUserId = formData.user_id || currentUserId
    const finalTutorId = formData.tutor_id || currentTutorId
    
    console.log("ID validation check:", {
      formDataUserId: formData.user_id,
      formDataTutorId: formData.tutor_id,
      currentUserId: currentUserId,
      currentTutorId: currentTutorId,
      finalUserId: finalUserId,
      finalTutorId: finalTutorId
    })
    
    if (!finalUserId || !finalTutorId) {
      toast.error("User authentication required. Please refresh and try again.")
      console.error("Missing IDs:", { finalUserId, finalTutorId })
      return
    }

    setLoading(true)
    
    try {
      // Prepare payload - ensure all required fields are included with final IDs
      const payload = {
        title: formData.title.trim(),
        course_name: formData.course_name.trim(),
        session_link: formData.session_link?.trim() || "",
        session_password: formData.session_password?.trim() || "",
        topic: formData.topic?.trim() || "",
        start_time: formData.start_time,
        end_time: formData.end_time,
        user_id: finalUserId,
        tutor_id: finalTutorId
      }

      console.log("Final payload being submitted:", payload)
      console.log("Payload types:", {
        user_id_type: typeof payload.user_id,
        tutor_id_type: typeof payload.tutor_id,
        user_id_value: payload.user_id,
        tutor_id_value: payload.tutor_id
      })

      const response = await axios.post("/group-tutoring-sessions", payload)
      
      console.log("Group session created successfully:", response.data)
      toast.success("Group session created successfully!")
      
      // Redirect back to sessions list or dashboard
      setTimeout(() => {
        router.push("/lms/tutor-dashboard/sessions/session-list")
      }, 1500)
      
    } catch (error) {
      console.error("Error creating group session:", error)
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(`Failed to create session: ${error.response.data.message}`)
      } else {
        toast.error("Failed to create group session. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Session Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Session Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter session title (e.g., Advanced Mathematics Group Study)"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full"
        />
      </div>

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="course_name" className="text-sm font-medium">
          Course Name
        </Label>
        <Input
          id="course_name"
          type="text"
          placeholder="Enter course name (e.g., Mathematics 101, Physics Advanced)"
          value={formData.course_name}
          onChange={(e) => handleInputChange("course_name", e.target.value)}
          className="w-full"
        />
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-medium">
          Session Topic
        </Label>
        <Textarea
          id="topic"
          placeholder="Describe the main topics to be covered in this session"
          value={formData.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
          className="w-full min-h-[80px]"
        />
      </div>

      {/* Date and Time Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Start Time
          </Label>
          <DateTimePicker
            value={formData.start_time}
            onChange={(date) => handleInputChange("start_time", date)}
            placeholder="Select start date and time"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            End Time
          </Label>
          <DateTimePicker
            value={formData.end_time}
            onChange={(date) => handleInputChange("end_time", date)}
            placeholder="Select end date and time"
          />
        </div>
      </div>

      {/* Session Link */}
      <div className="space-y-2">
        <Label htmlFor="session_link" className="text-sm font-medium">
          Session Link
        </Label>
        <Input
          id="session_link"
          type="url"
          placeholder="Enter meeting link (Google Meet, Zoom, etc.)"
          value={formData.session_link}
          onChange={(e) => handleInputChange("session_link", e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Provide the link where students can join the group session
        </p>
      </div>

      {/* Session Password */}
      <div className="space-y-2">
        <Label htmlFor="session_password" className="text-sm font-medium">
          Session Password
        </Label>
        <Input
          id="session_password"
          type="text"
          placeholder="Enter meeting password (if required)"
          value={formData.session_password}
          onChange={(e) => handleInputChange("session_password", e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Optional password for the meeting room
        </p>
      </div>

      {/* User Info Display (for debugging/confirmation) */}
      {/* <div className="rounded-lg bg-muted/50 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Session Details & Debug Info</h3>
          <Button 
            type="button"
            size="sm" 
            variant="outline" 
            onClick={refreshUserData}
            className="text-xs h-7"
          >
            Refresh User Data
          </Button>
        </div>
        <div className="text-xs space-y-1">
          <p><strong>State Values:</strong></p>
          <p>• Current User ID: {currentUserId || 'Not loaded'}</p>
          <p>• Current Tutor ID: {currentTutorId || 'Not loaded'}</p>
          <p><strong>Form Data Values:</strong></p>
          <p>• Form User ID: {formData.user_id || 'Not set'}</p>
          <p>• Form Tutor ID: {formData.tutor_id || 'Not set'}</p>
          <p><strong>Ready for submission:</strong> {(formData.user_id && formData.tutor_id) ? '✅ Yes' : '❌ No - Missing IDs'}</p>
        </div>
      </div> */}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-400"
        >
          {loading ? "Creating Session..." : "Create Group Session"}
        </Button>
      </div>
    </form>
  )
}
