"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight, User, BookOpen, DollarSign, GraduationCap } from "lucide-react"
import axios from "@/lib/axios"

export default function Page() {
    const [students, setStudents] = useState([]) // [{ student, enrollments }]
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedStudents, setExpandedStudents] = useState(new Set())

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students
                const studentsRes = await axios.get("/student-guardian-accesses/guardian-student-list")
                const studentsData = studentsRes?.data?.data || []
                // Fetch all enrollments
                const enrollmentsRes = await axios.get("/student-course-enrollments")
                const allEnrollments = enrollmentsRes?.data?.data || []
                // Fetch all courses (for price info)
                const coursesRes = await axios.get("/courses")
                const allCourses = coursesRes?.data?.data || []
                const courseMap = {}
                allCourses.forEach((c) => {
                    courseMap[c.id] = c
                })
                // Compose student/enrollments
                const studentsWithEnrollments = studentsData.map((student) => {
                    const studentId = student.student_id || student.id
                    const enrollments = allEnrollments
                        .filter((enr) => enr.student_id === studentId)
                        .map((enr) => ({
                            ...enr,
                            course: courseMap[enr.course_id] || {},
                        }))
                    return {
                        student: {
                            id: studentId,
                            name: student.student_name,
                            email: student.student?.email || "",
                        },
                        enrollments,
                    }
                })
                setStudents(studentsWithEnrollments)
                setLoading(false)
            } catch (err) {
                setError("Failed to load payment history. Please try again later.")
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const toggleStudent = (studentId) => {
        const newExpanded = new Set(expandedStudents)
        if (newExpanded.has(studentId)) {
            newExpanded.delete(studentId)
        } else {
            newExpanded.add(studentId)
        }
        setExpandedStudents(newExpanded)
    }

    const calculateStudentTotal = (enrollments) => {
        return enrollments.reduce((total, enrollment) => total + (enrollment.paid_fee_amount || 0), 0)
    }

    const calculateGrandTotal = () => {
        return students.reduce((grandTotal, studentData) => {
            return grandTotal + calculateStudentTotal(studentData.enrollments)
        }, 0)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return dateString
            ? new Date(dateString).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              })
            : "N/A"
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Student Course Enrollments</h1>
                <p className="text-muted-foreground">
                    Click on a student name to view their enrolled courses and payment details
                </p>
            </div>

            {/* Summary Card */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                            <div className="text-sm text-muted-foreground">Total Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {students.reduce((total, student) => total + student.enrollments.length, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Enrollments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{formatCurrency(calculateGrandTotal())}</div>
                            <div className="text-sm text-muted-foreground">Grand Total Revenue</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student List */}
            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-[300px] text-red-500">{error}</div>
            ) : (
                <div className="space-y-4">
                    {students.length === 0 ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <p className="text-gray-500">No students found</p>
                        </div>
                    ) : (
                        students.map((studentData) => {
                            const isExpanded = expandedStudents.has(studentData.student.id)
                            const studentTotal = calculateStudentTotal(studentData.enrollments)

                            return (
                                <Card key={studentData.student.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-3 p-0 h-auto hover:bg-transparent"
                                                onClick={() => toggleStudent(studentData.student.id)}
                                            >
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="text-lg font-semibold">{studentData.student.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{studentData.student.email}</p>
                                                    </div>
                                                </div>
                                            </Button>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">{formatCurrency(studentTotal)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {studentData.enrollments.length} course{studentData.enrollments.length !== 1 ? "s" : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="pt-0">
                                            <Separator className="mb-4" />
                                            <div className="space-y-4">
                                                {studentData.enrollments.map((enrollment) => (
                                                    <Card key={enrollment.id} className="bg-gray-50">
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                                                    <div>
                                                                        <CardTitle className="text-base">{enrollment.course.name}</CardTitle>
                                                                        <CardDescription className="mt-1">
                                                                            {enrollment.course.short_description}
                                                                        </CardDescription>
                                                                    </div>
                                                                </div>
                                                                <Badge variant={enrollment.course_completion_percentage > 50 ? "default" : "secondary"}>
                                                                    {enrollment.course_completion_percentage || 0}% Complete
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="pt-0">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium">Duration</div>
                                                                    <div className="text-sm text-muted-foreground">{enrollment.course.course_duration}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium">Modules</div>
                                                                    <div className="text-sm text-muted-foreground">{enrollment.course.number_of_modules}</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium">Video Lessons</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {enrollment.course.number_of_video_lessons}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium">Credits</div>
                                                                    <div className="text-sm text-muted-foreground">{enrollment.course.credits}</div>
                                                                </div>
                                                            </div>

                                                            <Separator className="my-4" />

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="text-sm font-medium">Enrollment Date</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {formatDate(enrollment.enrollment_date)}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="text-sm font-medium flex items-center gap-1">
                                                                        <DollarSign className="h-4 w-4" />
                                                                        Payment Details
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-sm">
                                                                            <span>Regular Fee:</span>
                                                                            <span className="line-through text-muted-foreground">
                                                                                {formatCurrency(enrollment.course.regular_price || 0)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between text-sm">
                                                                            <span>Discounted Price:</span>
                                                                            <span>{formatCurrency(enrollment.regular_fee_amount || 0)}</span>
                                                                        </div>
                                                                        {enrollment.scholarship_amount > 0 && (
                                                                            <div className="flex justify-between text-sm">
                                                                                <span>Scholarship:</span>
                                                                                <span className="text-green-600">
                                                                                    -{formatCurrency(enrollment.scholarship_amount)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        <Separator />
                                                                        <div className="flex justify-between text-sm font-medium">
                                                                            <span>Amount Paid:</span>
                                                                            <span className="text-green-600">{formatCurrency(enrollment.paid_fee_amount || 0)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}
