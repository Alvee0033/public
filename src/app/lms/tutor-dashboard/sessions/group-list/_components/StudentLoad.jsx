'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, GraduationCap } from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'

const StudentLoad = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user)
  const [currentTutorId, setCurrentTutorId] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
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

        console.log('Found tutor_id from /me endpoint:', tutorId)
        setCurrentTutorId(tutorId)

        // Fetch students assigned to this tutor
        console.log('Fetching students from /tutor-students API...')
        const response = await axios.get('/tutor-students')
        let studentsData = Array.isArray(response.data?.data) ? response.data.data : (response.data ? [response.data] : [])
        
        console.log('Total tutor-students received from API:', studentsData.length)
        console.log('Sample tutor-student structure:', studentsData[0])
        
        // Filter students where the tutor matches current tutor_id
        const filteredStudents = studentsData.filter(item => {
          const matches = item.tutor && String(item.tutor) === String(tutorId)
          
          // Debug logging for first few items
          if (studentsData.indexOf(item) < 5) {
            console.log('Student filtering debug:', {
              itemId: item.id,
              itemTutor: item.tutor,
              currentTutorId: tutorId,
              matches: matches
            })
          }
          
          return matches
        })

        console.log(`Filtered ${filteredStudents.length} students out of ${studentsData.length} total for tutor ID: ${tutorId}`)
        setStudents(filteredStudents)
        setError(null)
      } catch (err) {
        console.error('Error fetching students:', err)
        setError('Failed to load students. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStudents()
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Loading Students...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading your students...</span>
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
            Error Loading Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (students.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No students assigned</p>
            <p className="text-sm text-muted-foreground">Students assigned to you as a tutor will appear here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Your Students ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {students.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Student ID: {item.student}</p>
                  <p className="text-sm text-muted-foreground">Sequence: {item.display_sequence}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentLoad