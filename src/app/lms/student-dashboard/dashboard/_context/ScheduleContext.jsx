import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("tutoring");
  
  // Get user from Redux state (which comes from localStorage)
  const user = useAppSelector((state) => state.auth.user);

  // Use student_id from user object (not user.id)
  const studentId = user?.student_id;

  return (
    <ScheduleContext.Provider
      value={{ selectedTab, setSelectedTab, user, studentId }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}

export function useStudentId() {
  const ctx = useContext(ScheduleContext);
  return ctx?.studentId;
}

const StudentTutoringSessionsContext = createContext();

export function StudentTutoringSessionsProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const studentId = useStudentId();
  const hasFetchedRef = useRef(false); // Track if we've already fetched

  const fetchSessions = useCallback(async () => {
    // Prevent duplicate fetches
    if (loading || hasFetchedRef.current) return;

    if (!studentId) {
      console.warn("Cannot fetch sessions: No student ID available");
      return;
    }

    hasFetchedRef.current = true; // Mark as fetched
    setLoading(true);
    try {
      console.log(
        `Fetching tutoring sessions for student: ${studentId}`
      );
      const res = await axios.get(
        `/student-tutoring-sessions?filter=${JSON.stringify({
          student: studentId,
        })}`
      );
      console.log(`Received ${res.data?.data?.length || 0} tutoring sessions`);
      setSessions(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching tutoring sessions:", error);
      hasFetchedRef.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, [studentId]); // Remove loading from dependencies

  useEffect(() => {
    // Only fetch once when studentId becomes available and we haven't fetched yet
    if (studentId && !hasFetchedRef.current) {
      console.log(
        "StudentId available, fetching tutoring sessions:",
        studentId
      );
      fetchSessions();
    }
  }, [studentId, fetchSessions]); // Safe to include fetchSessions now

  return (
    <StudentTutoringSessionsContext.Provider
      value={{ sessions, fetchSessions, loading }}
    >
      {children}
    </StudentTutoringSessionsContext.Provider>
  );
}

export function useStudentTutoringSessions() {
  return useContext(StudentTutoringSessionsContext);
}

export function useStudentExams() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = useStudentId();

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);

    // Match StudentExamPage exactly - same endpoint and parameters
    axios
      .get(
        `/student-exams?pagination=true&limit=100&is_active=true&is_Game_Or_Exam=false&is_published=true`
      )
      .then((res) => {
        if (res.data?.status === "SUCCESS") {
          const allExams = res.data.data || [];

          // Use the exact same filtering logic as in StudentExamPage
          const filteredByStudent = allExams.filter(
            (exam) =>
              exam.student_id === studentId ||
              (exam.student && exam.student.id === studentId)
          );

          console.log("Exams data for stats:", filteredByStudent);
          setData(filteredByStudent);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching student exams:", err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId]);

  return { data, loading };
}

export function useStudentCourseAssignments() {
  const studentId = useStudentId();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!studentId) return;
    axios
      .get(
        `/student-course-assignments?filter=${JSON.stringify({
          student_id: studentId,
        })}`
      )
      .then((res) => setData(res.data?.data || []));
  }, [studentId]);
  return data;
}

// --- API Fetchers ---
// Fetch a student by ID
export async function fetchStudents(studentId) {
  if (!studentId) throw new Error("studentId is required");
  const res = await axios.get(`/students/${studentId}`);
  return res.data?.data;
}

// Fetch student course enrollments by studentId
export async function fetchStudentCourseEnrollments(studentId) {
  if (!studentId) throw new Error("studentId is required");
  const res = await axios.get(
    `/student-course-enrollments?filter=${JSON.stringify({
      student: studentId,
    })}`
  );
  return res.data?.data;
}

// Fetch a single course by ID
export async function fetchCourseById(courseId) {
  if (!courseId) throw new Error("courseId is required");
  try {
    console.log("Fetching course by ID:", courseId);
    const res = await axios.get(`/courses/${courseId}`);
    return res.data?.data;
  } catch (error) {
    console.error(
      `Failed to fetch course with ID ${courseId}:`,
      error?.response?.status,
      error?.response?.data
    );
    return null; // Return null if not found or error occurs
  }
}

// Fetch all enrolled courses in expanded form for a student
export async function fetchEnrolledCoursesExpandedForm(studentId) {
  if (!studentId) throw new Error("studentId is required");
  const enrollments = await fetchStudentCourseEnrollments(studentId);
  if (!Array.isArray(enrollments)) return [];

  // Use course object if present, otherwise fetch by course_id
  const courseDetails = await Promise.all(
    enrollments.map(async (e) => {
      if (e.course) return { ...e, course: e.course };
      if (e.course_id) {
        const course = await fetchCourseById(e.course_id);
        return { ...e, course };
      }
      return { ...e, course: null };
    })
  );

  // Now courseDetails will always have the same length as enrollments
  courseDetails.forEach((enrollment) => {
    if (enrollment.course) {
      console.log("Course:", enrollment.course.name);
    } else {
      console.log(
        "Course not found for enrollment:",
        enrollment.id,
        "course_id:",
        enrollment.course_id
      );
    }
  });

  return courseDetails;
}

// Fetch details for all enrolled courses
export async function fetchEnrolledCourseDetails(studentId) {
  if (!studentId) throw new Error("studentId is required");

  try {
    // First get all course IDs the student is enrolled in
    const courseIds = await getStudentEnrolledCourseIds(studentId);

    if (courseIds.length === 0) {
      console.log(`Student ${studentId} has no enrolled courses`);
      return [];
    }

    console.log(`Fetching details for ${courseIds.length} courses...`);

    // Fetch details for each course in parallel
    const courseDetailsPromises = courseIds.map((id) => fetchCourseById(id));
    const courseDetails = await Promise.all(courseDetailsPromises);

    // Filter out any null responses (courses that couldn't be fetched)
    const validCourses = courseDetails.filter((course) => course !== null);

    console.log(
      `Successfully fetched details for ${validCourses.length} out of ${courseIds.length} courses`
    );

    return validCourses;
  } catch (error) {
    console.error(
      `Error fetching course details for student ${studentId}:`,
      error
    );
    return [];
  }
}

// Fetch group tutoring sessions by studentId
export async function fetchGroupTutoringSessions(studentId) {
  if (!studentId) throw new Error("studentId is required");
  const res = await axios.get(
    `/group-tutoring-sessions?filter=${JSON.stringify({ student: studentId })}`
  );
  return res.data?.data || [];
}

// Fetch tutoring sessions for a student with configurable limit (default 1000)
export async function fetchTutoringSessionsForStudent(studentId, limit = 1000) {
  if (!studentId) return [];
  try {
    const res = await axios.get(
      `/student-tutoring-sessions?limit=${limit}&filter=${encodeURIComponent(
        JSON.stringify({ student: studentId })
      )}`
    );
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error(
      `Error fetching tutoring sessions for student ${studentId}:`,
      err
    );
    return [];
  }
}

// Utility: Get upcoming sessions
export function getUpcomingSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter((s) => s.class_date && new Date(s.class_date) >= now)
    : [];
}

