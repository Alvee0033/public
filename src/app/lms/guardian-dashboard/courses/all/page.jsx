"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axios";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Skeleton component for loading state
const CourseCardSkeleton = () => (
  <Card className="shadow-md animate-pulse">
    <CardHeader>
      <CardTitle>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      </CardTitle>
      <CardDescription>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2 w-full md:w-2/3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-full md:w-1/3 h-32 bg-gray-200 rounded-md"></div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
        <div className="ml-auto h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </CardContent>
  </Card>
);

export default function GuardianAllCourses() {
  const [courses, setCourses] = useState([]);
  const [guardianStudents, setGuardianStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [openDialogs, setOpenDialogs] = useState({});
  const [openRemoveDialogs, setOpenRemoveDialogs] = useState({});
  const [guardianId, setGuardianId] = useState(null);

  const fetchMe = async () => {
    try {
      const response = await axios.post("/auth/me");
      console.log("Guardian Me:", response.data);
      const userId = response.data.data?.app_user_roles?.[0]?.user_id;
      if (userId) {
        setGuardianId(userId);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      if (!guardianId) return;

      const response = await axios.get(
        `/guardian-course-enrollments?limit=1000&filter={"guardian_id": "${guardianId}"}`
      );
      console.log("Guardian courses", response);
      if (response.data.data?.length > 0) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchGuardianStudents = async () => {
    try {
      const response = await axios.get(
        "/student-guardian-accesses/guardian-student-list"
      );
      if (response.data.data?.length > 0) {
        setGuardianStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const updateStudentForCourse = async (enrollmentId, studentId) => {
    try {
      const response = await axios.patch(
        `/guardian-course-enrollments/${enrollmentId}`,
        {
          student: studentId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const removeStudentFromCourse = async (enrollmentId) => {
    try {
      setRemoving(true);
      const response = await axios.patch(
        `/guardian-course-enrollments/${enrollmentId}`,
        {
          student: null,
        }
      );
      await fetchCourses();
      setOpenRemoveDialogs((prev) => ({ ...prev, [enrollmentId]: false }));
      return response.data;
    } catch (error) {
      console.error("Remove failed:", error.response?.data || error.message);
      throw error;
    } finally {
      setRemoving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchMe();
      await Promise.all([fetchCourses(), fetchGuardianStudents()]);
      setLoading(false);
    };
    loadData();
  }, [guardianId]);

  const handleStudentSelect = (enrollmentId, student) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...student,
        id: student.student_id,
      },
    }));
  };

  const handleEnroll = async (enrollmentId) => {
    if (!selectedStudents[enrollmentId]) return;

    setEnrolling(true);
    try {
      await updateStudentForCourse(
        enrollmentId,
        selectedStudents[enrollmentId].id
      );

      // alert(`Successfully assigned student to course!`);
      await fetchCourses();
      setOpenDialogs((prev) => ({ ...prev, [enrollmentId]: false }));
    } catch (error) {
      console.error("Error updating student:", error);
      alert(
        error.response?.data?.message || "Failed to update student assignment."
      );
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemove = async (enrollmentId) => {
    try {
      await removeStudentFromCourse(enrollmentId);
      // alert('Student successfully removed from course');
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove student.");
    }
  };

  const toggleDialog = (enrollmentId, isOpen) => {
    setOpenDialogs((prev) => ({ ...prev, [enrollmentId]: isOpen }));
  };

  const toggleRemoveDialog = (enrollmentId, isOpen) => {
    setOpenRemoveDialogs((prev) => ({ ...prev, [enrollmentId]: isOpen }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mt-6 mb-6">
          <h1>My Courses</h1>
        </div>
        {/* Show 3 skeleton cards while loading */}
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mt-6 mb-6">
        <h1>My Courses</h1>
      </div>

      {courses.map((enrollment) => (
        <Card key={enrollment.id} className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-orange-600 text-transparent bg-clip-text">
              {enrollment.course?.name || `Course ID: ${enrollment.course_id}`}
            </CardTitle>
            <CardDescription>
              {enrollment.course?.short_description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: enrollment.course.short_description,
                  }}
                />
              ) : (
                "No description available"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <p>
                  Current Student:{" "}
                  {enrollment.student?.full_name ||
                    enrollment.student_name ||
                    "Not assigned"}
                </p>
                <p>
                  Enrollment Date:{" "}
                  {new Date(enrollment.enrollment_date).toLocaleDateString()}
                </p>
              </div>
              {enrollment.course?.image && (
                <img
                  src={enrollment.course.image}
                  alt={enrollment.course.name || "Course image"}
                  className="rounded-md w-42 h-32 object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {selectedStudents[enrollment.id]?.student_name ||
                      "Select Student"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {guardianStudents.length > 0 ? (
                    guardianStudents.map((student) => (
                      <DropdownMenuItem
                        key={student.id}
                        onClick={() =>
                          handleStudentSelect(enrollment.id, student)
                        }
                      >
                        {student.student_name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No students available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedStudents[enrollment.id] && (
                <Dialog
                  open={openDialogs[enrollment.id] || false}
                  onOpenChange={(isOpen) => toggleDialog(enrollment.id, isOpen)}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="relative overflow-hidden text-white"
                      style={{
                        background:
                          "linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)",
                      }}
                    >
                      Assign Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Student Assignment</DialogTitle>
                      <DialogDescription>
                        Assign {selectedStudents[enrollment.id]?.student_name}{" "}
                        to this course?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => toggleDialog(enrollment.id, false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="relative overflow-hidden text-white"
                        style={{
                          background:
                            "linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)",
                        }}
                        onClick={() => handleEnroll(enrollment.id)}
                        disabled={enrolling}
                      >
                        {enrolling ? "Assigning..." : "Confirm Assignment"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {enrollment.student && (
                <div className="ml-auto">
                  <Dialog
                    open={openRemoveDialogs[enrollment.id] || false}
                    onOpenChange={(isOpen) =>
                      toggleRemoveDialog(enrollment.id, isOpen)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Remove Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Student Removal</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove{" "}
                          {enrollment.student?.full_name ||
                            enrollment.student_name}{" "}
                          from this course?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="outline"
                            onClick={() =>
                              toggleRemoveDialog(enrollment.id, false)
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemove(enrollment.id)}
                            disabled={removing}
                          >
                            {removing ? "Removing..." : "Confirm Removal"}
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
