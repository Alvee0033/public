import axios from "@/lib/axios";

/**
 * Fetch student lesson progress for a specific course
 * @param {number} studentId - The student's ID
 * @param {number} courseId - The course ID
 * @returns {Promise<Array>} Array of progress records
 */
export const fetchStudentLessonProgress = async (studentId, courseId) => {
  try {
    const filter = JSON.stringify({
      student: studentId,
      course: courseId,
    });
    
    const response = await axios.get(`/student-lessons-progress?filter=${encodeURIComponent(filter)}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching student lesson progress:", error);
    throw error;
  }
};

/**
 * Mark a lesson as complete
 * @param {number} studentId - The student's ID
 * @param {number} courseId - The course ID
 * @param {number} moduleId - The module ID
 * @param {number} lessonId - The lesson ID
 * @returns {Promise<Object>} The created/updated progress record
 */
export const markLessonComplete = async (studentId, courseId, moduleId, lessonId) => {
  try {
    const payload = {
      is_completed: true,
      student: studentId,
      course: courseId,
      module: moduleId,
      lesson: lessonId,
    };
    
    const response = await axios.post("/student-lessons-progress", payload);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    throw error;
  }
};

/**
 * Mark a lesson as incomplete
 * @param {number} progressId - The progress record ID
 * @returns {Promise<Object>} The updated progress record
 */
export const markLessonIncomplete = async (progressId) => {
  try {
    const response = await axios.patch(`/student-lessons-progress/${progressId}`, {
      is_completed: false,
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error marking lesson as incomplete:", error);
    throw error;
  }
};

/**
 * Get progress statistics for a course
 * @param {Array} progressData - Array of progress records
 * @param {Array} modules - Array of course modules with lessons
 * @returns {Object} Progress statistics
 */
export const calculateProgressStats = (progressData, modules) => {
  let totalLessons = 0;
  let completedLessons = 0;
  
  modules.forEach((module) => {
    // Support both 'lessons' and 'course_lessons' field names
    const lessons = module.lessons || module.course_lessons || [];
    totalLessons += lessons.length;
  });
  
  completedLessons = progressData.filter(p => p.is_completed).length;
  
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return {
    totalLessons,
    completedLessons,
    percentage,
  };
};
