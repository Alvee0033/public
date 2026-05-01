'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GuardianAllCourses() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [loadingEnrollments, setLoadingEnrollments] = useState({});
  const [courseDetails, setCourseDetails] = useState({});

  const handleAddStudent = () => {
    router.push('/lms/guardian-dashboard/students/add');
  };

  const fetchCourseDetails = async (courseId) => {
    if (!courseId || courseDetails[courseId]) return;

    try {
      const response = await axios.get(`/courses/${courseId}`);
      setCourseDetails((prev) => ({
        ...prev,
        [courseId]: response?.data?.data || { name: 'Unnamed Course' },
      }));
    } catch (err) {
      setCourseDetails((prev) => ({
        ...prev,
        [courseId]: { name: 'Unnamed Course' },
      }));
    }
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get('/student-course-enrollments');

        return response?.data?.data || [];
      } catch (err) {
        console.error('Failed to fetch enrolled courses:', err);
        return [];
      }
    };
    fetchEnrolledCourses();
  }, []);

  const meDetails = axios.post('/auth/me');

  useEffect(() => {
    const fetchEnCourses = async () => {
      try {
        const res = await axios.get(`/student-course-enrollments`);

        return res?.data?.data || [];
      } catch (err) {
        console.error('Failed to fetch enrolled courses:', err);
        return [];
      }
    };
    fetchEnCourses();
  }, []);

  const fetchStudentEnrollments = async (studentId) => {
    try {
      setLoadingEnrollments((prev) => ({ ...prev, [studentId]: true }));

      const response = await axios.get('/student-course-enrollments');
      const allEnrollments = response?.data?.data || [];
      const studentEnrollments = allEnrollments.filter(
        (enrollment) => enrollment.student_id === studentId
      );

      await Promise.all(
        studentEnrollments.map((enrollment) =>
          enrollment.course_id
            ? fetchCourseDetails(enrollment.course_id)
            : Promise.resolve()
        )
      );

      setEnrollments((prev) => ({
        ...prev,
        [studentId]: studentEnrollments,
      }));
    } catch (err) {
      setEnrollments((prev) => ({
        ...prev,
        [studentId]: [],
      }));
    } finally {
      setLoadingEnrollments((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          '/student-guardian-accesses/guardian-student-list'
        );

        const studentsData = response?.data?.data || [];
        setStudents(studentsData);

        studentsData.forEach((student) => {
          const studentIdToUse = student.student_id || student.id;
          if (studentIdToUse) {
            fetchStudentEnrollments(studentIdToUse);
          }
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load students. Please try again later.');
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Courses</CardTitle>
              <CardDescription>
                All Your Students Enrolled Courses
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[300px] text-red-500">
              {error}
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              {students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg mb-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.student?.profile_picture} />
                      <AvatarFallback>
                        {student.student_name?.[0] || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{student.student_name}</h4>
                      <p className="text-sm text-gray-500">
                        Grade{' '}
                        {student.student?.master_k12_grade_id ||
                          'Not specified'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.progress || 0}
                          className="mt-2"
                        />
                        <span className="text-sm font-medium">
                          {student.progress || 0}%
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // const studentIdToUse = student.student_id || student.id;
                            // fetchStudentEnrollments(studentIdToUse);
                            fetchEnrolledCourses();
                          }}
                        >
                          View Courses
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                        {(() => {
                          const studentIdToUse =
                            student.student_id || student.id;

                          if (loadingEnrollments[studentIdToUse]) {
                            return (
                              <DropdownMenuItem className="justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                              </DropdownMenuItem>
                            );
                          } else if (enrollments[studentIdToUse]?.length > 0) {
                            return enrollments[studentIdToUse].map(
                              (enrollment) => {
                                const courseName =
                                  enrollment.course?.name ||
                                  courseDetails[enrollment.course_id]?.name ||
                                  `Course #${enrollment.course_id || 'N/A'}`;

                                return (
                                  <DropdownMenuItem
                                    key={enrollment.id}
                                    className="flex flex-col items-start"
                                  >
                                    <span className="font-medium">
                                      {courseName}
                                    </span>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-gray-500">
                                        Enrollment Date:{' '}
                                        {new Date(
                                          enrollment.enrollment_date
                                        ).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Status:{' '}
                                        {enrollment.open_or_closed_course
                                          ? 'Active'
                                          : 'Closed'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Progress:{' '}
                                        {enrollment.course_completion_percentage ||
                                          0}
                                        %
                                      </span>
                                    </div>
                                  </DropdownMenuItem>
                                );
                              }
                            );
                          } else {
                            return (
                              <DropdownMenuItem className="text-gray-500">
                                No courses enrolled
                              </DropdownMenuItem>
                            );
                          }
                        })()}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-[300px]">
                  <p className="text-gray-500">No students found</p>
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
