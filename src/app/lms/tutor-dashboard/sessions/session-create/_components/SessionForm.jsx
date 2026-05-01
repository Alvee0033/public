"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AutocompleteField } from "./AutocompleteField";
import { DateTimePicker } from "./DateTimePicker";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

export function SessionForm() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [tutorId, setTutorId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const [lessons, setLessons] = useState([]);
  const [sessionTypes, setSessionTypes] = useState([]);

  // Fetch session types for the Session type field
  useEffect(() => {
    async function fetchSessionTypes() {
      try {
        const { data } = await axios.get("/master-course-lesson-types");
        // Assuming API returns array of objects with id and name
        setSessionTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        toast.error("Failed to fetch session types");
        setSessionTypes([]);
      }
    }
    fetchSessionTypes();
  }, []);

  const [formData, setFormData] = useState({
    class_date: null,
    class_start_time: null,
    class_end_time: null,
    student_present: false,
    student_check_in_date_time: null,
    tutor_present: false,
    tutor_check_in_date_time: null,
    completion_percentage: "",
    completed_or_cancelled: false,
    new_or_repeat_session: false,
    is_requested: true,
    student_tutoring_session_number: "",
    google_event_id: "",
    google_meet_link: "",
    course: null,
    student: null,
    tutor: null,
    course_lesson: null,
    course_master_lesson: null,
    course_module: null,
    course_student_learning_schedule: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate required fields before submitting
    if (!formData.student) {
      toast.error("Please select a student");
      return;
    }
    if (!formData.class_date) {
      toast.error("Please select a class date");
      return;
    }
    if (!formData.class_start_time) {
      toast.error("Please select a start time");
      return;
    }
    if (!formData.class_end_time) {
      toast.error("Please select an end time");
      return;
    }

    // Convert empty strings/undefined to null for all fields
    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" || value === undefined ? null : value,
      ])
    );
    // Always include tutorId in the payload
    payload.tutor = tutorId;
    try {
      const response = await axios.post("/student-tutoring-sessions", payload);
      toast.success("Session created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
    }
  };

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
              // accept several possible keys for tutor id
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
    if (!tutorId) return;
    async function fetchTutorStudents() {
      try {
        const { data } = await axios.get(
          `/tutor-students?filter=${encodeURIComponent(
            JSON.stringify({ tutor: tutorId })
          )}`
        );
        const studentList = Array.isArray(data?.data)
          ? data.data.map((item) => ({
              id: item.student.id,
              name: item.student.full_name,
              ...item.student,
            }))
          : [];
        setStudents(studentList);
        setFilteredStudents(studentList);
      } catch (error) {
        toast.error("Failed to fetch students, enrollments, or sessions");
        setStudents([]);
        setFilteredStudents([]);
      }
    }
    fetchTutorStudents();
  }, [tutorId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If student is selected, fetch courses for that student and tutor
    if (field === "student" && value && tutorId) {
      fetchCoursesForStudentTutor(value, tutorId);
      // Clear dependent fields when student changes
      setFormData((prev) => ({
        ...prev,
        course: null,
        course_module: null,
        course_lesson: null,
      }));
      setCourses([]); // Clear courses when student changes
      setModules([]); // Clear modules when student changes
      setLessons([]); // Clear lessons when student changes
    }

    // If course is selected, fetch modules for that course
    if (field === "course" && value) {
      fetchModulesForCourse(value);
      // Clear dependent fields when course changes
      setFormData((prev) => ({
        ...prev,
        course_module: null,
        course_lesson: null,
      }));
      setModules([]); // Clear modules when course changes
      setLessons([]); // Clear lessons when course changes
    }

    // If module is selected, show its lessons
    if (field === "course_module" && value) {
      const selectedModule = modules.find((m) => m.id === value);
      const lessonList = Array.isArray(selectedModule?.course_lessons)
        ? selectedModule.course_lessons.map((lesson) => ({
            id: lesson.id,
            name: lesson.title,
            ...lesson,
          }))
        : [];
      setLessons(lessonList);
      // Clear lesson selection when module changes
      setFormData((prev) => ({
        ...prev,
        course_lesson: null,
      }));
    }
  };

  async function fetchModulesForCourse(courseId) {
    try {
      const filter = { course: courseId };
      console.log("Fetching modules with filter:", filter);
      const { data } = await axios.get(
        `/course-modules?filter=${encodeURIComponent(JSON.stringify(filter))}`
      );
      console.log("Module API response:", data);
      // Map modules for autocomplete: id and name
      const moduleList = Array.isArray(data?.data)
        ? data.data.map((item) => ({
            id: item.id,
            name: item.title,
            ...item,
          }))
        : [];
      console.log("Mapped module list:", moduleList);
      setModules(moduleList);
    } catch (error) {
      toast.error("Failed to fetch modules for selected course");
      setModules([]);
      console.error("Module fetch error:", error);
    }
  }

  async function fetchCoursesForStudentTutor(studentId, tutorId) {
    try {
      const filter = { student: studentId, assigned_primary_tutor: tutorId };
      console.log("Fetching courses with filter:", filter);
      const { data } = await axios.get(
        `/student-course-enrollments?filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`
      );
      console.log("Course API response:", data);
      // Map courses for autocomplete: id and name
      const courseList = Array.isArray(data?.data)
        ? data.data.map((item) => ({
            id: item.course?.id,
            name: item.course?.name,
            ...item.course,
          }))
        : [];
      console.log("Mapped course list:", courseList);
      setCourses(courseList);
    } catch (error) {
      toast.error("Failed to fetch courses for selected student");
      setCourses([]);
      console.error("Course fetch error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date and Time Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DateTimePicker
          label="Class Date"
          value={formData.class_date}
          onChange={(value) => handleInputChange("class_date", value)}
        />
        <DateTimePicker
          label="Class Start Time"
          value={formData.class_start_time}
          onChange={(value) => handleInputChange("class_start_time", value)}
          showTime={true}
        />
        <DateTimePicker
          label="Class End Time"
          value={formData.class_end_time}
          onChange={(value) => handleInputChange("class_end_time", value)}
          showTime={true}
        />
      </div>

      {/* Autocomplete Fields (replace with API-driven or empty for now) */}
      <div className="grid gap-4 md:grid-cols-2">
        <AutocompleteField
          label="Student"
          items={students}
          value={formData.student}
          onSelect={(value) => handleInputChange("student", value)}
          placeholder="Select a student..."
          displayKey="name"
          searchKey="name"
        />
        {/* <AutocompleteField
          label="Tutor"
          items={[]}
          value={formData.tutor}
          onSelect={(value) => handleInputChange("tutor", value)}
          placeholder="Select a tutor..."
          displayKey="name"
          searchKey="name"
        /> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AutocompleteField
          label="Course"
          items={courses}
          value={formData.course}
          onSelect={(value) => handleInputChange("course", value)}
          placeholder="Select a course..."
          displayKey="name"
          searchKey="name"
        />
        <AutocompleteField
          label="Course Module"
          items={modules}
          value={formData.course_module}
          onSelect={(value) => handleInputChange("course_module", value)}
          placeholder="Select a module..."
          displayKey="name"
          searchKey="name"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AutocompleteField
          label="Course Lesson"
          items={lessons}
          value={formData.course_lesson}
          onSelect={(value) => handleInputChange("course_lesson", value)}
          placeholder="Select a lesson..."
          displayKey="name"
          searchKey="name"
        />
        <AutocompleteField
          label="Session type"
          items={sessionTypes}
          value={formData.course_master_lesson}
          onSelect={(value) => handleInputChange("course_master_lesson", value)}
          placeholder="Select a session type..."
          displayKey="name"
          searchKey="name"
        />
      </div>

      {/* <AutocompleteField
        label="Course Student Learning Schedule"
        items={[]}
        value={formData.course_student_learning_schedule}
        onSelect={(value) => handleInputChange("course_student_learning_schedule", value)}
        placeholder="Select a learning schedule..."
        displayKey="name"
        searchKey="name"
      /> */}

      {/* Check-in Date Times */}
      {/* <div className="grid gap-4 md:grid-cols-2">
        <DateTimePicker
          label="Student Check-in Date Time"
          value={formData.student_check_in_date_time}
          onChange={(value) => handleInputChange("student_check_in_date_time", value)}
          showTime={true}
        />
        <DateTimePicker
          label="Tutor Check-in Date Time"
          value={formData.tutor_check_in_date_time}
          onChange={(value) => handleInputChange("tutor_check_in_date_time", value)}
          showTime={true}
        />
      </div> */}

      {/* Numeric and Text Fields */}
      {/* <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="completion_percentage">Completion Percentage</Label>
          <Input
            id="completion_percentage"
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={formData.completion_percentage}
            onChange={(e) => handleInputChange("completion_percentage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session_number">Student Tutoring Session Number</Label>
          <Input
            id="session_number"
            type="number"
            min="0"
            placeholder="Session number"
            value={formData.student_tutoring_session_number}
            onChange={(e) => handleInputChange("student_tutoring_session_number", e.target.value)}
          />
        </div>
      </div> */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="google_event_id">Google Event ID</Label>
          <Input
            id="google_event_id"
            type="text"
            placeholder="Enter Google Event ID"
            value={formData.google_event_id}
            onChange={(e) =>
              handleInputChange("google_event_id", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="google_meet_link">Google Meet Link</Label>
          <Input
            id="google_meet_link"
            type="url"
            placeholder="https://meet.google.com/..."
            value={formData.google_meet_link}
            onChange={(e) =>
              handleInputChange("google_meet_link", e.target.value)
            }
          />
        </div>
      </div>

      {/* Boolean Fields */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold">Session Status</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="student_present"
              checked={formData.student_present}
              onCheckedChange={(checked) => handleInputChange("student_present", checked)}
            />
            <Label htmlFor="student_present">Student Present</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tutor_present"
              checked={formData.tutor_present}
              onCheckedChange={(checked) => handleInputChange("tutor_present", checked)}
            />
            <Label htmlFor="tutor_present">Tutor Present</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed_or_cancelled"
              checked={formData.completed_or_cancelled}
              onCheckedChange={(checked) => handleInputChange("completed_or_cancelled", checked)}
            />
            <Label htmlFor="completed_or_cancelled">Completed or Cancelled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new_or_repeat_session"
              checked={formData.new_or_repeat_session}
              onCheckedChange={(checked) => handleInputChange("new_or_repeat_session", checked)}
            />
            <Label htmlFor="new_or_repeat_session">New or Repeat Session</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_requested"
              checked={formData.is_requested}
              onCheckedChange={(checked) => handleInputChange("is_requested", checked)}
            />
            <Label htmlFor="is_requested">Is Requested</Label>
          </div>
        </div>
      </div> */}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Create Session</Button>
      </div>
    </form>
  );
}
