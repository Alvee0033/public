"use client";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Headphones,
  Code,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  ChevronDown,
  PlayCircle,
  ImageIcon,
  FileQuestion,
  Lock,
  PenTool,
  ZoomIn,
  ZoomOut,
  Highlighter,
  Settings,
  Eye,
  Paperclip,
  ChevronRightIcon,
  Menu,
  X,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseProvider, useCourse } from "./CourseContext";
import VideoPlayer from "../Player";

function CoursePageContent() {
  const { courseId } = useParams();
  const [studentId, setStudentId] = useState(null);
  const {
    course,
    courseLoading,
    courseError,
    fetchCourseDetails,
    setCourse,
    fetchVideoDetails,
    selectedVideo,
    videoLoading,
    videoError,
    updateVideoDuration,
    videoDurations,
    formatDuration,
    fetchProgress,
    progressData,
    progressLoading,
    progressStats,
    markLessonComplete,
    isLessonCompleted,
  } = useCourse();
  const [errorState, setErrorState] = useState({
    type: null,
    message: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [imageZoom, setImageZoom] = useState(1);
  const [highlightMode, setHighlightMode] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentPhotoData, setCurrentPhotoData] = useState(null);
  const [currentDigitalData, setCurrentDigitalData] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [digitalLoading, setDigitalLoading] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("video");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [enrollmentId, setEnrollmentId] = useState(null);

  const router = useRouter();

  // Get student ID from localStorage
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const studentIdValue = user.student_id || user.studentId || user.id;
        setStudentId(studentIdValue);
        console.log("Student ID from localStorage:", studentIdValue, "(from user object):", user);
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          console.log("Fetching course data for ID:", courseId);
          // First, try to get enrollment details to get the actual course ID
          let actualCourseId = courseId;
          let actualCourseData = null;
          
          try {
            // Try to fetch as enrollment ID first
            console.log("Trying to fetch as enrollment ID:", courseId);
            const enrollmentResponse = await axios.get(`/courses/${courseId}`);
            if (enrollmentResponse.data?.status === "SUCCESS" && enrollmentResponse.data?.data?.course) {
              actualCourseId = enrollmentResponse.data.data.course.id;
              actualCourseData = enrollmentResponse.data.data.course;
              setEnrollmentId(enrollmentResponse.data.data.id); // Store enrollment ID
              console.log("Found course from enrollment. Course ID:", actualCourseId, "Enrollment ID:", enrollmentResponse.data.data.id);
            }
          } catch (enrollmentError) {
            // If enrollment fetch fails, assume courseId is actually a course ID
            console.log("Not an enrollment ID, trying as course ID. Error:", enrollmentError.message);
          }

          // If we got course data from enrollment, use it; otherwise fetch by course ID
          let courseData;
          if (actualCourseData) {
            courseData = actualCourseData;
          } else {
            const response = await axios.get(`/courses/${actualCourseId}`);
            if (response.data?.status === "SUCCESS" && response.data?.data) {
              courseData = response.data.data;
            } else {
              throw new Error("Failed to fetch course data");
            }
          }
          
          setErrorState({ type: null, message: "" });
          setCourse(courseData);
          setModulesLoading(true);
          
          // Fetch modules from the API
          console.log("Fetching modules for course:", actualCourseId);
          const modulesResponse = await axios.get(
            `/course-modules?filter=${encodeURIComponent(
              JSON.stringify({ course: actualCourseId })
            )}`
          );
          
          const modulesData = modulesResponse.data?.data || [];
          console.log("Fetched modules:", modulesData);
          
          // Fetch lessons for each module
          const modulesWithLessons = await Promise.all(
            modulesData.map(async (module) => {
              try {
                const lessonsResponse = await axios.get(
                  `/course-lessons?filter=${encodeURIComponent(
                    JSON.stringify({ course_module: module.id })
                  )}`
                );
                
                const lessons = lessonsResponse.data?.data || [];
                console.log(`Fetched ${lessons.length} lessons for module:`, module.title);
                
                const completedCount = lessons.filter(l => l.is_active).length;
                
                return {
                  id: module.id,
                  title: module.title,
                  completed: completedCount,
                  total: lessons.length,
                  expanded: false,
                  lessons: lessons.map((lesson) => {
                    let type = "text";
                    if (lesson.master_video_library_id) type = "video";
                    else if (lesson.master_photo_library_id) type = "image";
                    else if (lesson.master_digital_library_id) type = "text";

                    const hasAssignment = courseData.course_assignments?.some(
                      (assignment) => assignment.course_lesson_id === lesson.id
                    );
                    if (hasAssignment) type = "attachment";

                    return {
                      id: lesson.id,
                      title: lesson.title,
                      type: type,
                      duration: lesson.duration || "0:00",
                      completed: lesson.is_active || false,
                      locked: false,
                      description: lesson.description,
                      summary: lesson.summary,
                      is_active: lesson.is_active,
                      master_video_library_id: lesson.master_video_library_id,
                      master_photo_library_id: lesson.master_photo_library_id,
                      master_digital_library_id: lesson.master_digital_library_id,
                      master_audio_library_id: lesson.master_audio_library_id,
                      master_book_library_id: lesson.master_book_library_id,
                      master_video_library: lesson.master_video_library,
                      master_photo_library: lesson.master_photo_library,
                      master_digital_library: lesson.master_digital_library,
                    };
                  }),
                };
              } catch (error) {
                console.error(`Error fetching lessons for module ${module.id}:`, error);
                return {
                  id: module.id,
                  title: module.title,
                  completed: 0,
                  total: 0,
                  expanded: false,
                  lessons: [],
                };
              }
            })
          );

          console.log("Processed modules with lessons:", modulesWithLessons);
          setModules(modulesWithLessons);
          setModulesLoading(false);

          // Fetch enrollment ID if not already set
          if (!enrollmentId && studentId && actualCourseId) {
            try {
              console.log("Fetching enrollment ID for student:", studentId, "course:", actualCourseId);
              const enrollmentResponse = await axios.get(
                `/student-course-enrollments?filter=${encodeURIComponent(
                  JSON.stringify({ student: studentId, course: actualCourseId })
                )}`
              );
              const enrollments = enrollmentResponse.data?.data || [];
              if (enrollments.length > 0) {
                setEnrollmentId(enrollments[0].id);
                console.log("Found enrollment ID:", enrollments[0].id);
              } else {
                console.warn("No enrollment found for student:", studentId, "course:", actualCourseId);
              }
            } catch (error) {
              console.error("Error fetching enrollment:", error);
            }
          }

          // Fetch progress data for the student
          if (studentId && actualCourseId) {
            console.log("Fetching progress for student:", studentId, "course:", actualCourseId);
            await fetchProgress(studentId, actualCourseId, modulesWithLessons);
            console.log("Progress fetch complete!");
          } else {
            console.warn("Missing studentId or courseId for progress fetch:", { studentId, actualCourseId });
          }

          // Expand first module and set initial lesson
          if (modulesWithLessons.length > 0) {
            const firstModule = modulesWithLessons[0];
            setModules(prev => prev.map((m, idx) => 
              idx === 0 ? { ...m, expanded: true } : m
            ));
            
            if (firstModule.lessons.length > 0) {
              const firstLesson = firstModule.lessons[0];
              setCurrentLessonId(firstLesson.id);
              
              // Load the first lesson's content
              if (firstLesson.master_video_library_id) {
                setSelectedContentType("video");
                fetchVideoDetails(firstLesson.master_video_library_id);
              } else if (firstLesson.master_photo_library_id) {
                setSelectedContentType("image");
                fetchPhotoDetails(firstLesson.master_photo_library_id);
              } else if (firstLesson.master_digital_library_id) {
                setSelectedContentType("text");
                fetchDigitalDetails(firstLesson.master_digital_library_id);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching course data:", error);
          if (error.response) {
            if (error.response.status === 404) {
              setErrorState({
                type: "not_found",
                message: "Course or enrollment not found",
              });
            } else {
              setErrorState({
                type: "loading_error",
                message:
                  "We couldn't load the course details. Please try again later.",
              });
            }
          } else {
            setErrorState({
              type: "loading_error",
              message:
                "We couldn't load the course details. Please check your connection and try again.",
            });
          }
        }
      };

      fetchCourseData();
    }
  }, [courseId, fetchCourseDetails, setCourse, fetchVideoDetails, fetchProgress, studentId]);

  const toggleModule = (moduleId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, expanded: !module.expanded }
          : module
      )
    );
  };

  const selectLesson = (lessonId) => {
    if (!lessonId) return;
    const lesson = modules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === lessonId);
    if (lesson && !lesson.locked) {
      setCurrentLessonId(lessonId);
      setIsPlaying(false);
      setImageZoom(1);
      setHighlightMode(false);
      setActiveTab("notes");
      setIsMobileSidebarOpen(false); // Close mobile sidebar when lesson is selected

      // Reset previous data
      setCurrentPhotoData(null);
      setCurrentDigitalData(null);

      // Set default content type based on available content
      if (lesson.master_video_library_id) {
        setSelectedContentType("video");
        fetchVideoDetails(lesson.master_video_library_id);
      } else if (lesson.master_photo_library_id) {
        setSelectedContentType("image");
        fetchPhotoDetails(lesson.master_photo_library_id);
      } else if (lesson.master_digital_library_id) {
        setSelectedContentType("text");
        fetchDigitalDetails(lesson.master_digital_library_id);
      } else if (lesson.master_audio_library_id) {
        setSelectedContentType("audio");
      } else if (lesson.master_book_library_id) {
        setSelectedContentType("book");
      } else {
        setSelectedContentType("video"); // Default fallback
      }
    }
  };

  const fetchPhotoDetails = async (photoId) => {
    setPhotoLoading(true);
    try {
      const response = await axios.get(`/master-photo-libraries/${photoId}`);
      setCurrentPhotoData(response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching photo details:", error);
    } finally {
      setPhotoLoading(false);
    }
  };

  const fetchDigitalDetails = async (digitalId) => {
    setDigitalLoading(true);
    try {
      const response = await axios.get(
        `/master-digital-libraries/${digitalId}`
      );
      setCurrentDigitalData(response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching digital content:", error);
    } finally {
      setDigitalLoading(false);
    }
  };

  // Update enrollment progress percentage
  const updateEnrollmentProgress = async (percentage) => {
    if (!enrollmentId) {
      console.warn("No enrollment ID available to update progress. EnrollmentId:", enrollmentId);
      return;
    }

    try {
      console.log("Updating enrollment progress:", enrollmentId, "to", percentage + "%");
      const response = await axios.patch(`/student-course-enrollments/${enrollmentId}`, {
        course_completion_percentage: percentage,
      });
      console.log("Enrollment progress updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating enrollment progress:", error.response?.data || error.message);
    }
  };

  // Watch for progress stats changes and update enrollment
  useEffect(() => {
    console.log("Progress stats changed:", progressStats, "Enrollment ID:", enrollmentId);
    if (progressStats?.percentage !== undefined && enrollmentId) {
      console.log("Calling updateEnrollmentProgress with:", progressStats.percentage);
      updateEnrollmentProgress(progressStats.percentage);
    } else {
      console.log("Not updating - missing data:", { 
        hasPercentage: progressStats?.percentage !== undefined, 
        hasEnrollmentId: !!enrollmentId 
      });
    }
  }, [progressStats?.percentage, enrollmentId]);

  const getCurrentLesson = () => {
    return modules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === currentLessonId);
  };

  const getCurrentModule = () => {
    return modules.find((m) => m.lessons.some((l) => l.id === currentLessonId));
  };

  const getLessonData = () => {
    const currentLesson = getCurrentLesson();
    const currentModule = getCurrentModule();

    if (!currentLesson || !currentModule) {
      return {
        courseName: course?.name || "",
        moduleName: "",
        lessonName: "",
        progress: 0,
        videoPublished: false,
        duration: "0:00",
      };
    }

    const totalLessons = modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    const completedLessons = modules.reduce(
      (sum, module) => sum + module.lessons.filter((l) => l.completed).length,
      0
    );
    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      courseName: course?.name || "",
      moduleName: currentModule.title || "",
      lessonName: currentLesson.title || "",
      progress: progress,
      videoPublished:
        currentLesson.type === "video" && currentLesson.master_video_library_id,
      duration: currentLesson.duration || "0:00",
    };
  };

  const getLessonIcon = (type, completed, locked) => {
    if (locked) return <Lock className="w-4 h-4 text-muted-foreground" />;

    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-primary" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case "assignment":
        return <PenTool className="w-4 h-4 text-blue-500" />;
      case "text":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-500" />;
      case "attachment":
        return <Paperclip className="w-4 h-4 text-orange-600" />;
      default:
        return <FileQuestion className="w-4 h-4 text-muted-foreground" />;
    }
  };

  function getModulesWithLessons(course) {
    if (!course) return [];
    const courseModules = course.course_modules || [];
    return courseModules.map((module) => ({
      ...module,
      lessons: module.course_lessons || [],
    }));
  }

  const renderLessonContent = () => {
    const currentLesson = getCurrentLesson();

    if (!currentLesson) {
      // Replace loading with a skeleton
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      );
    }

    switch (selectedContentType) {
      case "video":
        return (
          <Card className="mb-8 shadow-lg bg-blue-100 border border-border rounded-lg">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                {videoLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Loading video...</p>
                    </div>
                  </div>
                ) : currentLesson.master_video_library_id && selectedVideo ? (
                  <VideoPlayer
                    videoUrl={
                      selectedVideo?.video_link ||
                      selectedVideo?.attachment ||
                      selectedVideo?.url
                    }
                    onDurationChange={(duration) => {
                      // Update duration for this video
                      if (currentLessonId && duration) {
                        updateVideoDuration(currentLessonId, duration);
                      }
                    }}
                  />
                ) : currentLesson.master_video_library ? (
                  <VideoPlayer
                    videoUrl={
                      currentLesson.master_video_library?.video_link ||
                      currentLesson.master_video_library?.attachment ||
                      currentLesson.master_video_library?.url
                    }
                    onDurationChange={(duration) => {
                      // Update duration for this video
                      if (currentLessonId && duration) {
                        updateVideoDuration(currentLessonId, duration);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-black min-h-[400px]">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Video not available
                    </h3>
                    <p className="text-gray-300">
                      This lesson video is currently being prepared and will be
                      available soon.
                    </p>
                  </div>
                )}
              </div>
              {videoError && (
                <div className="p-4 bg-destructive/10 border-t border-destructive/20">
                  <p className="text-sm text-destructive">
                    Error loading video: {videoError}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "text":
        return (
          <Card className="mb-8 shadow-lg bg-blue-100 border border-border rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-900" />
                  Reading Material
                </CardTitle>
                <Button
                  variant={highlightMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHighlightMode(!highlightMode)}
                  className="flex items-center gap-2 bg-white hover:bg-blue-900 hover:text-white"
                >
                  <Highlighter className="w-4 h-4" />
                  {highlightMode ? "Exit Highlight" : "Highlight Key Terms"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              {digitalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">
                    Loading content...
                  </div>
                </div>
              ) : currentDigitalData ? (
                <div>
                  <h3
                    className={
                      highlightMode ? "bg-yellow-200 px-1 rounded" : ""
                    }
                  >
                    {currentLesson.title}
                  </h3>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentDigitalData.content ||
                        currentDigitalData.description ||
                        currentDigitalData.text_content,
                    }}
                  />
                  {currentDigitalData.additional_notes && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">
                        Additional Notes
                      </h4>
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: currentDigitalData.additional_notes,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3>{currentLesson.title}</h3>
                  <p>
                    This lesson covers important concepts in{" "}
                    {getCurrentModule()?.title || "the subject"}. Understanding
                    these fundamentals will help you build a strong foundation
                    for future learning.
                  </p>
                  <h4>Key Points:</h4>
                  <ul>
                    <li>
                      <strong
                        className={
                          highlightMode ? "bg-blue-200 px-1 rounded" : ""
                        }
                      >
                        Core Concepts:
                      </strong>{" "}
                      Understanding the main ideas presented in this lesson
                    </li>
                    <li>
                      <strong
                        className={
                          highlightMode ? "bg-blue-200 px-1 rounded" : ""
                        }
                      >
                        Practical Application:
                      </strong>{" "}
                      How to apply these concepts in real-world scenarios
                    </li>
                    <li>
                      <strong
                        className={
                          highlightMode ? "bg-blue-200 px-1 rounded" : ""
                        }
                      >
                        Problem Solving:
                      </strong>{" "}
                      Step-by-step approach to solving related problems
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">
                      Interactive Example
                    </h4>
                    <p className="text-sm">
                      Practice what you've learned with interactive examples and
                      exercises.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "image":
        return (
          <Card className="mb-8 shadow-lg bg-blue-100 border border-border rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Visual Learning Material
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setImageZoom(Math.max(0.5, imageZoom - 0.25))
                    }
                    disabled={imageZoom <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    {Math.round(imageZoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
                    disabled={imageZoom >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative overflow-auto border border-border rounded-lg bg-muted/20">
                  {photoLoading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-muted-foreground">
                          Loading image...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="transition-transform duration-200 min-h-[300px] flex items-center justify-center"
                      style={{
                        transform: `scale(${imageZoom})`,
                        transformOrigin: "top left",
                      }}
                    >
                      {currentPhotoData?.image_url || currentPhotoData?.url ? (
                        <img
                          src={
                            currentPhotoData.image_url || currentPhotoData.url
                          }
                          alt={currentLesson.title}
                          className="w-full h-auto max-w-full"
                          onError={(e) => {
                            e.target.src =
                              course?.image ||
                              "/placeholder.svg?height=400&width=600&text=Visual+Learning+Material";
                          }}
                        />
                      ) : currentLesson.master_photo_library_id ? (
                        <img
                          src={`/api/master-photo-libraries/${currentLesson.master_photo_library_id}/image`}
                          alt={currentLesson.title}
                          className="w-full h-auto max-w-full"
                          onError={(e) => {
                            e.target.src =
                              course?.image ||
                              "/placeholder.svg?height=400&width=600&text=Visual+Learning+Material";
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 bg-muted flex items-center justify-center rounded">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">
                              No visual material available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    {currentLesson.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentPhotoData?.description ||
                      "This visual representation helps illustrate the key concepts covered in this lesson. Use the zoom controls above to examine the details more closely."}
                  </p>
                  {currentLesson.description && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {currentLesson.description}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "attachment":
        const assignment = course?.course_assignments?.find(
          (a) => a.course_lesson_id === currentLesson.id
        );
        return (
          <Card className="mb-8 shadow-lg bg-blue-100 border border-border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-primary" />
                Assignment & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assignment && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-3">
                      {assignment.title}
                    </h4>
                    <div
                      className="text-muted-foreground mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: assignment.description,
                      }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-transparent">
                          {assignment.points} Points
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Assignment
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="mb-8 shadow-lg bg-blue-100 border border-border rounded-lg">
            <CardContent className="p-8 text-center">
              <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Content Loading</h3>
              <p className="text-muted-foreground">
                Lesson content will appear here
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    router.push("/lms/student-dashboard/my-courses");
  };

  if (errorState.type) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4">
        {errorState.type === "not_found" ? (
          <>
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
              />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
              Course not found
            </h2>
            <p className="text-gray-500 text-sm sm:text-base text-center">
              The course you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={handleGoBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
              />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-500 text-sm sm:text-base text-center">
              {errorState.message}
            </p>
            <button
              onClick={handleTryAgain}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    );
  }

  const getAdjacentLesson = (direction) => {
    const allLessons = modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

    if (currentIndex === -1) return null;

    const adjacentIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;
    return allLessons[adjacentIndex];
  };

  const handleNavigation = (direction) => {
    const adjacentLesson = getAdjacentLesson(direction);
    if (adjacentLesson && !adjacentLesson.locked) {
      selectLesson(adjacentLesson.id);
      // Expand the module containing this lesson
      const module = modules.find((m) =>
        m.lessons.some((l) => l.id === adjacentLesson.id)
      );
      if (module && !module.expanded) {
        toggleModule(module.id);
      }
    }
  };

  const lessonData = getLessonData();
  const prevLesson = getAdjacentLesson("prev");
  const nextLesson = getAdjacentLesson("next");

  return (
    <>
      <div className="flex min-h-screen bg-background text-foreground font-sans course-player-container">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className={`flex items-center gap-2 ${
              isMobileSidebarOpen ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <Menu className="w-4 h-4" />
            Course Contents ({modules.length} modules)
            {isMobileSidebarOpen && (
              <span className="text-xs ml-2">• Open</span>
            )}
          </Button>
        </div>

        {/* Header with dynamic title */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-black mb-2 font-serif flex-1">
              {lessonData.courseName || course?.name || "Course"}: {lessonData.moduleName || "Module"} – {lessonData.lessonName || "Lesson"}
            </h1>
            
            {/* Mark as Complete Button or Completion Badge */}
            {currentLessonId && (
              <>
                {isLessonCompleted(currentLessonId) ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-500 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Completed</span>
                  </div>
                ) : (
                  <Button
                    onClick={async () => {
                      if (!studentId || !course?.id) return;
                      
                      const currentLesson = getCurrentLesson();
                      if (!currentLesson) return;
                      
                      try {
                        await markLessonComplete(
                          studentId,
                          course.id,
                          currentLesson.module || modules.find(m => 
                            m.lessons.some(l => l.id === currentLessonId)
                          )?.id,
                          currentLessonId,
                          modules
                        );
                      } catch (error) {
                        console.error("Error marking lesson complete:", error);
                      }
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Circle className="w-4 h-4" />
                    Mark Complete
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  Course Progress
                  {progressLoading && (
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  )}
                </span>
                <span className="text-sm font-medium text-primary">
                  {progressStats?.percentage || 0}% Complete ({progressStats?.completedLessons || 0}/{progressStats?.totalLessons || 0} lessons)
                </span>
              </div>
              <div className="w-full bg-slate-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (progressStats?.percentage || 0) > 0 ? "bg-blue-900" : "bg-slate-400"
                  }`}
                  style={{ width: `${progressStats?.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {course && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg bg-blue-100">
              <div
                className="text-sm text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: course.short_description || course.description,
                }}
              />
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>Grade {course.master_k12_grade || "N/A"}</span>
                <span>•</span>
                <span>{course.course_category?.name || "General"}</span>
                <span>•</span>
                <span>${course.regular_price || "0"}</span>
              </div>
            </div>
          )}
        </div>

        {renderLessonContent()}

        {/* Lesson Content Tabs */}
        <Card className="shadow-lg bg-blue-100 border border-border rounded-lg">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-blue-100">
                <TabsTrigger
                  value="notes"
                  className={`flex items-center gap-2 ${
                    activeTab === "notes"
                      ? "bg-white text-black"
                      : "bg-transparent"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className={`flex items-center gap-2 ${
                    activeTab === "files"
                      ? "bg-white text-black"
                      : "bg-transparent"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger
                  value="audio"
                  className={`flex items-center gap-2 ${
                    activeTab === "audio"
                      ? "bg-white text-black"
                      : "bg-transparent"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  Audio
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className={`flex items-center gap-2 ${
                    activeTab === "code"
                      ? "bg-white text-black"
                      : "bg-transparent"
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Practice
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className={`flex items-center gap-2 ${
                    activeTab === "quiz"
                      ? "bg-white text-black"
                      : "bg-transparent"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Quiz
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Lesson Notes & Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">
                          Key Concept:{" "}
                          {getCurrentLesson()?.title || "Learning Topic"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Understanding the core concepts presented in this
                          lesson will help build your knowledge foundation.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Important Points:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Core concepts and definitions</li>
                          <li>Practical applications and examples</li>
                          <li>Problem-solving techniques</li>
                          <li>Common mistakes to avoid</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Attached Files & Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Lesson Materials.pdf</p>
                            <p className="text-sm text-muted-foreground">
                              Additional resources
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lesson Audio File</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="font-medium">Lesson Audio Track</p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {lessonData.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Interactive Practice Problems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Practice Exercise
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Apply what you've learned with these practice
                          questions.
                        </p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 bg-transparent"
                          >
                            Option A
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 bg-transparent"
                          >
                            Option B
                          </Button>
                          <Button variant="outline" size="sm">
                            Option C
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Check Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Quiz will be available after completing the lesson
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent flex-1 sm:flex-initial bg-blue-900 text-white"
            onClick={() => handleNavigation("prev")}
            disabled={!prevLesson || prevLesson.locked}
          >
            <ChevronLeft className="w-4 h-4" />
            {prevLesson ? (
              <span className="flex flex-col items-start">
                {/* <span className="text-xs text-muted-foreground">Previous</span> */}
                <span className="text-sm truncate max-w-[120px] sm:max-w-[150px]">
                  {prevLesson.title}
                </span>
              </span>
            ) : (
              "Previous Lesson"
            )}
          </Button>
          <Button
            className="flex items-center gap-2 bg-transparent flex-1 sm:flex-initial bg-blue-900 text-white"
            onClick={() => handleNavigation("next")}
            disabled={!nextLesson || nextLesson.locked}
          >
            {nextLesson ? (
              <span className="flex flex-col items-end">
                {/* <span className="text-xs text-muted-foreground">Next</span> */}
                <span className="text-sm truncate max-w-[120px] sm:max-w-[150px]">
                  {nextLesson.title}
                </span>
              </span>
            ) : (
              "Next Lesson"
            )}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        w-80 bg-card border-l border-border course-sidebar overflow-y-auto
        fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:transform-none md:z-auto md:overflow-y-visible
        ${
          isMobileSidebarOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        }
      `}
      >
        {/* Mobile close button */}
        <div className="md:hidden mb-4 sticky top-0 bg-card z-10 p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 sidebar-header">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground font-serif">
              {course?.institute?.name || "ScholarPASS"}
            </h1>
          </div>

          <div className="space-y-4 bg-blue-100 p-6 rounded-lg">
            <div className="text-sm text-muted-foreground">Course Contents</div>
            <div className="space-y-2 custom-scrollbar">
              {modulesLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <div className="text-sm">Loading course contents...</div>
                </div>
              ) : modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm">No modules found for this course.</div>
                </div>
              ) : (
                modules.map((module) => (
                  <div key={module.id} className="space-y-1">
                    <div
                      className={`module-item p-3 rounded-lg cursor-pointer transition-colors ${
                        module.expanded
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted border border-transparent"
                      }`}
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {module.expanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              module.expanded
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {module.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            {module.completed}/{module.total}
                          </div>
                          <Badge
                            variant={module.expanded ? "default" : "outline"}
                            className="text-xs bg-blue-900 text-white"
                          >
                            {module.total} lessons
                          </Badge>
                        </div>
                      </div>

                      {module.expanded && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-300 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                (module.completed / module.total) * 100 > 0
                                  ? "bg-blue-900"
                                  : "bg-slate-400"
                              }`}
                              style={{
                                width: `${
                                  (module.completed / module.total) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {module.expanded && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson) => {
                          const hasVideo = !!lesson.master_video_library_id;
                          const hasAudio = !!lesson.master_audio_library_id;
                          const hasPhoto = !!lesson.master_photo_library_id;
                          const hasDigital = !!lesson.master_digital_library_id;
                          const hasBook = !!lesson.master_book_library_id;

                          return (
                            <div
                              key={lesson.id}
                              className={`lesson-item p-3 rounded-lg cursor-pointer transition-colors ${
                                lesson.id === currentLessonId
                                  ? "active bg-primary/10 border border-primary/20"
                                  : lesson.locked
                                  ? "locked opacity-60 cursor-not-allowed"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => selectLesson(lesson.id)}
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`text-sm truncate ${
                                          lesson.id === currentLessonId
                                            ? "font-medium text-primary"
                                            : lesson.completed
                                            ? "text-muted-foreground"
                                            : "text-foreground"
                                        }`}
                                      >
                                        {lesson.title}
                                      </span>
                                      {hasVideo && (
                                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                          {videoDurations[lesson.id]
                                            ? formatDuration(
                                                videoDurations[lesson.id]
                                              )
                                            : "--:--"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Content type indicators */}
                                <div className="relative">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start px-2 py-1 h-auto"
                                      >
                                        <div className="flex flex-wrap gap-2">
                                          {hasVideo && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <PlayCircle className="w-3 h-3" />
                                              <span>Video</span>
                                            </div>
                                          )}
                                          {hasAudio && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <Headphones className="w-3 h-3" />
                                              <span>Audio</span>
                                            </div>
                                          )}
                                          {hasPhoto && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <ImageIcon className="w-3 h-3" />
                                              <span>Photo</span>
                                            </div>
                                          )}
                                          {hasDigital && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <FileText className="w-3 h-3" />
                                              <span>Digital</span>
                                            </div>
                                          )}
                                          {hasBook && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <BookOpen className="w-3 h-3" />
                                              <span>Book</span>
                                            </div>
                                          )}
                                          {!hasVideo &&
                                            !hasAudio &&
                                            !hasPhoto &&
                                            !hasDigital &&
                                            !hasBook && (
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <FileQuestion className="w-3 h-3" />
                                                <span>No content</span>
                                              </div>
                                            )}
                                          <ChevronDown className="w-3 h-3 ml-auto" />
                                        </div>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="start"
                                      className="w-48 bg-blue-900 text-white border border-border shadow-lg rounded-md"
                                    >
                                      <DropdownMenuItem
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLesson(lesson.id);
                                          setSelectedContentType("video");
                                          setIsMobileSidebarOpen(false); // Close mobile sidebar
                                          if (hasVideo) {
                                            // Load video content
                                            fetchVideoDetails(
                                              lesson.master_video_library_id
                                            );
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <PlayCircle className="w-4 h-4" />
                                          <span>Watch Video</span>
                                        </div>
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLesson(lesson.id);
                                          setSelectedContentType("audio");
                                          setIsMobileSidebarOpen(false); // Close mobile sidebar
                                          if (hasAudio) {
                                            // Load audio content
                                            setActiveTab("audio");
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Headphones className="w-4 h-4" />
                                          <span>Listen to Audio</span>
                                        </div>
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLesson(lesson.id);
                                          setSelectedContentType("image");
                                          setIsMobileSidebarOpen(false); // Close mobile sidebar
                                          if (hasPhoto) {
                                            // Load photo content
                                            fetchPhotoDetails(
                                              lesson.master_photo_library_id
                                            );
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <ImageIcon className="w-4 h-4" />
                                          <span>View Photo</span>
                                        </div>
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLesson(lesson.id);
                                          setSelectedContentType("text");
                                          setIsMobileSidebarOpen(false); // Close mobile sidebar
                                          if (hasDigital) {
                                            // Load digital content
                                            fetchDigitalDetails(
                                              lesson.master_digital_library_id
                                            );
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <FileText className="w-4 h-4" />
                                          <span>Read Digital Content</span>
                                        </div>
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLesson(lesson.id);
                                          setSelectedContentType("book");
                                          setIsMobileSidebarOpen(false); // Close mobile sidebar
                                          if (hasBook) {
                                            // Load book content
                                            setActiveTab("files");
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="w-4 h-4" />
                                          <span>Open Book</span>
                                        </div>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {lesson.summary && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {lesson.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Debug indicator for mobile sidebar state */}
      {isMobileSidebarOpen && (
        <div className="fixed top-4 left-4 z-60 bg-red-500 text-white px-2 py-1 rounded text-xs md:hidden">
          Sidebar Open
        </div>
      )}
      </div>
    </>
  );
}

const Page = () => {
  return (
    <CourseProvider>
      <CoursePageContent />
    </CourseProvider>
  );
};

export default Page;
