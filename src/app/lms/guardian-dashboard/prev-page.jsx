'use client';
import logo from '@/assets/icons/admin_logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from '@/lib/axios';
import {
  Brain,
  Trophy,
  UserPlus,
  Video
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GuardianDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddStudent = () => {
    router.push('/lms/guardian-dashboard/students/add');
  };

  const handleViewDetails = (studentId) => {
    router.push(`/lms/guardian-dashboard/students/${studentId}`);
  };

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
    fetchStudents();
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

  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await axios.get('/exam-report/generate');
        console.log("reports==", response?.data?.data || []);
      } catch (err) {
        console.error('Failed to load report cards:', err);
      }
    };
    getReports();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1 py-6 md:py-8">
          <header className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              src={logo}
              alt="ScholarPASS Logo"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">
                ScholarPASS Guardian Dashboard
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm sm:text-base">
                Empowering your child's educational journey
              </p>
            </div>
          </header>

          <Card className="mb-6 md:mb-8 bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Welcome to ScholarPASS</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We combine AI Technology, Live Tutoring & scholarships for your
                kids' education success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Card className="bg-gradient-to-r from-blue-700 to-purple-700 text-white">
                  <CardContent className="pt-4 sm:pt-6">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">LearningART</h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      AI-powered assessments and personalized learning paths
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-700 to-orange-500 text-white">
                  <CardContent className="pt-4 sm:pt-6">
                    <Video className="h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Live Tutors</h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      One-on-one tutoring for all K-12 subjects
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500 text-white">
                  <CardContent className="pt-4 sm:pt-6">
                    <Trophy className="h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">ScholarPASS</h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      Up to 100% scholarship coverage available
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">My Students</CardTitle>
                    <CardDescription className="text-sm">Manage enrolled students</CardDescription>
                  </div>
                  <Button
                    onClick={handleAddStudent}
                    className="relative overflow-hidden text-white whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[200px] sm:h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-[200px] sm:h-[300px] text-red-500">
                    {error}
                  </div>
                ) : (
                  <ScrollArea className="h-[200px] sm:h-[300px] pr-4">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <div
                          key={student.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-lg mb-3 sm:mb-4 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={student.student?.profile_picture} />
                            <AvatarFallback>
                              {student.student_name?.[0] || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base truncate">
                              {student.student_name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Grade {student.student?.master_k12_grade_id || 'Not specified'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress
                                value={student.progress || 0}
                                className="h-2"
                              />
                              <span className="text-xs sm:text-sm font-medium">
                                {student.progress || 0}%
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(student.student.id)}
                            className="relative overflow-hidden text-white w-full sm:w-auto"
                            style={{
                              background: 'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center items-center h-[200px] sm:h-[300px]">
                        <p className="text-gray-500">No students found</p>
                      </div>
                    )}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Report Cards</CardTitle>
                    <CardDescription className="text-sm">Academic performance reports</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] sm:h-[300px] pr-4">
                  {[1, 2, 3, 4].map((report) => (
                    <div
                      key={report}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg mb-3 sm:mb-4 bg-white"
                    >
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base">Term {report} Report</h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          2023-24 Academic Year
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="relative overflow-hidden text-white w-full sm:w-auto"
                        style={{
                          background: 'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                        }}
                      >
                        View Report
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card> */}
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Tutoring Sessions</CardTitle>
                <CardDescription className="text-sm">
                  Upcoming and completed sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] sm:h-[250px] pr-4">
                  {[
                    {
                      id: 1,
                      type: 'upcoming',
                      subject: 'Mathematics',
                      tutor: 'Dr. Smith',
                      date: '2023-12-15',
                    },
                    {
                      id: 2,
                      type: 'completed',
                      subject: 'Physics',
                      tutor: 'Prof. Johnson',
                      date: '2023-12-10',
                    },
                    {
                      id: 3,
                      type: 'upcoming',
                      subject: 'Chemistry',
                      tutor: 'Ms. Davis',
                      date: '2023-12-18',
                    },
                    {
                      id: 4,
                      type: 'completed',
                      subject: 'Biology',
                      tutor: 'Dr. Wilson',
                      date: '2023-12-08',
                    },
                  ].map((session) => (
                    <div
                      key={session.id}
                      className="p-3 sm:p-4 border rounded-lg mb-3 sm:mb-4 bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base">
                            {session.subject} Session
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            with {session.tutor}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {session.date}
                          </p>
                        </div>
                        <Badge
                          className="relative overflow-hidden text-white whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                          }}
                          variant={session.type === 'upcoming' ? 'outline' : 'default'}
                        >
                          {session.type === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
                        {session.type === 'completed' ? (
                          <div className="flex items-center text-yellow-500">
                            {Array(5)
                              .fill(null)
                              .map((_, i) => (
                                <Trophy key={i} className="h-3 w-3 sm:h-4 sm:w-4" />
                              ))}
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500">
                            Scheduled
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant={session.type === 'upcoming' ? 'outline' : 'default'}
                          className="w-full sm:w-auto"
                        >
                          {session.type === 'upcoming' ? 'Reschedule' : 'Review'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recommended Courses</CardTitle>
                <CardDescription className="text-sm">
                  Personalized course suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[150px] sm:h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-[150px] sm:h-[200px] text-red-500">
                    {error}
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <CarouselItem key={course.id} className="sm:basis-1/2">
                            <Card>
                              <CardContent className="p-3 sm:p-4">
                                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-blue-500" />
                                <h4 className="font-semibold text-sm sm:text-base">{course.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                  {course.course_category?.name || 'General Course'}
                                </p>
                                <Button
                                  size="sm"
                                  className="relative overflow-hidden text-white w-full"
                                  style={{
                                    background: 'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                                  }}
                                >
                                  Learn More
                                </Button>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))
                      ) : (
                        <div className="flex justify-center items-center h-[150px] sm:h-[200px]">
                          <p className="text-gray-500">No courses found</p>
                        </div>
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                  </Carousel>
                )}
              </CardContent>
            </Card>
          </div> */}

          {/* <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6 md:mb-8">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Grow Our Learning Community
                  </h3>
                  <p className="opacity-90 mb-4 text-sm sm:text-base">
                    Refer new students and create learning groups for
                    collaborative success
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    <Button
                      variant="secondary"
                      className="bg-white text-blue-500 hover:bg-gray-100"
                      size="sm"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Refer Students
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-white text-purple-500 hover:bg-gray-100"
                      size="sm"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Create Learning Group
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm mt-3 sm:mt-4">
                    Get up to 25% off on your next payment for each successful
                    referral!
                  </p>
                </div>
                <Users className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 opacity-20" />
              </div>
            </CardContent>
          </Card> */}

          {/* <TutorOpportunities /> */}
        </div>
      </div>
    </div>
  );
}