'use client'

import { useState } from 'react'
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Clock, BookOpen, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

// Star Rating Component
const StarRating = ({ value, onChange, label, description }) => {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-0 border-0 bg-transparent cursor-pointer transition-colors"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoverValue || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  )
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  session,
  onReviewSubmitted 
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_engagement_rating: 0,
    student_punctuality_rating: 0,
    student_learning_effort_rating: 0,
    tutor_comments: '',
    total_session_score: 0
  })

  // Calculate total session score based on ratings
  const calculateTotalScore = (engagement, punctuality, effort) => {
    if (engagement === 0 && punctuality === 0 && effort === 0) return 0
    return Math.round((engagement + punctuality + effort) / 3 * 10) / 10
  }

  const handleRatingChange = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    
    // Auto-calculate total session score
    const totalScore = calculateTotalScore(
      field === 'student_engagement_rating' ? value : updatedData.student_engagement_rating,
      field === 'student_punctuality_rating' ? value : updatedData.student_punctuality_rating,
      field === 'student_learning_effort_rating' ? value : updatedData.student_learning_effort_rating
    )
    
    updatedData.total_session_score = totalScore
    setFormData(updatedData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.student_engagement_rating || !formData.student_punctuality_rating || !formData.student_learning_effort_rating) {
      toast.error('Please provide ratings for all categories')
      return
    }

    if (!formData.tutor_comments.trim()) {
      toast.error('Please provide your comments about the session')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        student_engagement_rating: formData.student_engagement_rating,
        student_punctuality_rating: formData.student_punctuality_rating,
        student_learning_effort_rating: formData.student_learning_effort_rating,
        tutor_comments: formData.tutor_comments.trim(),
        review_date_time: new Date().toISOString(),
        total_session_score: formData.total_session_score,
        course_student_tutoring_session: session.id,
        student: session.student?.id || session.student_id,
        tutor: session.tutor?.id || session.tutor_id,
        student_success_employee: null // Will be set by backend if needed
      }

      console.log('Submitting review payload:', payload)

      const response = await axios.post('/student-tutoring-rating-by-tutors', payload)
      
      console.log('Review submitted successfully:', response.data)
      
      toast.success('Review submitted successfully!')
      
      // Reset form
      setFormData({
        student_engagement_rating: 0,
        student_punctuality_rating: 0,
        student_learning_effort_rating: 0,
        tutor_comments: '',
        total_session_score: 0
      })
      
      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data)
      }
      
      onClose()
      
    } catch (error) {
      console.error('Error submitting review:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to submit review. Please try again.'
      
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
            <MessageSquare className="w-5 h-5" />
            Leave a Review
          </DialogTitle>
          <DialogDescription>
            Share your feedback about the tutoring session with{' '}
            <span className="font-medium">
              {session.student?.full_name || 
               (session.student?.first_name && session.student?.last_name 
                 ? `${session.student.first_name} ${session.student.last_name}` 
                 : 'the student')}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Session:</span> #{session.student_tutoring_session_number || session.id}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {new Date(session.class_date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Categories */}
          <div className="space-y-6">
            {/* Student Engagement */}
            <Card>
              <CardContent className="pt-4">
                <StarRating
                  value={formData.student_engagement_rating}
                  onChange={(value) => handleRatingChange('student_engagement_rating', value)}
                  label={
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student Engagement
                    </div>
                  }
                  description="How actively did the student participate in the session?"
                />
              </CardContent>
            </Card>

            {/* Student Punctuality */}
            <Card>
              <CardContent className="pt-4">
                <StarRating
                  value={formData.student_punctuality_rating}
                  onChange={(value) => handleRatingChange('student_punctuality_rating', value)}
                  label={
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Student Punctuality
                    </div>
                  }
                  description="Was the student on time and prepared for the session?"
                />
              </CardContent>
            </Card>

            {/* Learning Effort */}
            <Card>
              <CardContent className="pt-4">
                <StarRating
                  value={formData.student_learning_effort_rating}
                  onChange={(value) => handleRatingChange('student_learning_effort_rating', value)}
                  label={
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Student Learning Effort
                    </div>
                  }
                  description="How much effort did the student put into learning?"
                />
              </CardContent>
            </Card>
          </div>

          {/* Overall Score Display */}
          {formData.total_session_score > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Session Score:</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{formData.total_session_score}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Session Comments *
            </Label>
            <Textarea
              id="comments"
              placeholder="Share your thoughts about this session, the student's progress, areas for improvement, or any other feedback..."
              value={formData.tutor_comments}
              onChange={(e) => setFormData({ ...formData, tutor_comments: e.target.value })}
              className="min-h-[120px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || formData.tutor_comments.trim().length < 10}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Review'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
