'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Search, User, Users, Plus, Check, X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks"

export function AddStudentModal({ isOpen, onClose, groupId, onStudentAdded }) {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [currentTutorId, setCurrentTutorId] = useState(null)

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user)

  // Fetch tutor's students when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTutorStudents()
    }
  }, [isOpen])

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(item => 
        String(item.student_id).includes(searchTerm) ||
        String(item.student?.id).includes(searchTerm) ||
        (item.student?.full_name && item.student.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.student?.first_name && item.student.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.student?.last_name && item.student.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredStudents(filtered)
    }
  }, [searchTerm, students])

  const fetchTutorStudents = async () => {
    try {
      setLoading(true)
      
      // Get tutor ID from Redux state
      const tutorId = user?.tutor_id;
      
      if (!tutorId) {
        toast.error("Unable to get tutor information")
        return
      }
      
      setCurrentTutorId(tutorId)
      
      // Fetch all pages of tutor's students (handle pagination)
      let allStudentsData = []
      let page = 1
      let hasMore = true
      
      while (hasMore) {
        const response = await axios.get('/tutor-students', { 
          params: { page, limit: 100 }
        })
        const pageData = Array.isArray(response.data?.data) ? response.data.data : []
        allStudentsData = allStudentsData.concat(pageData)
        
        // Check pagination info
        const pagination = response.data?.pagination
        if (pagination && page < pagination.totalPages) {
          page += 1
        } else {
          hasMore = false
        }
      }
      
      // Filter by current tutor
      const tutorStudents = allStudentsData.filter(item => 
        item.tutor_id && String(item.tutor_id) === String(tutorId)
      )
      
      console.log(`Found ${tutorStudents.length} students for tutor ${tutorId}`)
      console.log('Filtered students:', tutorStudents)
      setStudents(tutorStudents)
      setFilteredStudents(tutorStudents)
      
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentToggle = (studentItem) => {
    // Only allow single selection - if clicking the same student, deselect
    if (selectedStudent && selectedStudent.id === studentItem.id) {
      setSelectedStudent(null)
    } else {
      setSelectedStudent(studentItem)
    }
  }

  const handleAddStudents = async () => {
    if (!selectedStudent) {
      toast.error("Please select a student")
      return
    }

    try {
      setLoading(true)
      
      // Make API call to add student to group
      const payload = {
        group_id: parseInt(groupId, 10),
        student_id: selectedStudent.student_id
      }
      
      console.log("Adding student to group:", payload)
      console.log("Types:", {
        group_id_type: typeof payload.group_id,
        student_id_type: typeof payload.student_id
      })
      
      const response = await axios.post('/group-student-map', payload)
      
      console.log("API response:", response.data)
      
      toast.success(`Successfully added ${selectedStudent.student?.full_name || `Student ${selectedStudent.student_id}`} to the group`)
      
      // Notify parent component
      if (onStudentAdded) {
        onStudentAdded([selectedStudent])
      }
      
      // Reset and close
      setSelectedStudent(null)
      setSearchTerm("")
      onClose()
      
    } catch (error) {
      console.error("Error adding student to group:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to add student to group"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedStudent(null)
    setSearchTerm("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Add Student to Group Session
          </DialogTitle>
          <DialogDescription>
            Select a student from your assigned list to add to this group session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search student by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Student Summary */}
          {selectedStudent && (
            <div className="p-3 bg-primary/5 rounded-lg border">
              <p className="text-sm font-medium text-primary mb-2">
                Selected Student
              </p>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="default" 
                  className="flex items-center gap-1"
                >
                  {selectedStudent.student?.full_name || `Student ID: ${selectedStudent.student_id}`}
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading students...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No student found matching your search" : "No students available"}
                </p>
              </div>
            ) : (
              filteredStudents.map((studentItem) => {
                const isSelected = selectedStudent && selectedStudent.id === studentItem.id
                return (
                  <Card 
                    key={studentItem.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleStudentToggle(studentItem)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            {isSelected ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {studentItem.student?.full_name || `Student ${studentItem.student_id}`}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>ID: {studentItem.student_id}</span>
                              <span>• Sequence: {studentItem.display_sequence}</span>
                              {studentItem.student?.email_address && (
                                <span>• {studentItem.student.email_address}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStudentToggle(studentItem)
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddStudents}
            disabled={loading || !selectedStudent}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add Student
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
