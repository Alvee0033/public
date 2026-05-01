"use client";

import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Import Input component for search
import axios from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, MoreHorizontal, XCircle } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtered results
  const [tutorId, setTutorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Track which student row has actions expanded
  const [expandedActionStudentId, setExpandedActionStudentId] = useState(null);
  // Enrollments state: { [studentId]: [courseTitle, ...] }
  const [studentCourses, setStudentCourses] = useState({});
  // Scheduled sessions state: { [studentId]: [sessionObj, ...] }
  const [studentSessions, setStudentSessions] = useState({});

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  // Fetch filtered tutor on mount and redirect if not verified
  useEffect(() => {
    async function fetchUserAndTutor() {
      try {
        // Get tutor ID from Redux state
        let tutorId = user?.tutor_id;

        // Fallback to localStorage if not found in Redux state
        if (!tutorId && typeof window !== "undefined") {
          const raw = localStorage.getItem("user");
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              tutorId =
                parsed?.tutor_id ?? parsed?.tutorId ?? parsed?.tutor ?? null;
            } catch (err) {
              console.error("Failed to parse user from localStorage", err);
            }
          }
        }

        if (tutorId) {
          const tutorsRes = await axios.get("/tutors?limit=1000");
          const foundTutor = Array.isArray(tutorsRes.data.data)
            ? tutorsRes.data.data.find((t) => t.id === tutorId)
            : null;
          if (
            foundTutor &&
            foundTutor.verified_tutor === false &&
            foundTutor.summary !== null
          ) {
            // Redirect to approval-pending page
            if (typeof window !== "undefined") {
              window.location.href =
                "/lms/tutor-dashboard/tutors-profile/approval-pending";
            }
            return;
          } else if (
            (foundTutor && foundTutor.verified_tutor === false) ||
            (foundTutor.verified_tutor === null && foundTutor.summary == null)
          ) {
            // Redirect to profile approval page
            if (typeof window !== "undefined") {
              window.location.href = "/lms/tutor-dashboard/tutors-profile";
            }
            return;
          }
          setFilteredTutor(foundTutor || null);
          if (foundTutor) {
            setProfileData({
              firstName: foundTutor.first_name || "",
              lastName: foundTutor.last_name || "",
              username: foundTutor.personal_email || foundTutor.email || "",
              email: foundTutor.personal_email || foundTutor.email || "",
              phone: foundTutor.mobile || "",
              bio: foundTutor.full_profile || "",
              subjects: foundTutor.subjects || [],
              experience: foundTutor.years_of_experience
                ? String(foundTutor.years_of_experience)
                : "",
            });
          }
        }
      } catch (err) {
        // ignore error for now
      }
      setChecking(false);
    }
    fetchUserAndTutor();
  }, [user]); // Add user dependency

  // Get tutor_id from Redux state
  useEffect(() => {
    function getTutorId() {
      try {
        // Get tutor ID from Redux state first
        let id = user?.tutor_id;

        // Fallback to localStorage if not found in Redux state
        if (!id && typeof window !== "undefined") {
          const raw = localStorage.getItem("user");
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              id = parsed?.tutor_id ?? parsed?.tutorId ?? parsed?.tutor;
            } catch (err) {
              console.error("Failed to parse user from localStorage", err);
            }
          }
        }

        if (!id) {
          toast.error("No tutor ID found. Access denied.");
          router.push("/login");
        } else {
          setTutorId(id);
        }
      } catch (error) {
        toast.error("Failed to get user info");
        router.push("/login");
      }
    }

    if (user) {
      getTutorId();
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchStudentsAndCoursesAndSessions() {
      if (!tutorId) return;
      try {
        const { data } = await axios.get(
          `/tutor-students?filter=${encodeURIComponent(
            JSON.stringify({ tutor: tutorId })
          )}`
        );
        // Extract the student objects from the response
        const studentList = Array.isArray(data?.data)
          ? data.data.map((item) => item.student)
          : [];
        setStudents(studentList);
        setFilteredStudents(studentList); // Initialize filtered students with all students

        // Fetch enrollments for all students
        if (studentList.length > 0) {
          const ids = studentList.map((s) => s.id || s._id).filter(Boolean);
          // Get all enrollments (could be optimized with filter param if API supports)
          const enrollRes = await axios.get(
            `/student-course-enrollments?limit=100000`
          );
          const enrollments = Array.isArray(enrollRes.data?.data)
            ? enrollRes.data.data
            : [];
          // Map studentId to array of course titles
          const map = {};
          ids.forEach((studentId) => {
            map[studentId] = enrollments
              .filter((e) => e.student_id === studentId)
              .map((e) =>
                e.course && e.course.name
                  ? e.course.name
                  : e.course_id
                  ? `Course #${e.course_id}`
                  : ""
              );
          });
          setStudentCourses(map);

          // Fetch scheduled sessions for all students
          // Get all sessions (could be optimized with filter param if API supports)
          const sessionRes = await axios.get(
            `/student-tutoring-sessions?limit=100000`
          );
          const sessions = Array.isArray(sessionRes.data?.data)
            ? sessionRes.data.data
            : [];
          // Map studentId to array of session objects (filtered by tutorId)
          const sessionMap = {};
          ids.forEach((studentId) => {
            sessionMap[studentId] = sessions
              .filter(
                (s) =>
                  s.student &&
                  s.student.id === studentId &&
                  s.tutor &&
                  s.tutor.id === tutorId
              )
              .map((s) => s); // keep full session object
          });
          setStudentSessions(sessionMap);
        }
      } catch (error) {
        toast.error("Failed to fetch students, enrollments, or sessions");
        setStudents([]);
        setFilteredStudents([]);
        setStudentCourses({});
        setStudentSessions({});
      }
      setLoading(false);
    }
    fetchStudentsAndCoursesAndSessions();
  }, [tutorId]);
  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = students.filter((student) => {
        // Search in full name, email, or guardian name
        const fullName =
          student.full_name || `${student.first_name} ${student.last_name}`;
        return (
          fullName.toLowerCase().includes(term) ||
          (student.email_address &&
            student.email_address.toLowerCase().includes(term)) ||
          (student.primary_guardian_name &&
            student.primary_guardian_name.toLowerCase().includes(term))
        );
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  if (loading) {
    return <Loading />;
  }

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Checking for approval...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-4 md:p-6 w-full overflow-x">
      <Card className="w-full">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
          <CardTitle className="text-base sm:text-xl md:text-2xl">
            My Students
          </CardTitle>
          <div className="w-full md:w-64">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full overflow-x-auto">
            <Table className="min-w-[480px] sm:min-w-[600px] w-full text-xs sm:text-sm">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                    Student Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                    Scheduled Session
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                    Enrolled Course
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                    Attendance Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {students.length === 0
                        ? "No students found."
                        : "No matching students found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, idx) => {
                    // Helper functions for avatar and attendance
                    const getInitials = (name) => {
                      return name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                    };
                    const getAttendanceBadge = (status) => {
                      if (status === "present") {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                            <CheckCircle className="w-3 h-3 mr-1" /> Present
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
                            <XCircle className="w-3 h-3 mr-1" /> Absent
                          </span>
                        );
                      }
                    };
                    return (
                      <TableRow
                        key={student.id || student._id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-3 min-w-[120px]">
                            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {student.profile_picture ? (
                                <img
                                  src={student.profile_picture}
                                  alt={student.full_name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-gray-600 text-xs sm:text-sm font-medium">
                                  {getInitials(
                                    student.full_name ||
                                      `${student.first_name} ${student.last_name}`
                                  )}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                                {student.full_name ||
                                  `${student.first_name} ${student.last_name}`}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-2 min-w-[80px]">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            {/* Show start date and time if available for this student and tutor */}
                            {Array.isArray(
                              studentSessions[student.id || student._id]
                            ) &&
                            studentSessions[student.id || student._id].length >
                              0 ? (
                              <span className="text-gray-900 text-xs sm:text-sm">
                                {studentSessions[student.id || student._id]
                                  .map((session) => {
                                    if (session.class_start_time) {
                                      const dateObj = new Date(
                                        session.class_start_time
                                      );
                                      const dateStr =
                                        dateObj.toLocaleDateString();
                                      const timeStr =
                                        dateObj.toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        });
                                      return `${dateStr} ${timeStr}`;
                                    }
                                    return "-";
                                  })
                                  .join(", ")}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="flex gap-1 overflow-x-auto max-w-[90px] sm:max-w-[220px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{ whiteSpace: "nowrap", paddingBottom: 2 }}
                          >
                            {(studentCourses[student.id || student._id] || [])
                              .length > 0 ? (
                              studentCourses[student.id || student._id].map(
                                (title, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 mr-1"
                                  >
                                    {title}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No courses
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getAttendanceBadge(
                            student.attendanceStatus ||
                              student.attendance_status
                          )}
                        </TableCell>
                        <TableCell style={{ position: "relative" }}>
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100 focus:outline-none"
                              title="Actions"
                              onClick={() => {
                                setExpandedActionStudentId(
                                  expandedActionStudentId ===
                                    (student.id || student._id)
                                    ? null
                                    : student.id || student._id
                                );
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {/* Popup menu for View button */}
                            {expandedActionStudentId ===
                              (student.id || student._id) && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: 0,
                                  zIndex: 10,
                                  minWidth: "80px",
                                }}
                                className="bg-white border border-gray-200 rounded shadow-lg py-1 px-2 flex flex-col"
                              >
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded bg-whitw text-black text-xs font-medium hover:bg-gray-200 focus:outline-none"
                                  title="View"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowModal(true);
                                    setExpandedActionStudentId(null);
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Modal for viewing student details */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-1 sm:px-0">
          <div className="bg-white rounded-xl shadow-lg p-2 sm:p-8 min-w-[180px] sm:min-w-[320px] max-w-[99vw] sm:max-w-[90vw] relative">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">
              Student Details
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {selectedStudent.full_name ||
                  `${selectedStudent.first_name} ${selectedStudent.last_name}`}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                {selectedStudent.email_address || selectedStudent.email || "-"}
              </div>
              <div>
                <span className="font-medium">Guardian Email:</span>{" "}
                {selectedStudent.primary_guardian_email ||
                  selectedStudent.guardian_email ||
                  "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
