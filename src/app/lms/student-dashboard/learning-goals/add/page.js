"use client";

import Button from "@/components/shared/buttons/Button";
import AIButton from "@/components/ui/AIButton";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { selectStyles as baseSelectStyles } from "@/lib/select-styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import useSWR from "swr";

const selectStyles = {
  ...baseSelectStyles, // keep your existing styles
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    maxHeight: 300, // or any value you prefer
    minWidth: 220, // adjust as needed
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export default function AddLearningGoal() {
  const [goalTitle, setGoalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateYear, setDateYear] = useState(2025);
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isAchieved, setIsAchieved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [fiscalId, setFiscalId] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [allCoursesLoaded, setAllCoursesLoaded] = useState(false);
  const { back } = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //eta openai theke description generation er jonno use korben bhais
  const handleAIGenerateDescription = async () => {
    if (!goalTitle.trim()) {
      toast.warning("Please enter a Goal Title first.");
      return;
    }

    setIsGenerating(true);

    try {
      const reqBody = {
        prompt: `
          Generate a comprehensive learning goal description (150-250 words) based on:
          - Goal Title: "${goalTitle}"
          
          The description should include:
          1. Clear explanation of the learning objective
          2. Key skills or knowledge to be acquired
          3. Potential learning activities or methods
          4. Expected outcomes and benefits
          5. Any relevant success metrics
        `,
        response: {
          description: "",
        },
      };

      const res = await axios.post("/ai/openai", reqBody);

      if (res?.data?.status === "SUCCESS") {
        setDescription(res.data.data.description);
        toast.success("AI-generated description added!");
      } else {
        toast.error("Failed to generate description.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch course categories
  const {
    data: courseCategories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useSWR("/course-categories", async () => {
    try {
      const response = await axios.get("/course-categories");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load course categories");
      return [];
    }
  });

  // Fetch fiscal quarters
  const {
    data: fiscalQuarters = [],
    isLoading: isLoadingQuarters,
    error: quartersError,
  } = useSWR("/master-fiscal-quarters", async () => {
    try {
      const response = await axios.get("/master-fiscal-quarters");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching quarters:", error);
      toast.error("Failed to load fiscal quarters");
      return [];
    }
  });

  // Fetch courses based on selected category (when category is selected)
  const {
    data: categoryFilteredCourses = [],
    isLoading: isLoadingCategoryCourses,
  } = useSWR(
    categoryId ? [`/courses-by-category`, categoryId] : null,
    async () => {
      try {
        const response = await axios.get(
          `/courses?pagination=true&filter=${JSON.stringify({
            course_category: categoryId,
          })}`
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching courses by category:", error);
        // toast.error("Failed to load courses for this category");
        return [];
      }
    }
  );

  // Fetch all courses using POST endpoint (when dropdown is opened)
  const {
    data: allCourses = [],
    isLoading: isLoadingAllCourses,
    mutate: refreshAllCourses,
  } = useSWR(
    isCourseMenuOpen && !allCoursesLoaded ? "/all-courses" : null,
    async () => {
      try {
        // Using POST endpoint as requested
        const response = await axios.post("/courses", {
          pagination: true,
          limit: 100, // Adjust limit as needed
        });
        setAllCoursesLoaded(true);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching all courses:", error);
        // toast.error("Failed to load courses");
        return [];
      }
    }
  );

  // Fetch K12 grades
  const {
    data: k12Grades = [],
    isLoading: isLoadingGrades,
    error: gradesError,
  } = useSWR("/master-k12-grades", async () => {
    try {
      const response = await axios.get("/master-k12-grades");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching K12 grades:", error);
      toast.error("Failed to load grades");
      return [];
    }
  });

  // Get user data from Redux state instead of /me API
  const userData = useAppSelector((state) => state.auth.user);
  
  // Set student ID from user data
  useEffect(() => {
    if (userData?.student_id) {
      setStudentId(userData.student_id);
    }
  }, [userData?.student_id]);

  // Determine if any data is still loading
  const isDataLoading =
    isLoadingCategories ||
    isLoadingQuarters ||
    isLoadingCategoryCourses ||
    isLoadingAllCourses ||
    isLoadingGrades ||
    !userData;

  // Create options for select components
  const categoryOptions =
    courseCategories?.map((category) => ({
      value: category.id,
      label: category.name || "Please wait...",
    })) || [];

  // Determine which courses to show based on context
  const coursesToShow = categoryId ? categoryFilteredCourses : allCourses;

  // Create course options from the appropriate source
  const courseOptions =
    coursesToShow?.map((course) => ({
      value: course.id,
      label: course.name || "Please wait...",
    })) || [];

  const fiscalOptions =
    fiscalQuarters?.map((fiscal) => ({
      value: fiscal.id,
      label: fiscal.title || "Please wait...",
    })) || [];

  // Create grade options
  const gradeOptions =
    k12Grades?.map((grade) => ({
      value: grade.id,
      label: grade.grade_level || "Please wait...",
      tooltip: grade.description,
    })) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Better validation with specific error messages
    if (!studentId) {
      toast.error(
        "Student information not available. Please refresh the page and try again."
      );
      console.error("Student ID is missing during form submission");
      return;
    }

    if (!goalTitle.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a course category");
      return;
    }

    if (!targetCompletionDate) {
      toast.error("Please select a target completion date");
      return;
    }

    setLoading(true);
    try {
      const data = {
        goal_title: goalTitle,
        description,
        date_year: dateYear,
        target_completion_date: targetCompletionDate,
        progress_percentage: progressPercentage,
        is_achieved: isAchieved,
        student: studentId,
        course_category: categoryId,
        course: courseId,
        master_fiscal_quarter: fiscalId,
        master_k12_grade: gradeId,
      };

      const response = await axios.post("/student-learning-goals", data);

      toast.success("Learning goal added successfully!");
      back();
    } catch (error) {
      console.error("Error adding learning goal:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add learning goal. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Combined loading state for form submission and data fetching
  const hasValidStudentId = studentId !== null && studentId !== undefined;
  const isFormDisabled = loading || isDataLoading || !hasValidStudentId;

  const handleCategoryChange = (option) => {
    setCategoryId(option.value);
    // Reset course selection when category changes
    setCourseId(null);
  };

  const handleCourseChange = (option) => {
    setCourseId(option.value);
  };

  const handleFiscalChange = (option) => {
    setFiscalId(option.value);
  };

  const handleGradeChange = (option) => {
    setGradeId(option.value);
  };

  // Handle course dropdown menu open
  const handleCourseMenuOpen = () => {
    setIsCourseMenuOpen(true);
    // If we haven't loaded courses yet or need to refresh, trigger the fetch
    if (!allCoursesLoaded) {
      refreshAllCourses();
    }
  };

  // Handle course dropdown menu close
  const handleCourseMenuClose = () => {
    setIsCourseMenuOpen(false);
  };

  // Show an error message if we couldn't fetch the user data (only when not loading)
  // `userError` was undefined here which caused a runtime ReferenceError.
  // Use the existing `userData` and `isDataLoading` flags instead.
  if (!userData && !isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Unable to load user information
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't retrieve your student information. Please try again
              later.
            </p>
            <Button
              type="button"
              onClick={() => back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Add a visual indicator when student ID is missing
  const studentIdWarning = !isDataLoading && !hasValidStudentId && (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Student information not loaded yet. Please wait or refresh the page.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
          {/* Header with gradient background - updated with theme colors */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[var(--primaryColor)] to-[var(--secondaryColor)] p-6">
            <h1 className="text-2xl font-bold text-white">
              Add New Learning Goal
            </h1>
          </div>

          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
              <div className="space-y-2">
                <Label htmlFor="goalTitle">Goal Title</Label>
                <Input
                  id="goalTitle"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter goal title"
                  required
                  disabled={isFormDisabled}
                  className="w-full border border-gray-300 focus:border-[var(--primaryColor)] rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[var(--primaryColor)] transition duration-200"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="description"
                      className="font-medium text-base"
                    >
                      Description
                    </Label>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="inline-flex items-center justify-center"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <AIButton
                            title="Generate with ScholarPASS Copilot"
                            disabled={isFormDisabled || !goalTitle.trim()}
                            className="text-sm px-4 py-2"
                            size="sm"
                          />
                        </button>
                      </DialogTrigger>

                      <DialogContent
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.4)",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"
                          onClick={() => setIsDialogOpen(false)}
                        />
                        <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl p-6">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-purple-500" />
                              ScholarPASS Copilot
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <p className="text-sm text-gray-600">
                              This will generate a detailed description based on
                              your goal title.
                            </p>

                            <AIButton
                              title={
                                isGenerating
                                  ? "Generating..."
                                  : "Generate Description"
                              }
                              onClick={handleAIGenerateDescription}
                              disabled={isGenerating}
                              className="w-full"
                              isLoading={isGenerating}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your learning goal or generate one with AI"
                    disabled={isFormDisabled}
                    className="min-h-[120px] w-full border border-gray-300 focus:border-purple-500 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 transition duration-200"
                  />

                  <p className="text-xs text-gray-500">
                    {description.length > 0
                      ? `${description.split(" ").length} words`
                      : "AI can help create a detailed description"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                <div className="space-y-2">
                  <Label>Course Category</Label>
                  <Select
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={categoryOptions.find(
                      (option) => option.value === categoryId
                    )}
                    placeholder="Select category"
                    isDisabled={isFormDisabled || isLoadingCategories}
                    isLoading={isLoadingCategories}
                    styles={selectStyles}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select
                    options={courseOptions}
                    onChange={handleCourseChange}
                    value={courseOptions.find(
                      (option) => option.value === courseId
                    )}
                    placeholder="Select course"
                    isDisabled={
                      isFormDisabled ||
                      isLoadingCategoryCourses ||
                      isLoadingAllCourses
                    }
                    isLoading={isLoadingCategoryCourses || isLoadingAllCourses}
                    styles={selectStyles}
                    onMenuOpen={handleCourseMenuOpen}
                    onMenuClose={handleCourseMenuClose}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fiscal Quarter</Label>
                  <Select
                    options={fiscalOptions}
                    onChange={handleFiscalChange}
                    value={fiscalOptions.find(
                      (option) => option.value === fiscalId
                    )}
                    placeholder="Select fiscal quarter"
                    isDisabled={isFormDisabled || isLoadingQuarters}
                    isLoading={isLoadingQuarters}
                    styles={selectStyles}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select
                    options={gradeOptions}
                    onChange={handleGradeChange}
                    value={gradeOptions.find(
                      (option) => option.value === gradeId
                    )}
                    placeholder="Select grade"
                    isDisabled={isFormDisabled || isLoadingGrades}
                    isLoading={isLoadingGrades}
                    styles={selectStyles}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCompletionDate">
                    Target Completion Date
                  </Label>
                  <Input
                    id="targetCompletionDate"
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => setTargetCompletionDate(e.target.value)}
                    required
                    disabled={isFormDisabled}
                    className="w-full border border-gray-300 focus:border-[var(--primaryColor)] rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[var(--primaryColor)] transition duration-200"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="progressPercentage">
                    Progress Percentage
                  </Label>
                  <Input
                    id="progressPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) =>
                      setProgressPercentage(Number(e.target.value))
                    }
                    required
                    disabled={isFormDisabled}
                    className="w-full border border-gray-300 focus:border-[#5f2ded] rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#5f2ded] transition duration-200"
                  />
                </div> */}
              </div>

              {/* <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAchieved"
                    checked={isAchieved}
                    onChange={(e) => setIsAchieved(e.target.checked)}
                    disabled={isFormDisabled}
                    className="h-4 w-4 rounded border-gray-300 text-[#5f2ded] focus:ring-[#5f2ded]"
                  />
                  <Label htmlFor="isAchieved">Mark as Achieved</Label>
                </div>
              </div> */}

              {studentIdWarning}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => back()}
                  disabled={isFormDisabled}
                  // className="border-gray-300 hover:border-[var(--primaryColor)] hover:text-[var(--primaryColor)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="bg-gradient-to-r from-[var(--primaryColor)] to-[var(--secondaryColor)] text-white hover:opacity-90 transition duration-200 rounded-md border-none"
                >
                  {loading ? "Adding..." : "Add Learning Goal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
