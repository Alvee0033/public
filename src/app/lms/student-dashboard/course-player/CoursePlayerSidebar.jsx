import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Folder,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import ReactPlayer from "react-player";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useCourse } from "./[courseId]/CourseContext";
import { useToast } from "@/hooks/use-toast";

// Resource dropdown component for lessons with resources
function ResourcesDropdown({ resourceUrl }) {
  return (
    <div className="relative inline-block text-left">
      <a
        href={resourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 text-xs border rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <Folder className="w-4 h-4" /> Resources{" "}
        <ChevronDown className="w-3 h-3" />
      </a>
    </div>
  );
}

export default function CoursePlayerSidebar({ courseData, onLessonSelect }) {
  const [openSection, setOpenSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const { toast } = useToast();

  // Get student ID from localStorage
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const studentIdValue = user.student_id || user.studentId || user.id;
        setStudentId(studentIdValue);
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }
  }, []);

  // Access progress tracking functions
  const { 
    videoDurations, 
    formatDuration, 
    isLessonCompleted,
    markLessonComplete,
    progressStats,
  } = useCourse();

  // Fetch course modules from API
  const { data: courseModules, isLoading } = useSWR(
    courseData?.course?.id
      ? `/course-modules?filter=${encodeURIComponent(
          JSON.stringify({ course: courseData.course.id })
        )}`
      : null,
    async (url) => {
      const res = await axios.get(url);
      return res.data?.data || [];
    }
  );

  // Use the fetched modules or empty array if loading
  const modules = courseModules || [];

  // Use progress stats from context
  const courseProgress = progressStats?.percentage || 0;

  // Handle marking lesson as complete
  const handleToggleComplete = async (e, lesson, moduleId) => {
    e.stopPropagation(); // Prevent lesson selection
    
    if (!studentId || !courseData?.course?.id) {
      toast({
        title: "Error",
        description: "Unable to update progress. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const lessonCompleted = isLessonCompleted(lesson.id);
    
    if (!lessonCompleted) {
      try {
        await markLessonComplete(
          studentId,
          courseData.course.id,
          moduleId,
          lesson.id,
          modules
        );
        
        toast({
          title: "Lesson Completed!",
          description: `"${lesson.title}" marked as complete.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark lesson as complete.",
          variant: "destructive",
        });
      }
    }
  };

  // Auto-open the first module when data is loaded
  useEffect(() => {
    if (modules.length > 0 && openSection === null) {
      setOpenSection(0);

      // If there are lessons in the first module, select the first one
      const firstModule = modules[0];
      let lessons = firstModule.lessons || firstModule.course_lessons || [];

      // Sort lessons by lesson number
      lessons = [...lessons].sort((a, b) => {
        const aMatch = a.title.match(/Lesson\s+(\d+):/i);
        const bMatch = b.title.match(/Lesson\s+(\d+):/i);

        if (aMatch && bMatch) {
          return parseInt(aMatch[1]) - parseInt(bMatch[1]);
        }

        if (aMatch) return -1;
        if (bMatch) return 1;

        return a.id - b.id;
      });

      if (lessons.length > 0) {
        const firstLesson = lessons[0]; // This will be the actual first lesson after sorting
        setSelectedLesson(firstLesson.id);

        // Get video URL from master_video_library if available
        const videoUrl =
          firstLesson.master_video_library?.attachment ||
          firstLesson.master_video_library?.video_link;

        // If there's a video URL, pass it to the parent
        if (videoUrl && onLessonSelect) {
          onLessonSelect(videoUrl, firstLesson);
        } else if (onLessonSelect) {
          onLessonSelect(null, firstLesson);
        }
      }
    }
  }, [modules, openSection, onLessonSelect]);

  const handleToggle = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson.id);

    // Get video URL from master_video_library if available
    const videoUrl =
      lesson.master_video_library?.attachment ||
      lesson.master_video_library?.video_link;

    if (onLessonSelect && videoUrl) {
      // Pass both the video URL and lesson info to parent
      onLessonSelect(videoUrl, lesson);
    } else if (onLessonSelect) {
      // Pass lesson info even if no video for tracking purposes
      onLessonSelect(null, lesson);
    }
  };

  return (
    <div className="col-span-2 xl:col-span-1 space-y-6">
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-lg font-bold text-blue-600">{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-3" />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {progressStats?.completedLessons || 0}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Completed
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {progressStats?.totalLessons || 0}
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  Total Lessons
                </div>
              </div>
            </div>

            {courseData?.course?.name && (
              <div className="pt-2 border-t">
                <h3 className="text-sm font-semibold text-gray-700">
                  {courseData.course.name}
                </h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Modules</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading course modules...</span>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No modules available for this course yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {[...modules]
                .sort((a, b) => {
                  const aMatch = a.title.match(/Module\s+(\d+):/i);
                  const bMatch = b.title.match(/Module\s+(\d+):/i);

                  if (aMatch && bMatch) {
                    return parseInt(aMatch[1]) - parseInt(bMatch[1]);
                  }

                  if (aMatch) return -1;
                  if (bMatch) return 1;

                  return a.id - b.id;
                })
                .map((mod, idx) => {
                  const lessons = mod.lessons || mod.course_lessons || [];
                  const totalDuration = Array.isArray(lessons)
                    ? lessons.reduce((acc, l) => {
                        const duration = l.duration || "0";
                        const durationValue = parseInt(duration || "0");
                        return acc + durationValue;
                      }, 0)
                    : 0;

                  return (
                    <div key={mod.id}>
                      <button
                        className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none hover:bg-gray-50"
                        onClick={() => handleToggle(idx)}
                      >
                        <div>
                          <h4 className="font-medium">
                            {/* Extract module number if available in title, otherwise use index */}
                            {(() => {
                              const moduleMatch =
                                mod.title.match(/Module\s+(\d+):/i);
                              if (moduleMatch) {
                                return `Module ${
                                  moduleMatch[1]
                                }: ${mod.title.replace(
                                  /^Module\s+\d+:\s*/i,
                                  ""
                                )}`;
                              } else {
                                return `Module ${idx + 1}: ${mod.title}`;
                              }
                            })()}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                            <span>
                              {
                                lessons.filter((lesson) => isLessonCompleted(lesson.id))
                                  .length
                              }{" "}
                              / {lessons.length} completed
                            </span>
                            <span>|</span>
                            <span>{totalDuration}sec</span>
                          </div>
                        </div>
                        {openSection === idx ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {openSection === idx && (
                        <div className="bg-gray-50 px-4 pb-4">
                          {lessons.length === 0 ? (
                            <p className="text-center py-4 text-sm text-muted-foreground">
                              No lessons available in this module.
                            </p>
                          ) : (
                            <ul className="space-y-2 mt-2">
                              {[...lessons]
                                .sort((a, b) => {
                                  const aMatch =
                                    a.title.match(/Lesson\s+(\d+):/i);
                                  const bMatch =
                                    b.title.match(/Lesson\s+(\d+):/i);

                                  if (aMatch && bMatch) {
                                    return (
                                      parseInt(aMatch[1]) - parseInt(bMatch[1])
                                    );
                                  }

                                  if (aMatch) return -1;
                                  if (bMatch) return 1;

                                  return a.id - b.id;
                                })
                                .map((lesson, lidx) => {
                                  const hasVideo =
                                    !!lesson.master_video_library;

                                  const lessonNumberMatch =
                                    lesson.title.match(/Lesson\s+(\d+):/i);
                                  const lessonNumber = lessonNumberMatch
                                    ? lessonNumberMatch[1]
                                    : lidx + 1;

                                  const lessonCompleted = isLessonCompleted(lesson.id);
                                  const isSelected = selectedLesson === lesson.id;
                                  
                                  return (
                                    <li
                                      key={lesson.id}
                                      className={`flex items-start gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected
                                          ? "border-blue-500 bg-blue-50 shadow-md"
                                          : lessonCompleted 
                                            ? "border-green-200 bg-green-50 hover:bg-green-100" 
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                      }`}
                                      onClick={() => handleLessonClick(lesson)}
                                    >
                                      <button
                                        onClick={(e) => handleToggleComplete(e, lesson, mod.id)}
                                        className="mt-1 focus:outline-none flex-shrink-0"
                                        title={lessonCompleted ? "Completed" : "Mark as complete"}
                                      >
                                        {lessonCompleted ? (
                                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                                        )}
                                      </button>
                                      {isSelected && (
                                        <div className="w-1 h-full bg-blue-500 rounded absolute left-0 top-0 bottom-0"></div>
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`font-medium text-sm ${isSelected ? "text-blue-700" : ""}`}>
                                            {lessonNumber}.{" "}
                                            {lesson.title.replace(
                                              /^Lesson\s+\d+:\s*/i,
                                              ""
                                            )}
                                          </span>
                                          {isSelected && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full font-semibold">
                                              Now Viewing
                                            </span>
                                          )}
                                          {lessonCompleted && !isSelected && (
                                            <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full font-semibold">
                                              ✓ Done
                                            </span>
                                          )}
                                          {hasVideo && (
                                            <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                                              Video
                                            </span>
                                          )}
                                          {lesson.master_book_library && (
                                            <ResourcesDropdown
                                              resourceUrl={
                                                lesson.master_book_library
                                                  ?.attachment
                                              }
                                            />
                                          )}
                                          {lesson.master_digital_library && (
                                            <ResourcesDropdown
                                              resourceUrl={
                                                lesson.master_digital_library
                                                  ?.attachment
                                              }
                                            />
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {hasVideo ? (
                                              videoDurations[lesson.id] ? (
                                                <span>
                                                  {formatDuration(
                                                    videoDurations[lesson.id]
                                                  )}
                                                </span>
                                              ) : (
                                                <span>--:--</span>
                                              )
                                            ) : (
                                              <span>No video</span>
                                            )}
                                          </div>
                                          {lesson.summary && (
                                            <span
                                              className="truncate max-w-[150px]"
                                              title={lesson.summary.replace(
                                                /<[^>]*>/g,
                                                ""
                                              )}
                                            >
                                              {lesson.summary
                                                .replace(/<[^>]*>/g, "")
                                                .substring(0, 30)}
                                              ...
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  );
                                })}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
