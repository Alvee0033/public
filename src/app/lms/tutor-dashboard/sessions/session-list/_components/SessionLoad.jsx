'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useAppSelector } from '@/redux/hooks'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Users, Video, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const SessionLoad = () => {
  const router = useRouter()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTutorId, setCurrentTutorId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const sessionsPerPage = 10
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user)

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Navigation handler
  const handleViewSession = (sessionId) => {
    router.push(`/lms/tutor-dashboard/sessions/session-list/view/${sessionId}`)
  }

  const handleDeleteClick = (session, event) => {
    event.stopPropagation() // Prevent row click
    setSessionToDelete(session)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return

    try {
      setDeleting(true)
      console.log('Deleting session:', sessionToDelete.id)
      
      await axios.delete(`/student-tutoring-sessions/${sessionToDelete.id}`)
      
      // Remove the session from the list
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionToDelete.id))
      
      toast.success('Session deleted successfully!')
      setDeleteModalOpen(false)
      setSessionToDelete(null)
      
    } catch (error) {
      console.error('Error deleting session:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to delete session. Please try again.'
      
      toast.error(errorMessage)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  // Get user ID from Redux store or JWT token
  const userIdFromStore = useSelector((state) => state.user?.userId)

  useEffect(() => {
    // Get current tutor ID from localStorage user object
    let tutorId = null

    if (typeof window !== 'undefined') {
      // First try to get from localStorage user object
      const userString = localStorage.getItem('user')
      if (userString) {
        try {
          const user = JSON.parse(userString)
          tutorId = user?.tutor_id
          console.log('Found tutor_id from localStorage user:', tutorId)
        } catch (error) {
          console.error('Error parsing user from localStorage:', error)
        }
      }

      // If no tutor_id found in user object, try JWT token as fallback
      if (!tutorId) {
        const token = localStorage.getItem('auth-token')
        if (token) {
          try {
            const decoded = jwtDecode(token)
            tutorId = decoded?.tutor_id || decoded?.id
            console.log('Fallback to JWT token, found ID:', tutorId)
          } catch (error) {
            console.error('Invalid token:', error)
          }
        }
      }
    }

    // Fallback to Redux store if still no tutor ID
    if (!tutorId) {
      tutorId = userIdFromStore
      console.log('Fallback to Redux store:', tutorId)
    }

    setCurrentTutorId(tutorId)
    console.log('Current tutor ID set to:', tutorId)
  }, [userIdFromStore])

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        console.log('Getting tutor_id from user data...')
        
        // Get tutor ID from Redux state
        const tutorId = user?.tutor_id;
        
        if (!tutorId) {
          setError('Tutor ID not found. Please ensure you are logged in as a tutor.')
          setLoading(false)
          return
        }

        console.log('Found tutor_id from user data:', tutorId)
        setCurrentTutorId(tutorId)

        // Fetch sessions with limit to get more results
        console.log('Fetching sessions from API...')
        const response = await axios.get('/student-tutoring-sessions?limit=1000')
        let sessionsData = Array.isArray(response.data?.data) ? response.data.data : (response.data ? [response.data] : [])
        
        console.log('Total sessions received from API:', sessionsData.length)
        console.log('Sample session structure:', sessionsData[0])
        
        // Filter sessions where the tutor matches current tutor_id
        const filteredSessions = sessionsData.filter(session => {
          let sessionTutorId = session.tutor
          
          // Handle tutor field - it might be an object or just an ID
          if (sessionTutorId && typeof sessionTutorId === 'object') {
            sessionTutorId = sessionTutorId._id || sessionTutorId.id || sessionTutorId.tutor_id
          }
          
          const matches = sessionTutorId && String(sessionTutorId) === String(tutorId)
          
          // Debug logging for first few sessions
          if (sessionsData.indexOf(session) < 5) {
            console.log('Session filtering debug:', {
              sessionId: session.id,
              sessionTutor: session.tutor,
              sessionTutorId: sessionTutorId,
              currentTutorId: tutorId,
              matches: matches
            })
          }
          
          return matches
        })

        console.log(`Filtered ${filteredSessions.length} sessions out of ${sessionsData.length} total sessions for tutor ID: ${tutorId}`)
        
        // Sort sessions in descending order by class_date (newest first)
        filteredSessions.sort((a, b) => {
          const dateA = new Date(a.class_date || a.created_at || 0)
          const dateB = new Date(b.class_date || b.created_at || 0)
          return dateB - dateA // Descending order
        })
        
        setSessions(filteredSessions)
        setError(null)
      } catch (err) {
        console.error('Error fetching sessions:', err)
        setError('Failed to load sessions. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchSessions()
    } else {
      setLoading(false)
    }
  }, [user])

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSessionStatusBadge = (session) => {
    if (session.completed_or_cancelled) {
      return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    }
    // return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
    //   <Clock className="w-3 h-3 mr-1" />
    //   Scheduled
    // </Badge>
  }

  const getAttendanceBadge = (studentPresent, tutorPresent) => {
    if (studentPresent && tutorPresent) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <Users className="w-3 h-3 mr-1" />
        Both Present
      </Badge>
    } else if (studentPresent) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
        Student Only
      </Badge>
    } else if (tutorPresent) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
        Tutor Only
      </Badge>
    }
    return <Badge variant="destructive">
      <XCircle className="w-3 h-3 mr-1" />
      None Present
    </Badge>
  }

  // Filter sessions based on search term
  const filteredSessions = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return sessions
    }

    const searchLower = debouncedSearchTerm.toLowerCase()
    return sessions.filter(session => {
      const sessionNumber = String(session.student_tutoring_session_number || session.id)
      const sessionDate = formatDateTime(session.class_date)
      const sessionStatus = session.completed_or_cancelled ? 'completed' : 'scheduled'
      const sessionType = session.new_or_repeat_session ? 'new' : 'repeat'

      return (
        sessionNumber.includes(searchLower) ||
        sessionDate.toLowerCase().includes(searchLower) ||
        sessionStatus.includes(searchLower) ||
        sessionType.includes(searchLower)
      )
    })
  }, [sessions, debouncedSearchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage)
  const startIndex = (currentPage - 1) * sessionsPerPage
  const endIndex = startIndex + sessionsPerPage
  const currentSessions = filteredSessions.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Loading Sessions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading your sessions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            Error Loading Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Tutoring Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No sessions assigned to you</p>
            <p className="text-sm text-muted-foreground">Sessions assigned to you as a tutor will appear here once scheduled.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Tutoring Sessions ({filteredSessions.length})
          </CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No sessions found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View - Hidden on Desktop/Tablet */}
            <div className="block md:hidden space-y-4">
              {currentSessions.map((session) => (
                <Card key={session.id} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewSession(session.id)}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-base text-blue-600">
                            Session #{session.student_tutoring_session_number || session.id}
                          </div>
                          <div className="font-medium text-sm text-primary mt-1">
                            {session.student?.full_name || (session.student?.first_name && session.student?.last_name ? `${session.student.first_name} ${session.student.last_name}` : 'Student Name Not Available')}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {session.new_or_repeat_session ? (
                              <Badge variant="outline" className="text-xs">New</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Repeat</Badge>
                            )}
                            {session.is_requested ? (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Requested
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                Approved
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSessionStatusBadge(session)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={(e) => handleDeleteClick(session, e)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(session.class_date)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTime(session.class_start_time)} - {formatTime(session.class_end_time)}
                        </div>
                      </div>

                      {/* Attendance */}
                      {/* <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Attendance:</span>
                          {getAttendanceBadge(session.student_present, session.tutor_present)}
                        </div>
                      </div> */}

                      {/* Join Button */}
                      {session.google_meet_link && (
                        <div className="pt-2">
                          <a 
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold min-w-[150px]">Title</TableHead>
                      <TableHead className="font-semibold min-w-[180px]">Date & Time</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Student Name</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                      {/* <TableHead className="font-semibold min-w-[120px]">Attendance</TableHead> */}
                      <TableHead className="font-semibold min-w-[100px]">Join Link</TableHead>
                      <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="min-w-[150px] cursor-pointer" onClick={() => handleViewSession(session.id)}>
                          <div className="space-y-1">
                            <div className="font-medium text-blue-600 hover:text-blue-800 transition-colors">Session #{session.student_tutoring_session_number || session.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              {session.class_date ? (
                                <>
                                  <Calendar className="w-3 h-3" />
                                  {formatDateTime(session.class_date)}
                                </>
                              ) : (
                                <span>-</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {session.class_start_time && session.class_end_time ? (
                                <>
                                  <span>{formatTime(session.class_start_time)} - {formatTime(session.class_end_time)}</span>
                                  {getSessionStatusBadge(session)}
                                </>
                              ) : (
                                <span>-</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="space-y-1">
                            {(() => {
                              const studentName = session.student?.full_name || 
                                                (session.student?.first_name && session.student?.last_name ? 
                                                  `${session.student.first_name} ${session.student.last_name}` : '-')
                              
                              return studentName === '-' ? (
                                <span className="text-sm text-muted-foreground">-</span>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-blue-800 border-blue-200 px-3 py-1 text-sm font-medium">
                                  {studentName}
                                </Badge>
                              )
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center gap-1">
                            {session.is_requested ? (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Pending
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                Approved
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        {/* <TableCell className="min-w-[120px]">
                          {getAttendanceBadge(session.student_present, session.tutor_present)}
                        </TableCell> */}
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center gap-2">
                            {session.google_meet_link && (
                              <a 
                                href={session.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video className="w-3 h-3" />
                                Join
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={(e) => handleDeleteClick(session, e)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tablet Card View - Shows on medium screens */}
            <div className="hidden md:block lg:hidden space-y-4">
              {currentSessions.map((session) => (
                <Card key={session.id} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewSession(session.id)}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium text-base text-blue-600">
                            Session #{session.student_tutoring_session_number || session.id}
                          </div>
                          <div className="font-medium text-sm text-primary mt-1">
                            {session.student?.full_name || (session.student?.first_name && session.student?.last_name ? `${session.student.first_name} ${session.student.last_name}` : 'Student Name Not Available')}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {getSessionStatusBadge(session)}
                            {session.new_or_repeat_session ? (
                              <Badge variant="outline" className="text-xs">New</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Repeat</Badge>
                            )}
                            {session.is_requested ? (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Requested
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                Approved
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Calendar className="w-3 h-3" />
                            {formatDateTime(session.class_date)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(session.class_start_time)} - {formatTime(session.class_end_time)}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        {/* <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">Attendance</div>
                          {getAttendanceBadge(session.student_present, session.tutor_present)}
                        </div> */}

                        <div className="flex items-center justify-between">
                          {session.google_meet_link && (
                            <a 
                              href={session.google_meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex-1 justify-center mr-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Video className="w-4 h-4" />
                              Join Meeting
                            </a>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={(e) => handleDeleteClick(session, e)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls - Responsive */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredSessions.length)} of {filteredSessions.length} sessions
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show fewer pages on smaller screens
                        return page === 1 || 
                               page === totalPages || 
                               Math.abs(page - currentPage) <= 1
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0 text-sm"
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        )
                      })
                    }
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "Session #{sessionToDelete?.student_tutoring_session_number || sessionToDelete?.id}"? 
                This action cannot be undone and will permanently remove the session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm} 
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default SessionLoad