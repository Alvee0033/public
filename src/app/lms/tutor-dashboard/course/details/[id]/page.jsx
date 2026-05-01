"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Award, 
  BookOpen, 
  Users, 
  Star, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  Plus
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CourseDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchCourse() {
      try {
        const filter = encodeURIComponent(JSON.stringify({ id }));
        const url = `/courses?limit=1&filter=${filter}`;
        const res = await axios.get(url);
        let courseData = res.data.data?.[0] || null;
        
        if (courseData) {
          // Calculate accurate counts from the actual data
          const moduleCount = Array.isArray(courseData.course_modules) ? courseData.course_modules.length : 0;
          const lessonCount = Array.isArray(courseData.course_lessons) ? courseData.course_lessons.length : 0;
          const assignmentCount = Array.isArray(courseData.course_assignments) ? courseData.course_assignments.length : 0;
          const quizCount = Array.isArray(courseData.course_lesson_quizs) ? courseData.course_lesson_quizs.length : 0;
          
          // Update course data with accurate counts
          courseData = {
            ...courseData,
            number_of_modules: moduleCount,
            number_of_book_lessons: lessonCount,
            number_of_quizzes: quizCount,
            number_of_assignments: assignmentCount,
          };
        }
        
        setCourse(courseData);
      } catch (error) {
        setCourse(null);
      }
      setLoading(false);
    }
    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-slate-700" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Badge className="ml-auto" variant={course.course_approved ? "success" : "destructive"}>
              {course.course_approved ? "Approved" : "Pending"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.name}</h1>
              
              <div className="prose prose-invert text-slate-300 mb-4 max-w-none">
                {course.short_description ? (
                  <div dangerouslySetInnerHTML={{ __html: course.short_description }} />
                ) : (
                  <p className="italic">No short description available.</p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center text-sm gap-4 mb-6">
                {course.course_category?.name && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.course_category.name}
                  </div>
                )}
                
                {course.course_duration && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.course_duration}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrolled_students || 0} students
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last updated {new Date(course.updated_at).toLocaleDateString()}
                </div>
                
                {course.is_trending_course && (
                  <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                    <Award className="h-4 w-4 mr-1" />
                    Trending
                  </Badge>
                )}
                
                {course.rating_score > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    {course.rating_score}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <Button 
                  variant="outline" 
                  className="bg-white text-slate-800 hover:bg-slate-100"
                  onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/add-module`)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Module
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-white text-slate-800 hover:bg-slate-100"
                  onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/modules`)}
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  View Modules ({course.number_of_modules || 0})
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg text-slate-800">
                <div className="relative bg-slate-100 h-48 flex items-center justify-center">
                  {course.image ? (
                    <Image 
                      src={course.image} 
                      alt={course.name}
                      fill
                      style={{objectFit: "cover"}}
                    />
                  ) : (
                    <BookOpen className="h-20 w-20 text-slate-400" />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <span className="font-medium">Price:</span>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">${course.discounted_price || course.regular_price || 0}</span>
                      {course.discounted_percentage > 0 && (
                        <>
                          <span className="ml-2 text-gray-400 line-through">${course.regular_price}</span>
                          <Badge className="ml-2 bg-green-600">{course.discounted_percentage}% off</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {course.number_of_modules || 0} modules
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {course.number_of_book_lessons || 0} lessons
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {course.number_of_quizzes || 0} quizzes
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {course.number_of_assignments || 0} assignments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="flex h-10 rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary h-full rounded-none bg-transparent px-4 font-medium data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="modules" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary h-full rounded-none bg-transparent px-4 font-medium data-[state=active]:shadow-none"
              >
                Modules & Lessons
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary h-full rounded-none bg-transparent px-4 font-medium data-[state=active]:shadow-none"
              >
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {course.description ? (
                          <div dangerouslySetInnerHTML={{ __html: course.description }} />
                        ) : (
                          <p className="text-gray-500">No description available.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          {course.course_pre_requisition ? (
                            <div dangerouslySetInnerHTML={{ __html: course.course_pre_requisition }} />
                          ) : (
                            <p className="text-gray-500">No prerequisites specified.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>What You'll Learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          {course.course_outcome ? (
                            <div dangerouslySetInnerHTML={{ __html: course.course_outcome }} />
                          ) : (
                            <p className="text-gray-500">No learning outcomes specified.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Tags Section */}
                  {Array.isArray(course.course_tags) && course.course_tags.length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Course Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {course.course_tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  {/* Stats Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Enrolled Students</span>
                            <span className="text-sm font-medium">{course.enrolled_students || 0}</span>
                          </div>
                          <Progress value={(course.enrolled_students || 0) > 100 ? 100 : (course.enrolled_students || 0)} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Rating</span>
                            <span className="text-sm font-medium">{course.rating_score || 0}/5</span>
                          </div>
                          <Progress value={(course.rating_score || 0) * 20} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Modules</span>
                            <span className="text-sm font-medium">{course.number_of_modules || 0}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Lessons</span>
                            <span className="text-sm font-medium">{course.number_of_book_lessons || 0}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Quizzes</span>
                            <span className="text-sm font-medium">{course.number_of_quizzes || 0}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Assignments</span>
                            <span className="text-sm font-medium">{course.number_of_assignments || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Internal Notes Card */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Internal Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {course.internal_notes ? (
                        <p>{course.internal_notes}</p>
                      ) : (
                        <p className="text-gray-500">No internal notes.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="modules" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.number_of_modules || 0} modules • {course.number_of_book_lessons || 0} lessons • {course.number_of_assignments || 0} assignments • {course.number_of_quizzes || 0} quizzes • {course.course_duration || "Unknown"} duration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {course.course_modules && course.course_modules.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {course.course_modules.map((module, idx) => (
                          <AccordionItem key={module.id} value={`module-${module.id}`}>
                            <AccordionTrigger className="hover:bg-slate-50 px-4 py-3 rounded-md">
                              <div className="flex flex-col items-start">
                                <div className="text-base font-medium">{module.title}</div>
                                <div className="text-xs text-gray-500">
                                  {module.number_of_lessons || 0} lessons • {module.duration || "Unknown duration"}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <div className="pl-2 border-l-2 border-slate-200">
                                {course.course_lessons && 
                                  course.course_lessons
                                    .filter(lesson => lesson.course_module_id === module.id)
                                    .map((lesson, lessonIdx) => (
                                      <div 
                                        key={lesson.id} 
                                        className="py-3 px-3 border-b last:border-0 hover:bg-slate-50 rounded-md"
                                      >
                                        <div className="flex items-start">
                                          <div className="rounded-full bg-slate-100 p-1 mr-3 mt-1">
                                            <BookOpen className="h-4 w-4 text-slate-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium">{lesson.title}</div>
                                            {lesson.summary && (
                                              <div className="text-sm text-gray-500 mt-1">{lesson.summary}</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                }
                                
                                {(!course.course_lessons || 
                                  !course.course_lessons.filter(lesson => lesson.course_module_id === module.id).length) && (
                                  <div className="py-3 text-sm text-gray-500">
                                    No lessons in this module yet.
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-10">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No modules yet</h3>
                        <p className="mt-1 text-gray-500">Get started by creating a new module.</p>
                        <Button 
                          className="mt-4"
                          onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/add-module`)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Module
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(course.course_faq) && course.course_faq.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {course.course_faq.map((faq, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`}>
                          <AccordionTrigger className="text-left font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="prose max-w-none">
                              <p>{faq.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium">No FAQs available</h3>
                      <p className="mt-1 text-gray-500">There are no frequently asked questions for this course.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </main>
  );
};

export default CourseDetails;