// Utility: Get upcoming exams
export function getUpcomingExams(exams) {
  const now = new Date();
  return Array.isArray(exams)
    ? exams.filter((exam) => {
        // First condition: exam is not taken yet
        const notTaken = exam.is_taken === false;

        // Second condition: exam has a future scheduled date if available
        const hasScheduledDate = exam.schedule_exam_date_time !== null;
        const isFutureExam = hasScheduledDate
          ? new Date(exam.schedule_exam_date_time) > now
          : true; // If no date, consider it upcoming

        // Third condition: check if exam is within its active time window
        const hasStartEndDates = exam.start_date_time && exam.end_date_time;
        const isWithinTimeWindow = hasStartEndDates
          ? now >= new Date(exam.start_date_time) &&
            now <= new Date(exam.end_date_time)
          : true; // If no start/end dates, consider it available

        return (
          notTaken &&
          (hasScheduledDate ? isFutureExam : true) &&
          isWithinTimeWindow
        );
      })
    : [];
}

// Utility: Get past sessions
export function getPastSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter((s) => s.class_date && new Date(s.class_date) < now)
    : [];
}

// Utility: Get upcoming sessions (approved or requested)
export function getUpcomingApprovedSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter(
        (s) =>
          s.class_date &&
          new Date(s.class_date) >= now &&
          s.is_requested === false
      )
    : [];
}

export function getUpcomingRequestedSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter(
        (s) =>
          s.class_date &&
          new Date(s.class_date) >= now &&
          s.is_requested === true
      )
    : [];
}

export function getPastApprovedSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter(
        (s) =>
          s.class_date &&
          new Date(s.class_date) < now &&
          s.is_requested === false
      )
    : [];
}

export function getPastRequestedSessions(sessions) {
  const now = new Date();
  return Array.isArray(sessions)
    ? sessions.filter(
        (s) =>
          s.class_date &&
          new Date(s.class_date) < now &&
          s.is_requested === true
      )
    : [];
}

