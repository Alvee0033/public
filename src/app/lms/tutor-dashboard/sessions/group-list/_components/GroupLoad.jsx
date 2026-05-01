'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAppSelector } from '@/redux/hooks'
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
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Users, Video, Eye, MapPin, Search, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
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

const GroupLoad = () => {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTutorId, setCurrentTutorId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        console.log('Getting tutor_id from Redux state...')
        
        // Get the current user's tutor_id from Redux state
        const tutorId = user?.tutor_id;
        
        if (!tutorId) {
          setError('Tutor ID not found. Please ensure you are logged in as a tutor.')
          setLoading(false)
          return
        }

        console.log('Found tutor_id from Redux state:', tutorId)
        setCurrentTutorId(tutorId)

        // Fetch group sessions with limit to get more results
        console.log('Fetching group sessions from API...')
        const response = await axios.get('/group-tutoring-sessions?limit=1000')
        let groupsData = Array.isArray(response.data?.data) ? response.data.data : (response.data ? [response.data] : [])
        
        console.log('Total group sessions received from API:', groupsData.length)
        console.log('Sample group session structure:', groupsData[0])
        
        // Filter groups where the tutor_id matches current tutor_id
        const filteredGroups = groupsData.filter(group => {
          const matches = group.tutor_id && String(group.tutor_id) === String(tutorId)
          
          // Debug logging for first few groups
          if (groupsData.indexOf(group) < 5) {
            console.log('Group filtering debug:', {
              groupId: group.id,
              groupTutorId: group.tutor_id,
              currentTutorId: tutorId,
              matches: matches
            })
          }
          
          return matches
        })

        console.log(`Filtered ${filteredGroups.length} group sessions out of ${groupsData.length} total for tutor ID: ${tutorId}`)
        setGroups(filteredGroups)
        setError(null)
      } catch (err) {
        console.error('Error fetching group sessions:', err)
        setError('Failed to load group sessions. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (user?.tutor_id) {
      fetchGroups()
    }
  }, [user?.tutor_id])

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

  const getSessionStatusBadge = (group) => {
    const now = new Date()
    const startTime = new Date(group.start_time)
    const endTime = new Date(group.end_time)
    
    if (endTime < now) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
        <Clock className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    } else if (startTime <= now && endTime > now) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <Video className="w-3 h-3 mr-1" />
        Live Now
      </Badge>
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
        <Calendar className="w-3 h-3 mr-1" />
        Scheduled
      </Badge>
    }
  }

  const handleViewGroup = (groupId) => {
    router.push(`/lms/tutor-dashboard/sessions/group-list/view/${groupId}`)
  }

  const handleDeleteClick = (group, event) => {
    event.stopPropagation() // Prevent row click
    setGroupToDelete(group)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return

    try {
      setDeleting(true)
      console.log('Deleting group session:', groupToDelete.id)
      
      await axios.delete(`/group-tutoring-sessions/${groupToDelete.id}`)
      
      // Remove the group from the list
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupToDelete.id))
      
      toast.success('Group session deleted successfully!')
      setDeleteModalOpen(false)
      setGroupToDelete(null)
      
    } catch (error) {
      console.error('Error deleting group session:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to delete group session. Please try again.'
      
      toast.error(errorMessage)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setGroupToDelete(null)
  }

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return groups
    }

    const searchLower = debouncedSearchTerm.toLowerCase()
    return groups.filter(group => {
      const groupName = String(group.title || '').toLowerCase()
      const courseName = String(group.course_name || '').toLowerCase()
      const groupId = String(group.id || '').toLowerCase()
      const location = String(group.location || '').toLowerCase()
      const studentCount = String(group.students?.length || 0)

      return (
        groupName.includes(searchLower) ||
        courseName.includes(searchLower) ||
        groupId.includes(searchLower) ||
        location.includes(searchLower) ||
        studentCount.includes(searchLower)
      )
    })
  }, [groups, debouncedSearchTerm])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Loading Group Sessions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading your group...</span>
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
            <Users className="w-5 h-5" />
            Error Loading Group Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (groups.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No group sessions found</p>
            <p className="text-sm text-muted-foreground">Group sessions assigned to you as a tutor will appear here once created.</p>
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
            <Users className="w-5 h-5" />
            Your Groups ({filteredGroups.length})
          </CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search groups by name, course, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredGroups.length === 0 && searchTerm ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No groups found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or clear the search to see all groups.</p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Course</TableHead>
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Meeting Link</TableHead>
                  <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                <TableRow 
                  key={group.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleViewGroup(group.id)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-primary hover:underline">
                        {group.title || `Group Session #${group.id}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* ID: {group.id} */}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{group.course_name}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatDateTime(group.start_time)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Duration: {formatTime(group.start_time)} - {formatTime(group.end_time)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {group.session_link && (
                        <div className="flex items-center gap-1 text-xs">
                          <Video className="w-3 h-3" />
                          <span className="text-green-600">Meeting Link Available</span>
                        </div>
                      )}
                      {group.session_password && (
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span className="text-amber-600">Password Protected</span>
                        </div>
                      )}
                      {!group.session_link && (
                        <span className="text-xs text-muted-foreground">No meeting link</span>
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
                          onClick={(e) => handleDeleteClick(group, e)}
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
        )}

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{groupToDelete?.title || `Group Session #${groupToDelete?.id}`}"? 
                This action cannot be undone and will permanently remove the group session.
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

export default GroupLoad
