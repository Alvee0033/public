"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "@/lib/axios"
import { getStripe } from "@/lib/stripe"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

const PAYMENT_STATUSES = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error"
}

const PAYMENT_ELEMENT_OPTIONS = {
  layout: {
    type: 'tabs',
    defaultCollapsed: false,
  },
  fields: {
    billingDetails: {
      name: 'auto',
      email: 'auto',
    },
  },
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
  defaultValues: {
    billingDetails: {
      name: '',
      email: '',
    }
  },
}

const STRIPE_APPEARANCE = {
  theme: "stripe",
  variables: {
    colorPrimary: '#6366f1',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    borderRadius: '0.5rem',
  },
}

function CheckoutForm({ courseId, scholarshipId, onSuccess, onCancel, isMultiCourse }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES.IDLE)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (courseId) sessionStorage.setItem('current_checkout_course_id', courseId)
    if (scholarshipId) sessionStorage.setItem('current_checkout_scholarship_id', scholarshipId)
  }, [courseId, scholarshipId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)
    setPaymentStatus(PAYMENT_STATUSES.PROCESSING)
    setPaymentError("")

    try {
      const sessionId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

      if (typeof window !== 'undefined') {
        if (courseId) {
          sessionStorage.setItem('current_checkout_course_id', courseId)
          localStorage.setItem('last_purchased_course_id', courseId)
          sessionStorage.setItem(`payment_session_${sessionId}`, courseId)
        }
        if (scholarshipId) {
          sessionStorage.setItem('current_checkout_scholarship_id', scholarshipId)
          localStorage.setItem('last_purchased_scholarship_id', scholarshipId)
          sessionStorage.setItem(`payment_session_${sessionId}`, scholarshipId)
        }

        if (isMultiCourse) sessionStorage.setItem('multi_course_checkout', 'true')
      }

      const returnUrl = scholarshipId
        ? `${window.location.origin}/payment-result?scholarship_id=${scholarshipId}&session_id=${sessionId}`
        : `${window.location.origin}/payment-result?tutors_course_id=${courseId}&session_id=${sessionId}`

      if (onSuccess) {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        })

        if (error) {
          setPaymentStatus(PAYMENT_STATUSES.ERROR)
          setPaymentError(error.message)
          setIsProcessing(false)
        } else if (paymentIntent?.status === 'succeeded') {
          setPaymentStatus(PAYMENT_STATUSES.SUCCESS)
          onSuccess(paymentIntent)
        }
      } else {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: returnUrl },
        })

        if (error) {
          setPaymentStatus(PAYMENT_STATUSES.ERROR)
          setPaymentError(error.message)
          setIsProcessing(false)
        } else {
          setPaymentStatus(PAYMENT_STATUSES.SUCCESS)
        }
      }
    } catch (e) {
      setPaymentStatus(PAYMENT_STATUSES.ERROR)
      setPaymentError("An unexpected error occurred.")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4">
            <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="font-medium mb-1">Test Card Numbers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Success: 4242 4242 4242 4242</li>
              <li>Requires Auth: 4000 0025 0000 3155</li>
              <li>Declined: 4000 0000 0000 9995</li>
            </ul>
            <p className="mt-2">Use any future date for expiry and any 3 digits for CVC</p>
          </div>

          {paymentStatus === PAYMENT_STATUSES.PROCESSING && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-600">Processing Payment</AlertTitle>
              <AlertDescription className="text-blue-600">
                Please wait while we process your payment...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === PAYMENT_STATUSES.SUCCESS && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Payment Successful</AlertTitle>
              <AlertDescription className="text-green-600">
                Your payment has been processed successfully. Redirecting to your enrolled courses...
              </AlertDescription>
            </Alert>
          )}

          {paymentError && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">Payment Error</AlertTitle>
              <AlertDescription className="text-red-600">
                {paymentError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className={isProcessing ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function getAuthToken() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('auth-token')
  if (token) return token

  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'auth-token') return value
  }

  return null
}

async function createPaymentIntent({ isMultiCourse, totalAmount, courseId, scholarshipId }) {
  const token = getAuthToken()
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  let payload = {}
  if (isMultiCourse && totalAmount) {
    payload = { total_amount: totalAmount, is_multi_course: true }
  } else if (scholarshipId) {
    payload = { scholarship_id: parseInt(scholarshipId) }
  } else {
    payload = { course_id: parseInt(courseId) }
  }

  const response = await axios.post('/stripe/create-payment-intent', payload)

  if (!response.data) throw new Error("Invalid response from server: missing data")

  let secret = null

  if (response.data.status === 'SUCCESS' && response.data.data) {
    secret = response.data.data.clientSecret || response.data.data.client_secret
  } else if (response.data.client_secret || response.data.clientSecret) {
    secret = response.data.clientSecret || response.data.client_secret
  } else if (response.data.data?.clientSecret || response.data.data?.client_secret) {
    secret = response.data.data.clientSecret || response.data.data.client_secret
  } else if (response.data.id && response.data.object === 'payment_intent') {
    secret = response.data.client_secret
  }

  if (!secret) throw new Error("Invalid response from server: missing client secret")

  return secret
}

export default function StripePaymentForm({ courseId, scholarshipId, onSuccess, onCancel, isMultiCourse = false, totalAmount }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPaymentIntent() {
      try {
        setIsLoading(true)
        const secret = await createPaymentIntent({ isMultiCourse, totalAmount, courseId, scholarshipId })
        setClientSecret(secret)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

  if (courseId || scholarshipId) fetchPaymentIntent()
  }, [courseId, scholarshipId, isMultiCourse, totalAmount])

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Preparing payment...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="text-center p-8">
      <p className="text-red-500 mb-4">
        There was an error preparing your payment: {error}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        This may be due to an authentication issue. Please make sure you are logged in.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={onCancel}>Go Back</Button>
        <Button variant="outline" onClick={() => window.location.href = "/login"}>
          Log In
        </Button>
      </div>
    </div>
  )

  if (!clientSecret) return (
    <div className="text-center p-8">
      <p className="text-red-500 mb-4">
        Unable to initialize payment. Please try again.
      </p>
      {error && (
        <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-100 rounded">
          Error details: {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Button onClick={onCancel}>Go Back</Button>
        <Button
          variant="outline"
          onClick={() => {
            localStorage?.removeItem('current_checkout_course_id')
            sessionStorage?.removeItem('current_checkout_course_id')
            localStorage?.removeItem('current_checkout_scholarship_id')
            sessionStorage?.removeItem('current_checkout_scholarship_id')
            window.location.reload()
          }}
        >
          Refresh and Try Again
        </Button>
      </div>
    </div>
  )

  const stripeInstance = getStripe()

  if (!stripeInstance) return (
    <div className="text-center p-8">
      <p className="text-red-500 mb-4">
        Unable to initialize Stripe. The Stripe API key is missing.
      </p>
      <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-100 rounded">
        Please make sure the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is set correctly.
      </p>
      <Button onClick={onCancel}>Go Back</Button>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <Elements stripe={stripeInstance} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
        <CheckoutForm
          courseId={courseId}
          onSuccess={onSuccess}
          onCancel={onCancel}
          isMultiCourse={isMultiCourse}
        />
      </Elements>
    </div>
  )
}