// Filter sessions by requested status and date
export function filterTutoringSessions(sessions, options = {}) {
  if (!Array.isArray(sessions)) return [];

  const now = new Date();

  return sessions.filter((session) => {
    // Skip sessions without date
    if (!session.class_date) return false;

    const sessionDate = new Date(session.class_date);
    const isPast = sessionDate < now;
    const isPending = session.is_requested === true;

    // Pending Tutoring Sessions (requested but not accepted yet AND upcoming)
    if (options.pending && options.upcoming) {
      return !isPast && isPending;
    }

    // Previous Pending Sessions (requested but not accepted AND past)
    if (options.pending && options.past) {
      return isPast && isPending;
    }

    // Upcoming Tutoring Sessions (accepted AND upcoming)
    if (options.accepted && options.upcoming) {
      return !isPast && !isPending;
    }

    // Previous Tutoring Sessions (accepted AND past)
    if (options.accepted && options.past) {
      return isPast && !isPending;
    }

    // If no specific filter is passed, return all
    return true;
  });
}

// Pending Tutoring Sessions (requested but not yet accepted AND upcoming)
export function getPendingTutoringSessions(sessions) {
  return filterTutoringSessions(sessions, { pending: true, upcoming: true });
}

// Previous Pending Sessions (requested but not accepted AND in the past)
export function getPreviousPendingTutoringSessions(sessions) {
  return filterTutoringSessions(sessions, { pending: true, past: true });
}

// Upcoming Tutoring Sessions (accepted AND upcoming)
export function getUpcomingTutoringSessions(sessions) {
  return filterTutoringSessions(sessions, { accepted: true, upcoming: true });
}

// Previous Tutoring Sessions (accepted AND in the past)
export function getPreviousTutoringSessions(sessions) {
  return filterTutoringSessions(sessions, { accepted: true, past: true });
}

// Get all requested sessions (both past and future)
export function getAllRequestedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.is_requested === true);
}

// Get all accepted sessions (both past and future)
export function getAllAcceptedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.is_requested === false);
}

// Define these filter functions in your ScheduleContext.jsx file

// Requested sessions - not yet approved by tutor
export function getRequestedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.is_requested === true);
}

// Approved sessions - accepted by tutor
export function getApprovedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.is_requested === false);
}

// Completed sessions - regardless of approval status
export function getCompletedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.completed_or_cancelled === true);
}

// Pending (not completed) sessions - regardless of approval status
export function getPendingSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((session) => session.completed_or_cancelled === false);
}

// Combinations for more specific filtering:

// Requested sessions that are still pending
export function getRequestedPendingSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(
    (session) =>
      session.is_requested === true && session.completed_or_cancelled === false
  );
}

// Requested sessions that are completed
export function getRequestedCompletedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(
    (session) =>
      session.is_requested === true && session.completed_or_cancelled === true
  );
}

// Approved sessions that are still pending
export function getApprovedPendingSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(
    (session) =>
      session.is_requested === false && session.completed_or_cancelled === false
  );
}

// Approved sessions that are completed
export function getApprovedCompletedSessions(sessions) {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(
    (session) =>
      session.is_requested === false && session.completed_or_cancelled === true
  );
}

// Get array of all course IDs from student's enrollments
export async function getStudentEnrolledCourseIds(studentId) {
  if (!studentId) throw new Error("studentId is required");

  try {
    // Fetch enrollments
    const enrollments = await fetchStudentCourseEnrollments(studentId);

    if (!Array.isArray(enrollments) || enrollments.length === 0) {
      console.log(`No enrollments found for student ${studentId}`);
      return [];
    }

    // Extract course_id from each enrollment
    const courseIds = enrollments.map((enrollment) => enrollment.course_id);

    console.log(
      `Found ${courseIds.length} enrolled course IDs for student ${studentId}:`,
      courseIds
    );

    return courseIds;
  } catch (error) {
    console.error(
      `Error fetching enrolled course IDs for student ${studentId}:`,
      error
    );
    return [];
  }
}

// Hook to get and store details of all enrolled courses
export function useEnrolledCourseDetails() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.student_id) {
      setLoading(false);
      setCourses([]);
      return;
    }

    async function loadCourseDetails() {
      setLoading(true);
      try {
        console.log(
          "Fetching enrolled course details for student:",
          user.student_id
        );
        const courseDetails = await fetchEnrolledCourseDetails(user.student_id);
        console.log("Loaded course details:", courseDetails);
        setCourses(courseDetails);
      } catch (error) {
        console.error("Error in useEnrolledCourseDetails:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetails();
  }, [user?.student_id]);

  return { courses, loading };
}
