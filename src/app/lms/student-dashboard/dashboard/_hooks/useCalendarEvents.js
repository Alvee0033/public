import { useEffect, useState, useMemo } from "react";
import {
  fetchGroupTutoringSessions,
  useStudentExams,
  useStudentId,
  useStudentTutoringSessions,
} from "../_context/ScheduleContext";

export function useCalendarEvents() {
  // Add student ID
  const studentId = useStudentId();
  const { sessions, loading: sessionsLoading } = useStudentTutoringSessions();
  const { data: exams, loading: examsLoading } = useStudentExams();
  const [groupSessions, setGroupSessions] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);

  // Add group sessions fetching
  useEffect(() => {
    if (studentId) {
      setGroupLoading(true);

      fetchGroupTutoringSessions(studentId)
        .then((sessions) => {
          setGroupSessions(sessions || []);
          setGroupLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching group sessions:", err);
          setGroupSessions([]);
          setGroupLoading(false);
        });
    }
  }, [studentId]);

  // Memoize transformed events to prevent recalculation
  const events = useMemo(() => {
    // Transform tutoring sessions into events
    const tutoringEvents = (sessions || []).map((session) => ({
      id: `tutoring-${session.id}`,
      title: session.course?.name || "Tutoring Session",
      date: session.class_date ? new Date(session.class_date) : null,
      startTime: session.class_start_time
        ? new Date(session.class_start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      type: "tutoring",
      status: session.is_requested
        ? session.completed_or_cancelled
          ? "closed"
          : "pending"
        : session.completed_or_cancelled
        ? "completed"
        : "scheduled",
      originalData: session,
    }));

    // Transform exams into events
    const examEvents = (exams || []).map((exam) => ({
      id: `exam-${exam.id}`,
      title: exam.exam_title || exam.title || "Exam",
      date: exam.schedule_exam_date_time
        ? new Date(exam.schedule_exam_date_time)
        : null,
      startTime: exam.schedule_exam_date_time
        ? new Date(exam.schedule_exam_date_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      type: "exam",
      status: exam.taken_date ? "completed" : "scheduled",
      originalData: exam,
    }));

    // Transform group sessions into events
    const groupEvents = (groupSessions || []).map((session) => ({
      id: `group-${session.id}`,
      title: session.group?.title || session.group_name || "Group Session",
      date: session.class_date ? new Date(session.class_date) : null,
      startTime: session.class_date
        ? new Date(session.class_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      type: "group",
      status:
        new Date(session.class_date) < new Date() ? "completed" : "scheduled",
      originalData: session,
    }));

    // Combine all events and filter out those without a valid date
    return [...tutoringEvents, ...examEvents, ...groupEvents].filter(
      (event) => event.date instanceof Date && !isNaN(event.date)
    );
  }, [sessions, exams, groupSessions]);

  // Memoize yearly stats calculation
  const yearlyStats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return {
      tutoring: events.filter(
        (e) => e.type === "tutoring" && e.date?.getFullYear() === currentYear
      ).length,
      exams: events.filter(
        (e) => e.type === "exam" && e.date?.getFullYear() === currentYear
      ).length,
      group: events.filter(
        (e) => e.type === "group" && e.date?.getFullYear() === currentYear
      ).length,
      lessons: 0,
      scholarpass: 0,
      assessments: 0,
    };
  }, [events]);

  // Compute loading state
  const loading = sessionsLoading || examsLoading || groupLoading;

  return { events, yearlyStats, loading };
}
