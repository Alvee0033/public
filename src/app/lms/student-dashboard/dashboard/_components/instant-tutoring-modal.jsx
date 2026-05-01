"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "@/lib/axios"
import { Loader2, User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks"
import {
  fetchCourseById,
  useEnrolledCourseDetails,
  useStudentTutoringSessions
} from "../_context/ScheduleContext"

export function InstantTutoringModal() {
  const { fetchSessions } = useStudentTutoringSessions();
  const { courses, loading: coursesLoading } = useEnrolledCourseDetails();
  
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // State for course details, modules and lessons
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  const [form, setForm] = useState({
    course: 0,
    student: 0,
    tutor: 0,
    course_lesson: 0,
    course_master_lesson: 0,
    course_module: 0,
    course_student_learning_schedule: 0,
  })

  // Set student ID from Redux user
  useEffect(() => {
    if (user?.student_id) {
      setForm(prev => ({ ...prev, student: user.student_id }))
    }
  }, [user?.student_id]);

  // When the selected course changes, fetch its detailed info
  useEffect(() => {
    async function loadCourseDetails() {
      if (!form.course || form.course === 0) {
        setModules([]);
        setLessons([]);
        setSelectedCourse(null);
        return;
      }

      setLoadingDetails(true);
      try {
        const courseDetails = await fetchCourseById(form.course);
        setSelectedCourse(courseDetails);

        if (courseDetails?.course_modules?.length) {
          setModules(courseDetails.course_modules);
          // Reset module and lesson selection when course changes
          setForm(prev => ({
            ...prev,
            course_module: 0,
            course_lesson: 0
          }));
          setLessons([]);
        } else {
          setModules([]);
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        toast.error("Could not load course details");
      } finally {
        setLoadingDetails(false);
      }
    }

    loadCourseDetails();
  }, [form.course]);

  // When the selected module changes, update available lessons
  useEffect(() => {
    if (!form.course_module || form.course_module === 0) {
      setLessons([]);
      return;
    }

    const selectedModule = modules.find(m => m.id === form.course_module);
    if (selectedModule?.course_lessons?.length) {
      setLessons(selectedModule.course_lessons);
      // Reset lesson selection when module changes
      setForm(prev => ({ ...prev, course_lesson: 0 }));
    } else {
      setLessons([]);
    }
  }, [form.course_module, modules]);

  // Button click handler - open dialog
  const handleButtonClick = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get student ID from form or Redux user as fallback
    const studentId = form.student || user?.student_id || 0;

    // Get tutor ID from the selected course's primary_tutor
    let tutorId = 0;
    if (selectedCourse?.primary_tutor?.id) {
      tutorId = selectedCourse.primary_tutor.id;
      console.log(`Using course's primary tutor: ${tutorId}`);
    }

    console.log("Submitting tutoring request with:", {
      studentId,
      courseId: form.course,
      moduleId: form.course_module,
      lessonId: form.course_lesson,
      tutorId
    });

    // Simplified request body without date/time fields
    const requestBody = {
      is_requested: true,
      course: Number(form.course) || 0,
      student: Number(studentId),
      tutor: Number(tutorId),
      course_lesson: Number(form.course_lesson) || 0,
      course_module: Number(form.course_module) || 0,

      // Only include other required fields without date/time
      student_present: true,
      tutor_present: true,
      completion_percentage: 0,
      completed_or_cancelled: false,
      new_or_repeat_session: true,
      student_tutoring_session_number: 0,
      google_event_id: "",
      google_meet_link: "",
      course_master_lesson: 0,
      course_student_learning_schedule: 0,
    };

    try {
      await axios.post("/student-tutoring-sessions", requestBody);
      toast.success("Tutoring session requested!");
      setIsOpen(false);
      await fetchSessions();
    } catch (err) {
      console.error("Error requesting tutoring session:", err);
      toast.error("Failed to request session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg font-medium text-xs"
        onClick={handleButtonClick}
      >
        <User className="w-4 h-4 mr-2" />
        Request 1:1 Tutoring
      </Button>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request Tutoring Session</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select which course and topic you need help with
          </DialogDescription>
        </DialogHeader>

        {/* Course loading status */}
        {coursesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Loading your courses...</span>
          </div>
        ) : courses?.length > 0 ? (
          <div className="text-sm text-gray-500 mb-4">
            Found {courses.length} enrolled courses.
          </div>
        ) : (
          <div className="text-sm text-red-500 mb-4">
            No enrolled courses found. Please contact support.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-medium">
              Select Course
            </Label>
            <Select
              value={String(form.course)}
              onValueChange={(value) => {
                setForm(prev => ({ ...prev, course: Number(value) }));
              }}
              disabled={coursesLoading || courses.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select a course</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Module Selection - Only show if a course is selected */}
          {form.course > 0 && (
            <div className="space-y-2">
              <Label htmlFor="course_module" className="text-sm font-medium">
                Select Module
              </Label>
              {loadingDetails ? (
                <div className="flex items-center h-10 px-4 border rounded-md bg-gray-50">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading modules...</span>
                </div>
              ) : (
                <Select
                  value={String(form.course_module)}
                  onValueChange={(value) => {
                    setForm(prev => ({ ...prev, course_module: Number(value) }));
                  }}
                  disabled={modules.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select a module</SelectItem>
                    {modules.map(module => (
                      <SelectItem key={module.id} value={String(module.id)}>
                        {module.title || `Module ${module.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Lesson Selection - Only show if a module is selected */}
          {form.course_module > 0 && (
            <div className="space-y-2">
              <Label htmlFor="course_lesson" className="text-sm font-medium">
                Select Lesson
              </Label>
              <Select
                value={String(form.course_lesson)}
                onValueChange={(value) => {
                  setForm(prev => ({ ...prev, course_lesson: Number(value) }));
                }}
                disabled={lessons.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select a lesson</SelectItem>
                  {lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={String(lesson.id)}>
                      {lesson.title || `Lesson ${lesson.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={loading || form.course === 0}
            >
              {loading ? "Submitting..." : "Request Tutoring Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
