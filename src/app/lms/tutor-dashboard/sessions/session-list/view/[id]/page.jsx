'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ReviewModal from './_components/ReviewModal'
import EditSessionModal from './_components/EditSessionModal'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  BookOpen,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Star,
  Edit
} from 'lucide-react'
import { toast } from 'sonner'

export default function SessionViewPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true)
        console.log('Fetching session details for ID:', params.id)
        
        const response = await axios.get(`/student-tutoring-sessions/${params.id}`)
        console.log('Session details received:', response.data)
        
        setSession(response.data?.data || response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching session details:', err)
        setError('Failed to load session details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSessionDetails()
    }
  }, [params.id])

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSessionStatus = (session) => {
    if (!session) return { status: 'unknown', color: 'gray', icon: AlertCircle }
    
    if (session.completed_or_cancelled) {
      return { 
        status: 'Completed', 
        color: 'green', 
        icon: CheckCircle,
        bgClass: 'bg-green-100 text-green-700'
      }
    } else {
      return { 
        status: 'Scheduled', 
        color: 'blue', 
        icon: Calendar,
        bgClass: 'bg-blue-100 text-blue-700 border-blue-300'
      }
    }
  }

  const handleSessionUpdated = (updatedSession) => {
    setSession(updatedSession)
    setIsEditModalOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-blue-50/30 blur-sm"></div>
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Session Details</h2>
                <p className="text-lg text-gray-600">Please wait while we fetch your session information...</p>
                
                {/* Loading skeleton */}
                <div className="mt-8 space-y-4 max-w-md mx-auto">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4 hover:bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-lg w-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center py-16 px-8">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Session Not Found</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {error || "We couldn't find the session you're looking for. It may have been moved or deleted."}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.back()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl w-full font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go Back
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/lms/tutor-dashboard/sessions/session-list')}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl w-full font-semibold"
                  >
                    View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getSessionStatus(session)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 hover:bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Tutoring Session</p>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                      Session #{session.student_tutoring_session_number || session.id}
                    </h1>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge className={`${statusInfo.bgClass} border-0 shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-semibold`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {statusInfo.status}
                  </Badge>
                  
                  {session.course?.name && (
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                      {session.course.name}
                    </Badge>
                  )}
                  
                  {formatDateTime(session.class_date) !== 'N/A' && (
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {new Date(session.class_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:ml-8">
                {session.google_meet_link && (
                  <Button 
                    onClick={() => {
                      if (session?.google_meet_link) {
                        window.open(session.google_meet_link, '_blank')
                      }
                    }}
                    className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg px-6 py-3 h-12 font-semibold"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Join Meeting
                  </Button>
                )}
                
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg px-6 py-3 h-12 font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Session Details Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                <CardTitle className="text-3xl text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  Session Details
                </CardTitle>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Course</span>
                    </div>
                    <p className="text-lg text-gray-800 font-semibold pl-16">{session.course?.name || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Session Type</span>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-16">
                      {session.course_master_lesson?.name && (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-300 px-4 py-2 font-semibold rounded-full">
                          {session.course_master_lesson.name}
                        </Badge>
                      )}
                      {session.new_or_repeat_session ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300 px-4 py-2 font-semibold rounded-full">New Session</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-300 px-4 py-2 font-semibold rounded-full">Repeat Session</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Module</span>
                    </div>
                    <p className="text-lg text-gray-800 font-semibold pl-16">{session.course_module?.title || 'Not specified'}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Lesson</span>
                    </div>
                    <p className="text-lg text-gray-800 font-semibold pl-16">{session.course_lesson?.title || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center pt-6 border-t-2 border-gray-100">
                  {session.is_requested ? (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-blue-700">Requested Session</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-green-700">Approved Session</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Information */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
                <CardTitle className="text-3xl text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  Schedule & Timing
                </CardTitle>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-xl text-gray-700 block mb-2">Class Date & Time</span>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatDateTime(session.class_date)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-md">
                          <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-emerald-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Start Time</p>
                              <p className="text-lg font-bold text-gray-900">{formatTime(session.class_start_time)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-md">
                          <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-rose-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">End Time</p>
                              <p className="text-lg font-bold text-gray-900">{formatTime(session.class_end_time)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-gray-700">Created</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 pl-13">{formatDateTime(session.created_at)}</p>
                    </div>
                    
                    {session.updated_at !== session.created_at && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border-2 border-amber-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-700">Updated</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 pl-13">{formatDateTime(session.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - People Info */}
          <div className="space-y-6">
            
            {/* Student Information */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Student Information
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center pb-6 border-b-2 border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {session.student?.full_name?.charAt(0) || 
                     session.student?.first_name?.charAt(0) || 'S'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {session.student?.full_name || 
                     (session.student?.first_name && session.student?.last_name 
                       ? `${session.student.first_name} ${session.student.last_name}` 
                       : 'Student Name N/A')}
                  </h3>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-full font-semibold">
                    Student
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {session.student?.email_address && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                          <p className="text-base font-bold text-gray-800 break-all">{session.student.email_address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {session.student?.mobile_number && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 border-2 border-green-200 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Mobile Number</p>
                          <p className="text-base font-bold text-gray-800">{session.student.mobile_number}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!session.student?.email_address && !session.student?.mobile_number && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-6 border-2 border-gray-200 text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No additional contact information available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tutor Information */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Tutor Information
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center pb-6 border-b-2 border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {session.tutor?.name?.charAt(0) || 'T'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{session.tutor?.name || 'Tutor Name N/A'}</h3>
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-full font-semibold">
                    Tutor
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {session.tutor?.personal_email && (
                    <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-5 border-2 border-rose-200 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                          <p className="text-base font-bold text-gray-800 break-all">{session.tutor.personal_email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {session.tutor?.mobile && (
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-5 border-2 border-teal-200 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Mobile Number</p>
                          <p className="text-base font-bold text-gray-800">{session.tutor.mobile}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!session.tutor?.personal_email && !session.tutor?.mobile && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-6 border-2 border-gray-200 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No additional contact information available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-white via-white to-blue-50/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50/30"></div>
            <CardContent className="relative p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Actions</h2>
                <p className="text-gray-600">Manage your tutoring session with the options below</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 h-14 text-lg font-semibold rounded-xl transform hover:scale-105"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Leave a Review
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/lms/tutor-dashboard/sessions/session-list')}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-4 h-14 text-lg font-semibold rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Back to All Sessions
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Session Date</p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">
                      {new Date(session.class_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Duration</p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">
                      {formatTime(session.class_start_time)} - {formatTime(session.class_end_time)}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <User className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Student</p>
                    <p className="text-xs font-semibold text-gray-900 mt-1 truncate">
                      {session.student?.first_name || 'Student'}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <StatusIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Status</p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">{statusInfo.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          session={session}
          onReviewSubmitted={(reviewData) => {
            console.log('Review submitted:', reviewData)
            // Optionally refresh session data or show success message
          }}
        />

        {/* Edit Session Modal */}
        <EditSessionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          session={session}
          onSessionUpdated={handleSessionUpdated}
        />
      </div>
    </div>
  )
}
