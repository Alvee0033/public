"use client";
import axios from "@/lib/axios";
import { BookX } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { 
  fetchStudentLessonProgress, 
  markLessonComplete as markComplete,
  calculateProgressStats 
} from "@/services/progressService";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  // Course data state
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  // Video data state
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Add a state to track video durations
  const [videoDurations, setVideoDurations] = useState({});

  // Progress tracking state
  const [progressData, setProgressData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressStats, setProgressStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    percentage: 0,
  });

  // Fetch course details
  const fetchCourseDetails = useCallback(async (courseId) => {
    setCourseLoading(true);
    setCourseError(null);
    try {
      const res = await axios.get(`/courses/${courseId}`);
      setCourse(res?.data?.data);
      console.log("Course data received:", res?.data?.data);
    } catch (err) {
      console.error("Error fetching course:", err);
      setCourseError("Failed to load course details");
    } finally {
      setCourseLoading(false);
    }
  }, []);

  // Fetch video details
  const fetchVideoDetails = useCallback(async (masterVideoLibraryId) => {
    if (!masterVideoLibraryId) return;
    setVideoLoading(true);
    setVideoError(null);
    setSelectedVideo(null);
    try {
      const res = await axios.get(
        `/master-video-libraries/${masterVideoLibraryId}`
      );
      setSelectedVideo(res.data?.data || res.data);
    } catch (err) {
      setVideoError("Failed to load video details");
    } finally {
      setVideoLoading(false);
    }
  }, []);

  // Add a function to update a video's duration
  const updateVideoDuration = useCallback((videoId, durationInSeconds) => {
    console.log("Updating video duration:", videoId, durationInSeconds);
    setVideoDurations((prev) => ({
      ...prev,
      [videoId]: durationInSeconds,
    }));
  }, []);

  // Format duration for display
  const formatDuration = useCallback((seconds) => {
    if (!seconds) return null;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Fetch student progress for a course
  const fetchProgress = useCallback(async (studentId, courseId, modules = []) => {
    if (!studentId || !courseId) return;
    
    setProgressLoading(true);
    try {
      const data = await fetchStudentLessonProgress(studentId, courseId);
      console.log("Progress data received:", data);
      
      // Normalize the data to ensure we have lesson_id field
      const normalizedData = data.map(item => ({
        ...item,
        lesson_id: item.lesson_id || item.lesson?.id || item.lesson,
        module_id: item.module_id || item.module?.id || item.module,
        course_id: item.course_id || item.course?.id || item.course,
        student_id: item.student_id || item.student?.id || item.student,
      }));
      
      console.log("Normalized progress data:", normalizedData);
      setProgressData(normalizedData);
      
      // Calculate stats if modules are provided
      if (modules.length > 0) {
        const stats = calculateProgressStats(normalizedData, modules);
        console.log("Progress stats:", stats);
        setProgressStats(stats);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setProgressLoading(false);
    }
  }, []);

  // Mark a lesson as complete
  const markLessonComplete = useCallback(async (studentId, courseId, moduleId, lessonId, modules = []) => {
    try {
      const result = await markComplete(studentId, courseId, moduleId, lessonId);
      console.log("Mark complete result:", result);
      
      // Normalize the result
      const normalizedResult = {
        ...result,
        lesson_id: result.lesson_id || result.lesson?.id || result.lesson || lessonId,
        module_id: result.module_id || result.module?.id || result.module || moduleId,
        course_id: result.course_id || result.course?.id || result.course || courseId,
        student_id: result.student_id || result.student?.id || result.student || studentId,
      };
      
      // Update progress data
      setProgressData(prev => {
        const existingIndex = prev.findIndex(p => 
          p.lesson_id === lessonId && p.student_id === studentId && p.course_id === courseId
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], is_completed: true };
          return updated;
        } else {
          return [...prev, normalizedResult];
        }
      });

      // Recalculate stats if modules are provided
      if (modules.length > 0) {
        setProgressData(current => {
          const stats = calculateProgressStats(current, modules);
          setProgressStats(stats);
          return current;
        });
      }

      return result;
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      throw error;
    }
  }, []);

  // Check if a lesson is completed
  const isLessonCompleted = useCallback((lessonId) => {
    const completed = progressData.some(p => {
      const pLessonId = p.lesson_id || p.lesson?.id || p.lesson;
      return pLessonId === lessonId && p.is_completed === true;
    });
    return completed;
  }, [progressData]);

  // Get progress for a specific module
  const getModuleProgress = useCallback((moduleId, lessons = []) => {
    const moduleLessons = lessons.filter(l => l.module === moduleId);
    const completed = moduleLessons.filter(l => isLessonCompleted(l.id)).length;
    const total = moduleLessons.length;
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [isLessonCompleted]);

  return (
    <CourseContext.Provider
      value={{
        // Course
        course,
        courseLoading,
        courseError,
        fetchCourseDetails,
        setCourse,
        setCourseLoading,
        setCourseError,
        // Video
        selectedVideo,
        videoLoading,
        videoError,
        fetchVideoDetails,
        // Video Durations
        videoDurations,
        updateVideoDuration,
        formatDuration,
        // Progress tracking
        progressData,
        progressLoading,
        progressStats,
        fetchProgress,
        markLessonComplete,
        isLessonCompleted,
        getModuleProgress,
      }}
    >
      {children}
      {courseError && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          {/* <BookX className="w-12 h-12 mb-2" />
                    <span>Course not found</span> */}
        </div>
      )}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  return useContext(CourseContext);
}
