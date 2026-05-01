"use client"

import Footer from "@/components/layout/footer/Footer";
import dynamic from "next/dynamic"
import ContextWrapper from "@/components/shared/wrappers/ContextWrapper"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const Header = dynamic(() => import("@/components/layout/header/Header"), {
  ssr: false,
  loading: () => <div className="h-[120px] bg-white" />,
})

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState("pending")
  const [courseId, setCourseId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
  function extractCourseIdOrScholarship() {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get('session_id')
      const paymentIntentId = urlParams.get('payment_intent')

      // Try sources in order of priority
      // Check for scholarship first
      if (urlParams.get('scholarship_id')) return { type: 'scholarship', id: urlParams.get('scholarship_id') }

      const sources = [
        () => urlParams.get('tutors_course_id'),
        () => sessionId && sessionStorage.getItem(`payment_session_${sessionId}`),
        () => urlParams.get('courseId'),
        () => sessionStorage.getItem('current_checkout_course_id'),
        () => localStorage.getItem('last_purchased_course_id')
      ]

      for (const source of sources) {
        const id = source()
        if (id) return { type: 'course', id }
      }

      return null
    }

    async function createEnrollment(courseIdToEnroll, type = 'course') {
      try {
        setIsProcessing(true)
        const response = type === 'scholarship'
          ? await axios.post('/stripe/scholarship-enroll', { scholarship_id: parseInt(courseIdToEnroll) })
          : await axios.post('/edumarket/enrollments/confirm', { course_id: parseInt(courseIdToEnroll) })

        const isSuccess = response.status >= 200 && response.status < 300
        const successData = response.data.data?.success || response.data.success

        if (isSuccess && successData) {
          setEnrollmentStatus("success")
          handleRedirect(courseIdToEnroll, 2000)
        } else {
          handleError(response.data.data?.error || response.data.error || response.data.message, courseIdToEnroll)
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
        handleError(errorMsg, courseIdToEnroll)
      } finally {
        setIsProcessing(false)
      }
    }

    function handleRedirect(id, delay) {
      setIsRedirecting(true)
      setTimeout(() => {
        router.push(`/learninghub/course-dashboard/${id}`)
      }, delay)
    }

    function handleError(msg, id) {
      setErrorMessage(msg + ". Please contact support.")
      setEnrollmentStatus("error")
      handleRedirect(id, 5000)
    }

    async function initializePage() {
      const extracted = extractCourseIdOrScholarship()
      if (!extracted) {
        setErrorMessage('Could not determine which purchase you made. Please contact support.')
        setEnrollmentStatus('error')
        return
      }

      setCourseId(extracted.id)

      if (!isProcessing) {
        await createEnrollment(extracted.id, extracted.type)
      }
    }

    initializePage()
  }, [router, isProcessing])

  return (
    <ContextWrapper>
      <Header />
      <div className="min-h-[50vh] bg-slate-50/80 flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-lg border-slate-200 shadow-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Payment received
            </CardTitle>
            <CardDescription className="text-slate-600 text-base space-y-3">
              <p>Thank you — your transaction completed successfully.</p>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Status
                </p>
                {enrollmentStatus === "pending" && isProcessing && (
                  <p className="text-blue-700 font-medium">
                    Step 2 of 2: Creating your enrollment…
                  </p>
                )}

                {enrollmentStatus === "success" && (
                  <p className="text-emerald-700 font-medium">
                    Enrollment confirmed — you have access to your course.
                  </p>
                )}

                {isRedirecting && (
                  <p className="text-blue-700 font-medium">
                    Redirecting to your course dashboard…
                  </p>
                )}

                {enrollmentStatus === "error" && (
                  <p className="text-amber-800 font-medium">
                    Payment succeeded, but enrollment needs a quick follow-up.
                    Use the button below to open your course; if anything looks
                    wrong, contact support with your receipt.
                  </p>
                )}

                {errorMessage && (
                  <p className="mt-2 text-red-700 text-sm font-medium">
                    {errorMessage}
                  </p>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center gap-3 pb-8">
            {courseId ? (
              <Button
                className="bg-slate-900 hover:bg-slate-800"
                onClick={() => router.push(`/learninghub/course-dashboard/${courseId}`)}
                disabled={isProcessing}
              >
                Go to course dashboard
              </Button>
            ) : (
              <Link href="/learninghub/courses">
                <Button variant="outline" className="w-full sm:w-auto border-slate-300">
                  Browse courses
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </ContextWrapper>
  )
}
