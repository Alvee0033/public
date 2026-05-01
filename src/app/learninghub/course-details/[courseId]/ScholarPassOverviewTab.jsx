"use client";

import { useState, useEffect } from "react";
import addItemsToLocalstorage from "@/libs/addItemsToLocalstorage";
import getItemsFromLocalstorage from "@/libs/getItemsFromLocalstorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Book,
  GraduationCap,
  Rocket,
  X,
  CheckCircle,
  Star,
  Sparkles,
} from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";

export default function CourseSelection({ allCourses: allCoursesProp }) {
  const [selectedGrade, setSelectedGrade] = useState(null);
  // Store selected courses as objects: { id, name, short_description, master_k12_grade, regular_course_or_bootcamp_course }
  const [selectedRegularCourses, setSelectedRegularCourses] = useState([]);
  const [selectedBootcampCourse, setSelectedBootcampCourse] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [animateAfterGradeSelect, setAnimateAfterGradeSelect] = useState(false);

  // Store course IDs that user has already purchased/enrolled (cannot be selected again)
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
  const [loadingPurchasedCourses, setLoadingPurchasedCourses] = useState(true);

  const STORAGE_KEY = "scholarpass_bundle";

  const { courseId } = useParams();

  // Use prefetched allCourses if provided by parent; otherwise fetch
  const getCourseDetails = async () => {
    try {
      const res = await axios.get(`/courses`);
      return res?.data?.data;
    } catch (error) {
      console.error("Error fetching course details", error);
    }
  };

  const {
    data: coursesFromFetch,
    isLoading,
    error,
  } = useSWR(allCoursesProp ? null : "All courses", getCourseDetails);

  const courses = allCoursesProp || coursesFromFetch || [];

  // Fetch purchased/enrolled courses to prevent re-selection
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      setLoadingPurchasedCourses(true);
      try {
        const res = await axios.get("/bundle-selected-course/my-courses");
        const data = res?.data?.data;

        // Extract all course IDs from all super_keys
        const courseIds = [];
        if (data && typeof data === "object") {
          // Iterate through all super_key arrays
          Object.values(data).forEach((superKeyArray) => {
            if (Array.isArray(superKeyArray)) {
              superKeyArray.forEach((item) => {
                if (item.course_id) {
                  courseIds.push(item.course_id);
                }
              });
            }
          });
        }

        // Remove duplicates and store
        setPurchasedCourseIds([...new Set(courseIds)]);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
        // On error, set empty array to allow selection
        setPurchasedCourseIds([]);
      } finally {
        setLoadingPurchasedCourses(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  // Hydrate selections from localStorage when the full `courses` list is available.
  // We map stored ids back to course objects and split bootcamp vs regular courses.
  useEffect(() => {
    if (!courses) return;
    try {
      const existing = getItemsFromLocalstorage(STORAGE_KEY);
      if (
        existing &&
        Array.isArray(existing.course_ids) &&
        existing.course_ids.length > 0
      ) {
        const ids = existing.course_ids;
        const mapped = ids
          .map((id) => courses.find((c) => c.id === id))
          .filter(Boolean);

        // Bootcamp course(s) are marked by regular_course_or_bootcamp_course === true
        const boot = mapped.find((c) => c.regular_course_or_bootcamp_course);
        const regulars = mapped.filter(
          (c) => !c.regular_course_or_bootcamp_course
        );

        if (regulars.length > 0) setSelectedRegularCourses(regulars);
        if (boot) setSelectedBootcampCourse(boot);
      }
    } catch (err) {
      console.error(
        "Failed to hydrate scholarpass bundle from localStorage",
        err
      );
    }
  }, [courses]);

  const gradeOptions = [
    // represent Kindergarten as 0 to match stored numeric grades (0 = Kindergarten)
    { value: 0, label: "Kindergarten" },
    // Grade 1..12
    ...Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `Grade ${i + 1}`,
    })),
  ];

  useEffect(() => {
    if (courses && (selectedGrade !== null && selectedGrade !== undefined)) {
      const filtered = courses.filter((course) =>
        // coerce both sides to numbers to be robust against string/number storage
        Number(course.master_k12_grade) === Number(selectedGrade)
      );
      setFilteredCourses(filtered);
      // trigger reveal animation for subsequent sections
      setAnimateAfterGradeSelect(false);
      const t = setTimeout(() => setAnimateAfterGradeSelect(true), 80);
      return () => clearTimeout(t);
    } else {
      setFilteredCourses([]);
    }
  }, [selectedGrade, courses]);

  const regularCourses = filteredCourses.filter(
    (course) => !course.regular_course_or_bootcamp_course
  );
  const bootcampCourses = filteredCourses.filter(
    (course) => course.regular_course_or_bootcamp_course
  );

  // Helper to render grade labels (match how master_k12_grade is stored)
  const getGradeLabel = (grade) => {
    // coerce to number when possible
    const g = Number(grade);
    if (Number.isNaN(g)) return String(grade || "-");
    // assume 0 represents Kindergarten in stored data; otherwise 1..12 are grades
    return g === 0 ? "Kindergarten" : `Grade ${g}`;
  };

  // Helper to check if a course is already selected
  const isCourseSelected = (courseId) =>
    selectedRegularCourses.some((c) => c.id === courseId);

  // Helper to check if a course has already been purchased
  const isCoursePurchased = (courseId) => purchasedCourseIds.includes(courseId);

  // Add selected course (from any grade)
  const handleRegularCourseSelect = (courseId) => {
    const id = Number.parseInt(courseId);

    // Check if course is already purchased
    if (isCoursePurchased(id)) {
      alert(
        "You have already purchased this course. Please select a different course."
      );
      return;
    }

    if (!isCourseSelected(id) && selectedRegularCourses.length < 4) {
      // Find course object from all courses
      const courseObj = courses?.find((c) => c.id === id);
      if (courseObj) {
        setSelectedRegularCourses((prev) => [...prev, courseObj]);
      }
    }
  };

  // Remove selected course
  const removeRegularCourse = (courseId) => {
    setSelectedRegularCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Add selected bootcamp course (from any grade)
  const handleBootcampCourseSelect = (courseId) => {
    const id =
      courseId && courseId !== "none" ? Number.parseInt(courseId) : null;
    if (id) {
      // Check if course is already purchased
      if (isCoursePurchased(id)) {
        alert(
          "You have already purchased this bootcamp course. Please select a different course."
        );
        return;
      }

      const courseObj = courses?.find((c) => c.id === id);
      if (courseObj) {
        setSelectedBootcampCourse(courseObj);
      }
    } else {
      setSelectedBootcampCourse(null);
    }
  };

  // Persist bundle selection to localStorage whenever it changes
  useEffect(() => {
    try {
      // course_ids should include regular courses and bootcamp course id (if any)
      const courseIds = [...selectedRegularCourses.map((c) => c.id)];
      if (selectedBootcampCourse && selectedBootcampCourse.id) {
        // ensure we don't duplicate ids
        if (!courseIds.includes(selectedBootcampCourse.id))
          courseIds.push(selectedBootcampCourse.id);
      }

      const payload = {
        course_ids: courseIds,
        // bundle_id must be the current course details page id
        bundle_id: Number(courseId) || null,
      };

      addItemsToLocalstorage(STORAGE_KEY, payload);
      // Notify other components in the same tab that the scholarpass bundle changed
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("scholarpass_bundle_changed"));
        }
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error(
        "Failed to persist scholarpass bundle to localStorage",
        err
      );
    }
  }, [selectedRegularCourses, selectedBootcampCourse, courseId]);

  // Only show regular courses for current grade that are not already selected and not purchased
  const availableRegularCourses = regularCourses.filter(
    (course) => !isCourseSelected(course.id) && !isCoursePurchased(course.id)
  );

  if (isLoading || loadingPurchasedCourses) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">
              {loadingPurchasedCourses
                ? "Loading your purchased courses..."
                : "Loading courses..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium">
            Error fetching course data
          </div>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      <div className="max-w-5xl mx-auto p-6 space-y-2">
        {/* Enhanced Header with Bundle Info */}
        <div className="text-center space-y-6 py-8">
          <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Your Learning Journey
          </h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl text-gray-700">
              We are offering you the flexibility to build your ScholarPassK12
              bundle with up to 4 regular courses and 1 bootcamp course
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Book className="w-4 h-4" />
                Up to 4 Regular Courses
              </div>
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <Rocket className="w-4 h-4" />1 Bootcamp Course
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Star className="w-4 h-4" />
                Grade-Specific Content
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Grade Selection */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg py-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  Step 1: Select Your Grade Level
                  <Badge
                    variant="secondary"
                    className="bg-green-600 text-white border-white/30"
                  >
                    Required
                  </Badge>
                </div>
                <p className="text-blue-100 text-sm font-normal mt-1">
                  Choose your current grade to see available courses
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {gradeOptions.map((grade) => (
                <Button
                  key={grade.value}
                  onClick={() => setSelectedGrade(grade.value)}
                  variant={selectedGrade === grade.value ? "default" : "outline"}
                  className={`h-16 text-lg font-semibold transition-all duration-200 ${
                    selectedGrade === grade.value
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg scale-105 ring-2 ring-blue-300"
                      : "bg-white text-black hover:bg-blue-50 hover:border-blue-400 hover:scale-105 hover:text-black"
                  }`}
                >
                  {grade.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

  {(selectedGrade !== null && selectedGrade !== undefined) && (
          <>
            {/* Enhanced Regular Courses Section */}
            <div
              className={`transform transition-all duration-500 ${
                animateAfterGradeSelect
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg py-3">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Book className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          Step 2: Choose Regular Courses
                          <Badge
                            variant="secondary"
                            className={`bg-white/20 text-white border-white/30 ${
                              selectedRegularCourses.length === 4
                                ? "bg-yellow-500/20"
                                : ""
                            }`}
                          >
                            {selectedRegularCourses.length}/4 Selected
                          </Badge>
                        </div>
                        <p className="text-green-100 text-sm font-normal mt-1">
                          Select up to 4 comprehensive courses for your grade
                          level
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {regularCourses.length > 0 ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">
                              Regular Courses Include:
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                              Comprehensive curriculum, interactive lessons,
                              assignments, and progress tracking
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Show info if some courses are filtered due to purchase */}
                      {regularCourses.filter((course) =>
                        isCoursePurchased(course.id)
                      ).length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                <span className="font-semibold">
                                  {
                                    regularCourses.filter((course) =>
                                      isCoursePurchased(course.id)
                                    ).length
                                  }
                                </span>{" "}
                                course
                                {regularCourses.filter((course) =>
                                  isCoursePurchased(course.id)
                                ).length !== 1
                                  ? "s"
                                  : ""}{" "}
                                not shown (already purchased)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Select
                        value=""
                        onValueChange={handleRegularCourseSelect}
                        disabled={selectedRegularCourses.length >= 4}
                      >
                        <SelectTrigger
                          className={`w-full max-w-full h-12 border-2 border-gray-200 hover:border-green-400 transition-all duration-200 rounded-lg shadow-sm px-4 flex items-center ${
                            selectedRegularCourses.length > 0
                              ? "ring-2 ring-green-200"
                              : "ring-0"
                          } transform hover:scale-[1.01]`}
                        >
                          <SelectValue
                            placeholder={
                              selectedRegularCourses.length >= 4
                                ? "✓ Maximum courses selected"
                                : "Choose a regular course to add"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRegularCourses.map((course) => (
                            <SelectItem
                              key={course.id}
                              value={course.id.toString()}
                              className="py-3"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {course.name}
                                </span>
                                <span className="text-xs text-gray-500 line-clamp-2">
                                  {course.short_description?.replace(
                                    /<[^>]*>/g,
                                    ""
                                  ) || "No description"}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Enhanced Selected Regular Courses (from any grade) */}
                      {selectedRegularCourses.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Your Selected Regular Courses:
                          </h4>
                          <div className="grid gap-3">
                            {selectedRegularCourses.map((course, index) => (
                              <div
                                key={course.id}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-800">
                                      {course.name}
                                    </h5>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {course.short_description?.replace(
                                        /<[^>]*>/g,
                                        ""
                                      ) || "No description"}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                      {getGradeLabel(course.master_k12_grade)}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRegularCourse(course.id)}
                                  className="ml-3 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Book className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        No regular courses available
                      </p>
                      <p className="text-sm">for {getGradeLabel(selectedGrade)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Bootcamp Courses Section */}
            <div
              className={`transform transition-all delay-100 duration-500 ${
                animateAfterGradeSelect
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg py-3">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Rocket className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          Step 3: Choose Bootcamp Course
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-white/30"
                          >
                            Optional
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`bg-white/20 text-white border-white/30 ${
                              selectedBootcampCourse ? "bg-yellow-500/20" : ""
                            }`}
                          >
                            {selectedBootcampCourse
                              ? "1/1 Selected"
                              : "0/1 Selected"}
                          </Badge>
                        </div>
                        <p className="text-purple-100 text-sm font-normal mt-1">
                          Add one intensive bootcamp for accelerated, hands-on
                          learning
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {bootcampCourses.length > 0 ? (
                    <>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Rocket className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-800">
                              Bootcamp Features:
                            </h4>
                            <p className="text-sm text-purple-700 mt-1">
                              Intensive format, project-based learning, expert
                              mentorship, and career-focused skills
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Show info if some bootcamp courses are filtered due to purchase */}
                      {bootcampCourses.filter((course) =>
                        isCoursePurchased(course.id)
                      ).length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-yellow-800">
                                <span className="font-semibold">
                                  {
                                    bootcampCourses.filter((course) =>
                                      isCoursePurchased(course.id)
                                    ).length
                                  }
                                </span>{" "}
                                bootcamp course
                                {bootcampCourses.filter((course) =>
                                  isCoursePurchased(course.id)
                                ).length !== 1
                                  ? "s"
                                  : ""}{" "}
                                marked as already purchased
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Select
                        value={selectedBootcampCourse?.id?.toString() || "none"}
                        onValueChange={handleBootcampCourseSelect}
                      >
                        <SelectTrigger className="w-full max-w-full h-12 border-2 border-gray-200 hover:border-purple-400 transition-colors rounded-lg shadow-sm px-3 flex items-center">
                          <SelectValue placeholder="Choose a bootcamp course (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="py-3">
                            <span className="text-gray-500">
                              No bootcamp course
                            </span>
                          </SelectItem>
                          {bootcampCourses.map((course) => {
                            const isPurchased = isCoursePurchased(course.id);
                            return (
                              <SelectItem
                                key={course.id}
                                value={course.id.toString()}
                                className="py-3"
                                disabled={isPurchased}
                              >
                                <div className="flex flex-col">
                                  <span
                                    className={`font-medium ${
                                      isPurchased
                                        ? "text-gray-400 line-through"
                                        : ""
                                    }`}
                                  >
                                    {course.name}
                                    {isPurchased && (
                                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                        Already Purchased
                                      </span>
                                    )}
                                  </span>
                                  <span
                                    className={`text-xs line-clamp-2 ${
                                      isPurchased
                                        ? "text-gray-300"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {course.short_description?.replace(
                                      /<[^>]*>/g,
                                      ""
                                    ) || "No description"}
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {/* Enhanced Selected Bootcamp Course (from any grade) */}
                      {selectedBootcampCourse && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-purple-600" />
                            Your Selected Bootcamp Course:
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <Rocket className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800">
                                  {selectedBootcampCourse.name}
                                </h5>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {selectedBootcampCourse.short_description?.replace(
                                    /<[^>]*>/g,
                                    ""
                                  ) || "No description"}
                                </p>
                                <span className="text-xs text-gray-400">
                                  {getGradeLabel(selectedBootcampCourse.master_k12_grade)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Rocket className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        No bootcamp courses available
                      </p>
                      <p className="text-sm">for {getGradeLabel(selectedGrade)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Summary and Action */}
            {(selectedRegularCourses.length > 0 || selectedBootcampCourse) && (
              <div
                className={`transform transition-all delay-200 duration-500 ${
                  animateAfterGradeSelect
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      Your ScholarPassK12 Bundle Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                          Selected Grade: {getGradeLabel(selectedGrade)}
                        </h4>
                      </div>

                      {selectedRegularCourses.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Book className="w-5 h-5 text-green-600" />
                            Regular Courses ({selectedRegularCourses.length}/4):
                          </h4>
                          <ul className="space-y-2">
                            {selectedRegularCourses.map((course, index) => (
                              <li
                                key={course.id}
                                className="flex items-center gap-2 text-gray-700"
                              >
                                <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                {course.name}
                                <span className="text-xs text-gray-400 ml-2">
                                  {getGradeLabel(course.master_k12_grade)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedBootcampCourse && (
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-purple-600" />
                            Bootcamp Course:
                          </h4>
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              <Rocket className="w-3 h-3" />
                            </div>
                            {selectedBootcampCourse.name}
                            <span className="text-xs text-gray-400 ml-2">
                              {getGradeLabel(selectedBootcampCourse.master_k12_grade)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">
                          🎉 Your Bundle is Ready!
                        </h3>
                        <p className="text-blue-100 mb-4">
                          You&apos;ve selected {selectedRegularCourses.length}{" "}
                          regular course
                          {selectedRegularCourses.length !== 1 ? "s" : ""}
                          {selectedBootcampCourse
                            ? " and 1 bootcamp course"
                            : ""}{" "}
                          for your ScholarPassK12 bundle.
                        </p>
                        {/* <Button
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                        size="lg"
                      >
                        Proceed with Selected Courses
                      </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
