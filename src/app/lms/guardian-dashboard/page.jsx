'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from '@/lib/axios';
import {
    AlertCircle,
    BookOpen,
    Eye,
    GraduationCap,
    Search,
    Sparkles,
    UserPlus,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageStudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [guardianName, setGuardianName] = useState('Guardian');

    const handleAddStudent = () => {
        router.push('/lms/guardian-dashboard/students/add');
    };

    const handleViewDetails = (studentId) => {
        router.push(`/lms/guardian-dashboard/students/${studentId}`);
    };

    // Filter students based on search term
    const filteredStudents = students.filter((student) =>
        student.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate statistics
    const totalStudents = students.length;
    const activeStudents = students.filter(
        (s) => s.student?.active_or_archive
    ).length;
    const averageProgress =
        students.length > 0
            ? Math.round(
                students.reduce((sum, s) => sum + (s.progress || 0), 0) /
                students.length
            )
            : 0;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    '/student-guardian-accesses/guardian-student-list'
                );
                setStudents(response?.data?.data || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load students. Please try again later.');
                setLoading(false);
            }
        };

        const fetchGuardianName = async () => {
            try {
                const response = await axios.post('/auth/me');
                const firstName = response?.data?.data?.first_name;
                const lastName = response?.data?.data?.last_name;
                if (firstName) {
                    setGuardianName(firstName);
                }
                if (lastName) {
                    setGuardianName((prev) => `${prev} ${lastName}`);
                }
            } catch (err) {
                console.error('Failed to fetch guardian name:', err);
            }
        };

        fetchStudents();
        fetchGuardianName();
    }, []);

    // useEffect(() => {
    //   const fetchCourses = async () => {
    //     try {
    //       const response = await axios.get('/courses');
    //       setCourses(response?.data?.data || []);
    //       setLoading(false);
    //     } catch (err) {
    //       setError('Failed to load courses. Please try again later.');
    //       setLoading(false);
    //     }
    //   };

    //   fetchCourses();
    // }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-8 w-8 text-purple-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome, {guardianName}!
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Manage and monitor your students' academic journey with
                        comprehensive insights and tools
                    </p>
                </div>

                {/* Statistics Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">
                                            Total Students
                                        </p>
                                        <p className="text-3xl font-bold">{totalStudents}</p>
                                    </div>
                                    <Users className="h-12 w-12 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">
                                            Active Students
                                        </p>
                                        <p className="text-3xl font-bold">{activeStudents}</p>
                                    </div>
                                    <GraduationCap className="h-12 w-12 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">
                                            Average Progress
                                        </p>
                                        <p className="text-3xl font-bold">{averageProgress}%</p>
                                    </div>
                                    <TrendingUp className="h-12 w-12 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                )}

                {/* Main Content Card */}
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <BookOpen className="h-6 w-6" />
                                    My Students
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    Manage and monitor your enrolled students
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white/90 border-white/20 focus:border-white text-black"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddStudent}
                                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Student
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-[400px] space-y-4">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 font-medium">
                                        Loading student details...
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Please wait while we fetch your data
                                    </p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col justify-center items-center h-[400px] space-y-4">
                                <div className="bg-red-100 p-4 rounded-full">
                                    <AlertCircle className="h-12 w-12 text-red-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-red-600 font-medium text-lg">
                                        Oops! Something went wrong
                                    </p>
                                    <p className="text-gray-600">{error}</p>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="mt-4"
                                        variant="outline"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <ScrollArea className="h-[500px] pr-4">
                                {filteredStudents.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredStudents.map((student, index) => (
                                            <Card
                                                key={student.id}
                                                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-center space-x-6">
                                                        {/* Avatar Section */}
                                                        <div className="relative">
                                                            <Avatar className="h-16 w-16 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                                                                <AvatarImage
                                                                    src={
                                                                        student.student?.profile_picture ||
                                                                        '/placeholder.svg?height=64&width=64'
                                                                    }
                                                                    alt={student.student_name}
                                                                />
                                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                                                                    {student.student_name?.[0] || 'S'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1">
                                                                <Badge
                                                                    variant={
                                                                        student.student?.active_or_archive
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                    className={`text-xs ${student.student?.active_or_archive
                                                                        ? 'bg-green-500 hover:bg-green-600'
                                                                        : 'bg-gray-400'
                                                                        }`}
                                                                >
                                                                    {student.student?.active_or_archive
                                                                        ? 'Active'
                                                                        : 'Inactive'}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Student Info Section */}
                                                        <div className="flex-1 space-y-3">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                    {student.student_name}
                                                                </h4>
                                                                <div className="flex items-center gap-4 mt-1">
                                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                        <GraduationCap className="h-4 w-4" />
                                                                        Grade{' '}
                                                                        {student.student?.master_k12_grade_id ||
                                                                            'Not specified'}
                                                                    </p>
                                                                    {student.student?.verified_student && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs bg-green-50 text-green-700 border-green-200"
                                                                        >
                                                                            Verified
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Progress Section */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-gray-600">
                                                                        Overall Progress
                                                                    </span>
                                                                    <span className="text-sm font-bold text-blue-600">
                                                                        {student.progress || 0}%
                                                                    </span>
                                                                </div>
                                                                <div className="relative">
                                                                    <Progress
                                                                        value={student.progress || 0}
                                                                        className="h-3 bg-gray-200"
                                                                    />
                                                                    <div
                                                                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                                                        style={{
                                                                            width: `${student.progress || 0}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="flex flex-col items-end space-y-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleViewDetails(student.student.id)
                                                                }
                                                                className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                            {/* <p className="text-xs text-gray-400">
                                Student ID: {student.student.id}
                              </p> */}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center h-[400px] space-y-6">
                                        <div className="bg-gray-100 p-6 rounded-full">
                                            <Users className="h-16 w-16 text-gray-400" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-semibold text-gray-700">
                                                {searchTerm
                                                    ? 'No students found'
                                                    : 'No students enrolled yet'}
                                            </h3>
                                            <p className="text-gray-500 max-w-md">
                                                {searchTerm
                                                    ? `No students match "${searchTerm}". Try adjusting your search.`
                                                    : 'Start building your student roster by adding your first student.'}
                                            </p>
                                            {!searchTerm && (
                                                <Button
                                                    onClick={handleAddStudent}
                                                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                >
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Add Your First Student
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
