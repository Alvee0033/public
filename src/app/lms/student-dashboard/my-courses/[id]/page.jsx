"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import parseHtml, { parseDangerousHtml } from "@/lib/parseHtml";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import {
  BookOpen,
  FileText,
  MessageSquare,
  PlayCircle,
  Hourglass,
  List,
  TvMinimalPlay,
  BookOpenCheck,
  Tv,
  Award,
  BarChart2,
  CheckCircle2,
  Clock,
  GraduationCap,
  LucideIcon,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { courseNotFound } from "@/assets/images";

export default function CourseDetails({ params }) {
  const { user } = useAppSelector(state => state.auth);
  const isStudent = user?.roles[0]?.toUpperCase() === 'STUDENT';
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch enrollment data
  const { data: EnrolledCourse, isLoading, error } = useSWR([params.id], async () => {
    const res = await axios.get(`/student-course-enrollments/${params.id}`);
    return res.data?.data || [];
  });

  const { course } = EnrolledCourse || {};

  // Fetch course modules
  const { data: courseModules, isLoading: moduleLoading, error: moduleError } = useSWR(
    EnrolledCourse?.id ? [EnrolledCourse?.id, "modules"] : null,
    async () => {
      const res = await axios.get(`/course-modules?filter=${encodeURIComponent(JSON.stringify({ course: EnrolledCourse?.course?.id }))}`);
      return res.data?.data || [];
    }
  );

  // Fetch tutor info
  const { data: tutor, error: tutorError } = useSWR(
    course?.primary_tutor_id ? [params.id, course?.primary_tutor_id] : null, 
    async () => {
      const res = await axios.get(`/tutors/${course?.primary_tutor_id}`);
      return res.data?.data || [];
    }
  );

  // Calculate total questions across all modules
  const totalQuestions = courseModules?.reduce((acc, module) => {
    return acc + (module.questions?.length || 0);
  }, 0);

  // Calculate completed modules
  const completedModules = 0; // Would be replaced with actual progress data
  const totalModules = courseModules?.length || 0;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  if (isLoading || moduleLoading) {
    return (
      <div className="p-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-[300px] bg-gray-200 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-screen-xl mx-auto">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Course</h2>
          <p className="text-gray-600">We couldn't load your course information. Please try again later.</p>
          <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
      {/* Course Header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg relative">
            <Image
              src={course?.image || courseNotFound}
              alt={course?.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Grade 12
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                AP Course
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{course?.name || "Course Name"}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                <span>Instructor: {tutor?.name || "Instructor"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>{course?.course_duration || "4 weeks"}</span>
              </div>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    {parseDangerousHtml(course?.description) || 
                      <p className="text-gray-600">This comprehensive Calculus course is designed for Grade 12 students preparing for AP exams, covering essential topics from limits and continuity to applications of integration.</p>
                    }
                  </div>
                  
                  <h3 className="font-semibold text-lg mt-6">Prerequisites</h3>
                  <div className="text-gray-600">
                    {parseHtml(course?.course_pre_requisition) || 
                      <p>A solid foundation in algebra, geometry, trigonometry, and precalculus is strongly recommended before beginning AP Calculus AB.</p>
                    }
                  </div>

                  <h3 className="font-semibold text-lg mt-6">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Limits and continuity concepts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Differentiation rules and techniques</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Applications of derivatives</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Integration methods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Differential equations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>AP exam preparation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-full text-blue-700 mb-3 mx-auto">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h4 className="text-center font-medium">{course?.number_of_modules || 10} Modules</h4>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-center h-10 w-10 bg-purple-100 rounded-full text-purple-700 mb-3 mx-auto">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <h4 className="text-center font-medium">{course?.number_of_video_lessons || 40} Video Lessons</h4>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center justify-center h-10 w-10 bg-amber-100 rounded-full text-amber-700 mb-3 mx-auto">
                        <BookOpenCheck className="h-5 w-5" />
                      </div>
                      <h4 className="text-center font-medium">{course?.number_of_quizzes || 20} Quizzes</h4>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full text-green-700 mb-3 mx-auto">
                        <Tv className="h-5 w-5" />
                      </div>
                      <h4 className="text-center font-medium">{course?.number_of_live_tutors_lessons || 10} Live Sessions</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {course?.course_faq && (
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-600">
                      {parseDangerousHtml(course?.course_faq)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Curriculum Tab */}
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Course Modules</span>
                    <Badge variant="outline" className="ml-2">
                      {courseModules?.length || 0} Modules
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {courseModules?.map((module, index) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`}>
                        <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
                          <div className="flex items-start gap-3 text-left">
                            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{module.title}</h3>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                {module.number_of_lessons > 0 && (
                                  <span className="flex items-center">
                                    <BookOpen className="h-3 w-3 mr-1" /> {module.number_of_lessons} lessons
                                  </span>
                                )}
                                {module.questions?.length > 0 && (
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" /> {module.questions.length} questions
                                  </span>
                                )}
                                {module.duration && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> {module.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3 pt-1">
                          <div className="ml-9 border-l border-gray-200 pl-4 space-y-3">
                            {module.short_description && (
                              <div className="text-sm text-gray-600">
                                {parseHtml(module.short_description)}
                              </div>
                            )}
                            
                            {module.course_lessons && module.course_lessons.length > 0 ? (
                              <div className="space-y-2">
                                {module.course_lessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50">
                                    <PlayCircle className="h-4 w-4 text-blue-600 mr-2" />
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 py-2">
                                Lessons will be available when you start this module
                              </div>
                            )}
                            
                            {module.questions && module.questions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h4 className="text-sm font-medium mb-2">Practice Questions</h4>
                                <div className="space-y-2">
                                  {module.questions.map((question, qIndex) => (
                                    <div key={question.id} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                      <span className="font-medium">Q{qIndex + 1}:</span> {question.question?.split('\n')[0]}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Discussions Tab */}
            <TabsContent value="discussions">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No discussions yet</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Be the first to start a discussion about this course. Ask questions, share insights, or connect with fellow students.
                    </p>
                    <Button className="mt-6" variant="outline">
                      Start a Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {completedModules}/{totalModules} modules completed
                    </span>
                    <span className="text-sm font-medium">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3">Course Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{course?.course_duration || "4 weeks"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Video Lessons</span>
                      <span className="font-medium">{course?.number_of_video_lessons || 40}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Live Sessions</span>
                      <span className="font-medium">{course?.number_of_live_tutors_lessons || 10}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Practice Questions</span>
                      <span className="font-medium">{totalQuestions || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span className="text-sm text-amber-800">Earn {course?.credits || 20} credits upon completion</span>
                </div>

                {EnrolledCourse?.status === "not_started" ? (
                  <Button className="w-full" size="lg">
                    <Link href={`/lms/student-dashboard/course-player/${EnrolledCourse?.id}`}>
                      Start Course
                    </Link>
                  </Button>
                ) : EnrolledCourse?.status === "in_progress" ? (
                  <Button className="w-full" size="lg">
                    <Link href={`/lms/student-dashboard/course-player/${EnrolledCourse?.id}`}>
                      Continue Learning
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg">
                    <Link href={`/lms/student-dashboard/course-player/${EnrolledCourse?.id}`}>
                      Review Course
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  Download Materials
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about this course? Contact your instructor or support team.
              </p>
              <Button variant="outline" className="w-full text-sm">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}