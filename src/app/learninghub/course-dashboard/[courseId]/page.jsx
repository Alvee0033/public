"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { BookOpen, Clock, FileText, PlayCircle, Users } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function CourseModule({ module, index, courseId, router }) {
  return (
    <Card key={index}>
      <CardHeader>
        <CardTitle className="text-lg">
          Module {index + 1}: {module.title}
        </CardTitle>
        <CardDescription>
          {module.lessons?.length || 0} lessons • {module.duration || "1 hour"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {module.lessons?.map((lesson, lessonIndex) => (
            <li
              key={lessonIndex}
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => router.push(`/learninghub/course-dashboard/${courseId}/lesson/${lesson.id}`)}
            >
              <div className="flex items-center">
                {lesson.type === "video" ? (
                  <PlayCircle className="w-5 h-5 mr-2 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                )}
                <span>{lesson.title}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {lesson.duration || "10 min"}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function CourseResources({ resources }) {
  if (!resources?.length) return (
    <p className="text-muted-foreground text-center py-8">
      No resources available for this course yet.
    </p>
  )

  return (
    <ul className="space-y-2">
      {resources.map((resource, index) => (
        <li key={index} className="flex items-center p-3 rounded-md hover:bg-muted">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {resource.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function CourseDashboardPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!courseId) return

    async function fetchCourseData() {
      try {
        setLoading(true)
        const [courseResponse, enrollmentResponse] = await Promise.allSettled([
          axios.get(`/courses/${courseId}`),
          axios.post('/stripe/verify-course-enrollment', { course_id: parseInt(courseId) })
        ])

        if (courseResponse.status === 'rejected')
          throw new Error(`Failed to fetch course: ${courseResponse.reason}`)

        const courseData = courseResponse.value.data.data || courseResponse.value.data
        if (!courseData?.name) throw new Error('Invalid course data')

        setCourse(courseData)

        if (enrollmentResponse.status === 'fulfilled') {
          const enrollmentData = enrollmentResponse.value.data.data?.enrollment ||
            enrollmentResponse.value.data.enrollment ||
            enrollmentResponse.value.data
          setEnrollment(enrollmentData)
        }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading course content...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Error</CardTitle>
          <CardDescription>There was a problem loading the course: {error}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => router.push("/learninghub/course-list")}>Back to Courses</Button>
        </CardContent>
      </Card>
    </div>
  )

  if (!course) return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Course Not Found</CardTitle>
          <CardDescription>
            The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => router.push("/learninghub/courses")}>Browse Courses</Button>
        </CardContent>
      </Card>
    </div>
  )

  const progress = enrollment?.course_completion_percentage || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <Clock className="w-4 h-4 mr-1" />
          <span className="mr-4">{course.course_duration}</span>
          <Users className="w-4 h-4 mr-1" />
          <span>{course.enrolled_students} students</span>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Your Progress</div>
              <div className="text-sm text-muted-foreground">{progress}% Complete</div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="grid gap-4">
            {course.modules?.map((module, index) => (
              <CourseModule
                key={index}
                module={module}
                index={index}
                courseId={courseId}
                router={router}
              />
            ))}

            {(!course.modules?.length) && (
              <Card>
                <CardContent className="py-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Course content is being prepared. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseResources resources={course.resources} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardHeader>
              <CardTitle>Course Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Discussion forum will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
