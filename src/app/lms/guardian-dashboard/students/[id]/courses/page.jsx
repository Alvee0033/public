'use client';

import { use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    GraduationCap,
    Users,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentCoursesPage({ params }) {
  const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBack = () => {
        router.back();
    };

    const fetchStudentAndCourses = async () => {
        try {
            // Fetch student details
            const studentResponse = await axios.get(`/students/${id}`);
            setStudent(studentResponse.data.data);

            // Fetch all student course enrollments and filter by student ID
            const enrollmentsResponse = await axios.get(`/student-course-enrollments?limit=1000`);
            const allEnrollments = enrollmentsResponse.data.data || [];

            // Filter enrollments for this specific student
            const studentEnrollments = allEnrollments.filter(enrollment =>
                enrollment.student_id?.toString() === id.toString() ||
                enrollment.student?.id?.toString() === id.toString()
            );

            setCourses(studentEnrollments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student courses:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentAndCourses();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <Card className="w-full max-w-sm">
                    <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600 text-center text-sm sm:text-base">
                            Loading student courses...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
                <Card className="w-full max-w-sm">
                    <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-red-600 text-center mb-4 text-sm sm:text-base">
                            Error: {error}
                        </p>
                        <Button onClick={handleBack} variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            size="sm"
                            className="shadow-sm bg-transparent w-fit"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden xs:inline">Back to Student</span>
                            <span className="xs:hidden">Back</span>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                                {student?.full_name}'s Courses
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                View all enrolled courses and progress
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student Info Card */}
                {student && (
                    <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3 sm:pb-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                                    <AvatarImage
                                        src={student.profile_picture || '/placeholder.svg?height=64&width=64'}
                                    />
                                    <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {student.full_name?.split(' ').map((n) => n[0]).join('') || 'S'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-xl flex flex-col text-gray-900 break-words">
                                        {student.full_name}
                                    </CardTitle>
                                    {/* <CardDescription className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4" />
                                        Student ID: {id}
                                    </CardDescription> */}
                                    <div className="flex items-center gap-2 mt-2">
                                        {student.verified_student ? (
                                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={student.active_or_archive ? 'default' : 'secondary'}
                                            className={`text-xs ${student.active_or_archive ? 'bg-green-500 hover:bg-green-600' : ''
                                                }`}
                                        >
                                            {student.active_or_archive ? 'Active' : 'Archived'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {courses.length > 0 ? (
                        courses.map((enrollment) => (
                            <Card key={enrollment.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-lg text-gray-900 break-words line-clamp-2">
                                                {enrollment.course?.name ||
                                                    enrollment.course?.title ||
                                                    `Course ID: ${enrollment.course_id}` ||
                                                    'Course Title'}
                                            </CardTitle>
                                            <CardDescription className="text-sm mt-1">
                                                {enrollment.course?.short_description?.replace(/<[^>]*>/g, '').substring(0, 100) ||
                                                    enrollment.course?.category ||
                                                    'Course Enrollment'}
                                            </CardDescription>
                                        </div>
                                        {/* <Badge
                                            variant={enrollment.open_or_closed_course ? 'default' : 'secondary'}
                                            className="text-xs flex-shrink-0"
                                        >
                                            {enrollment.open_or_closed_course ? 'Active' : 'Closed'}
                                        </Badge> */}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {enrollment.course?.primary_tutor_id && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-600 break-words">
                                                Tutor ID: {enrollment.course.primary_tutor_id}
                                            </span>
                                        </div>
                                    )}

                                    {enrollment.enrollment_date && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-600">
                                                Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {enrollment.course_completion_percentage !== null && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-purple-500" />
                                            <span className="text-gray-600">
                                                Progress: {enrollment.course_completion_percentage}%
                                            </span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-yellow-500" />
                                            <span className="text-gray-600">
                                                Regular: ${enrollment.regular_fee_amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-green-500" />
                                            <span className="text-gray-600">
                                                Paid: ${enrollment.paid_fee_amount}
                                            </span>
                                        </div>
                                    </div>

                                    {enrollment.scholarship_amount > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-600">
                                                Scholarship: ${enrollment.scholarship_amount}
                                            </span>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={() => router.push(`/lms/guardian-dashboard/courses/${enrollment.course_id}`)}
                                            disabled={!enrollment.course}
                                        >
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            {enrollment.course ? 'View Details' : 'Course Unavailable'}
                                        </Button>
                                    </div> */}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <GraduationCap className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No Courses Enrolled
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        This student hasn't enrolled in any courses yet.
                                    </p>
                                    {/* <Button
                                        onClick={() => router.push('/lms/guardian-dashboard/courses')}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        Browse Courses
                                    </Button> */}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
