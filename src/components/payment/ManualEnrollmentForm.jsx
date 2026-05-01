"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ManualEnrollmentForm({ courseId, courseName, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  async function handleEnroll() {
    if (isProcessing) return

    try {
      setIsProcessing(true)
      setError(null)

      const response = await axios.post("/edumarket/enrollments/confirm", {
        course_id: parseInt(courseId)
      })

      setIsSuccess(true)
      setTimeout(() => router.push(`/learninghub/course-dashboard/${courseId}`), 2000)

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create enrollment")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enroll in Course</CardTitle>
        <CardDescription>{courseName || `Course #${courseId}`}</CardDescription>
      </CardHeader>

      <CardContent>
        {!isSuccess ? (
          <div className="space-y-4">
            <p>Click below to confirm your enrollment in this course.</p>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-600 mb-2">Enrollment Successful!</h3>
            <p>You have been successfully enrolled in this course.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to course dashboard...</p>
          </div>
        )}
      </CardContent>

      {!isSuccess && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleEnroll} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Enroll Now"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
