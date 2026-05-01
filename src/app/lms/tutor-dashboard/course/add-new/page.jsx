"use client";
import { Image, Loader2, Play, Plus, Sparkles, Trash, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import AIButton from "@/components/ui/AIButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import RichText from "@/components/shared/rich-text";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { fileUpload } from "@/lib/fileUpload";
import { Field, FieldArray, Form, Formik } from "formik";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  course_category: Yup.number().required("Course category is required"),
  course_duration: Yup.string().nullable(),
  short_description: Yup.string().nullable(),
  description: Yup.string().nullable(),
});

const initialValues = {
  name: "",
  course_category: "",
  short_description: "",
  description: "",
  course_duration: "",
  has_scholarship: false,
  is_trending_course: false,
  regular_course_or_bootcamp_course: true,
  free_or_paid_course: false,
  published_on_public_site: false,
  drip_content_based_course: true,
  private_or_public_course: false,
  internal_notes: "",
  icon_media_library_id: "",
  course_approved: true,
  guideline_for_instructor: "",
  display_sequence: null,
  course_sales_revenue: null,
  enrolled_students: null,
  tutoring_session: null,
  image: "",
  rating_score: null,
  course_category: null,
  manager_employee: null,
  institute: null,
  primary_tutor: null,
  is_template: true,
  master_k12_grade: null,
  course_trailer: ""
};

const AddCourse = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [initialFormValues, setInitialFormValues] = useState(initialValues); // <-- new state
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checking, setChecking] = useState(true);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);


  // Fetch filtered tutor on mount and redirect if not verified
  useEffect(() => {
    async function fetchUserAndTutor() {
      try {
        // Get tutor ID from Redux state
        const tutorId = user?.tutor_id;
        if (tutorId) {
          const tutorsRes = await axios.get("/tutors?limit=1000");
          const foundTutor = Array.isArray(tutorsRes.data.data)
            ? tutorsRes.data.data.find(t => t.id === tutorId)
            : null;
          if (foundTutor && foundTutor.verified_tutor === false && foundTutor.summary !== null) {
            // Redirect to approval-pending page
            if (typeof window !== "undefined") {
              window.location.href = "/lms/tutor-dashboard/tutors-profile/approval-pending";
            }
            return;
          }
          else if (foundTutor && foundTutor.verified_tutor === false || foundTutor.verified_tutor === null && foundTutor.summary == null) {
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
              experience: foundTutor.years_of_experience ? String(foundTutor.years_of_experience) : "",
            });
          }
        }
      } catch (err) {
        // ignore error for now
      }
      setChecking(false);
    }
    
    if (user) {
      fetchUserAndTutor();
    } else {
      setChecking(false);
    }
  }, [user]);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axios.get("https://api.tutorsplan.com/course-categories");
        setCategoryData(
          (data?.data || []).map((cat) => ({
            ...cat,
            value: cat.id,
            label: cat.name,
          }))
        );
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();

    // Get tutor ID and set primary_tutor
    function getMe() {
      try {
        if (user?.tutor_id) {
          setInitialFormValues((prev) => ({
            ...prev,
            primary_tutor: user.tutor_id,
          }));
        }
      } catch (error) {
        console.error("Failed to get user data:", error);
      }
    }
    
    if (user) {
      getMe();
    }
  }, [user]);

  const loadCategories = async () => {
    const { data } = await axios.get("https://api.tutorsplan.com/course-categories");
    return (data?.data || []).map((cat) => ({
      value: cat.id,
      label: cat.name,
      id: cat.id,
    }));
  };

  const handleAIGenerateDescription = async (values, setFieldValue) => {
    if (!values.name || !values.course_category || !values.course_duration || !values.short_description) {
      toast.warning("Please fill in Name, Category, Duration & Short Description first.");
      return;
    }

    setIsGenerating(true);

    try {
      const reqBody = {
        prompt: `
          Generate a detailed course description (250+ words) using:
          - Course Name: "${values.name}"
          - Course Category ID: ${values.course_category}
          - Course Duration: "${values.course_duration}"
          - Short Description: "${values.short_description}"
        `,
        response: {
          description: "",
        },
      };

      const res = await axios.post("/ai/openai", reqBody);

      if (res?.data?.status === "SUCCESS") {
        setFieldValue("description", res.data.data.description);
        toast.success("Description generated successfully!");
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to generate description.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating description.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // Transform course_faq to array of strings "question - answer"
    const course_faq = Array.isArray(values.course_faq)
      ? values.course_faq.map(faq =>
        typeof faq === "string"
          ? faq
          : [faq.question, faq.answer].filter(Boolean).join(" - ")
      )
      : [];

    // Build payload with all required fields (add more as needed)
    const payload = {
      ...values,
      course_faq,
      regular_price: Number(values.regular_price) || 0,
      discounted_price: Number(values.discounted_price) || 0,
      discounted_percentage: Number(values.discounted_percentage) || 0,
      discounted_amount: Number(values.discounted_amount) || 0,
      has_scholarship: Boolean(values.has_scholarship),
      is_trending_course: Boolean(values.is_trending_course),
      regular_course_or_bootcamp_course: Boolean(values.regular_course_or_bootcamp_course),
      free_or_paid_course: Boolean(values.free_or_paid_course),
      published_on_public_site: Boolean(values.published_on_public_site),
      private_or_public_course: Boolean(values.private_or_public_course),
      drip_content_based_course: Boolean(values.drip_content_based_course),
      course_approved: Boolean(values.course_approved),
      is_template: Boolean(values.is_template),
      course_category: Number(values.course_category) || 0,
      number_of_modules: Number(values.number_of_modules) || 0,
      number_of_book_lessons: Number(values.number_of_book_lessons) || 0,
      number_of_video_lessons: Number(values.number_of_video_lessons) || 0,
      number_of_live_tutors_lessons: Number(values.number_of_live_tutors_lessons) || 0,
      number_of_labs: Number(values.number_of_labs) || 0,
      number_of_quizzes: Number(values.number_of_quizzes) || 0,
      credits: Number(values.credits) || 0,
      single_or_bundle_course: Number(values.single_or_bundle_course) || 0,
      display_sequence: Number(values.display_sequence) || 0,
      course_sales_revenue: Number(values.course_sales_revenue) || 0,
      enrolled_students: Number(values.enrolled_students) || 0,
      tutoring_session: Number(values.tutoring_session) || 0,
      rating_score: Number(values.rating_score) || 0,
      manager_employee: Number(values.manager_employee) || null,
      institute: Number(values.institute) || null,
      primary_tutor: Number(values.primary_tutor) || null,
      master_k12_grade: Number(values.master_k12_grade) || 0,
      // ...add any other required fields from your API schema
    };

    try {
      await axios.post("/courses", payload);
      toast.success("Course created successfully!");
      resetForm();
      router.push("/lms/tutor-dashboard/course");
    } catch (error) {
      toast.error("Failed to create course!");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4">
          {/* <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg> */}
           {/* <span className="animate-spin h-5 w-5 inline-block">⏳</span> */}
           <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <div className="text-lg font-semibold text-gray-700 mt-2">Checking for approval...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="grid flex-1 mt-3 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Formik
          initialValues={initialFormValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Basic Info */}
              <div className="mb-6 bg-white shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">
                      Course Name <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Enter course name"
                      className={errors.name && touched.name ? "border-red-500" : ""}
                    />
                    {errors.name && touched.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="course_duration">Course Duration</Label>
                    <Field
                      as={Input}
                      id="course_duration"
                      name="course_duration"
                      placeholder="e.g., 12 weeks"
                    />
                  </div>
                  <div>
                    <Label>
                      Select Course Category <span className="text-red-500">*</span>
                    </Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadCategories}
                      onChange={(option) => {
                        setFieldValue("course_category", option?.id);
                      }}
                      isClearable
                      placeholder="Select category"
                    />
                    {errors.course_category && touched.course_category && (
                      <p className="text-sm text-red-500">{errors.course_category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Short Description */}
              <div className="bg-white shadow-lg p-6">
                <RichText name="short_description" label="Short Description" />
              </div>

              <div>


                <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between mb-2 gap-2 bg-white shadow-lg p-6">
                  <label className="font-medium text-base" htmlFor="description">
                    Full Description
                  </label>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <AIButton title="Generate with ScholarPASS Copilot" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          ScholarPASS Copilot
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                          This will generate a detailed description using the provided fields.
                        </p>
                        <AIButton
                          disabled={isGenerating}
                          title={isGenerating ? "Generating..." : "Generate Description"}
                          onClick={() => handleAIGenerateDescription(values, setFieldValue)}
                          className="w-full"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>


                {/* Full Description */}
                <RichText name="description" label="" />

                {/* Prerequisites */}
                <RichText name="course_pre_requisition" label="Prerequisites" />

                {/* Learning Outcomes */}
                <RichText name="course_outcome" label="Learning Outcomes" />



                {/* Course FAQ */}
                <div className="my-6">
                  <label className="font-medium text-base">Course FAQ</label>
                  <FieldArray
                    name="course_faq"
                    render={(arrayHelpers) => (
                      <div className="space-y-4">
                        {values.course_faq?.map((faq, index) => (
                          <div key={index} className="flex flex-col gap-2 border p-4 rounded-md">
                            <div>
                              <Label htmlFor={`course_faq.${index}.question`}>Question</Label>
                              <Field
                                as={Input}
                                id={`course_faq.${index}.question`}
                                name={`course_faq.${index}.question`}
                                placeholder="Enter the question"
                                className={
                                  errors.course_faq?.[index]?.question &&
                                    touched.course_faq?.[index]?.question
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {errors.course_faq?.[index]?.question &&
                                touched.course_faq?.[index]?.question && (
                                  <p className="text-sm text-red-500">
                                    {errors.course_faq[index].question}
                                  </p>
                                )}
                            </div>
                            <div>
                              <Label htmlFor={`course_faq.${index}.answer`}>Answer</Label>
                              <Field
                                as={Textarea}
                                id={`course_faq.${index}.answer`}
                                name={`course_faq.${index}.answer`}
                                placeholder="Enter the answer"
                                rows={3}
                                className={
                                  errors.course_faq?.[index]?.answer &&
                                    touched.course_faq?.[index]?.answer
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {errors.course_faq?.[index]?.answer &&
                                touched.course_faq?.[index]?.answer && (
                                  <p className="text-sm text-red-500">
                                    {errors.course_faq[index].answer}
                                  </p>
                                )}
                            </div>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="flex items-center gap-2 text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                              Remove FAQ
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push({ question: "", answer: "" })}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          Add FAQ
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Course Media */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Course Media</h2>
                  <div className="flex gap-10">
                    <div className="flex flex-col items-center justify-center">
                      {values.image ? (
                        <div className="relative">
                          <NextImage
                            src={typeof values.image === "string" ? values.image : URL.createObjectURL(values.image)}
                            alt="Course Thumbnail"
                            width={192}
                            height={128}
                            className="h-32 w-48 rounded-lg object-cover border border-gray-200"
                            unoptimized={typeof values.image !== "string"}
                          />
                          <button
                            type="button"
                            onClick={() => setFieldValue("image", "")}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-md"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-48 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <Image className="h-12 w-12 text-gray-400" alt="course thumbnail" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="image"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const uploadedUrl = await fileUpload(file);
                              setFieldValue("image", uploadedUrl);
                            }
                          }}
                        />
                      </label>
                      {errors.image && touched.image && (
                        <p className="text-sm text-red-500 mt-2">{errors.image}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-10 mt-6">
                    <div className="flex flex-col items-center justify-center">
                      {values.course_trailer ? (
                        <div className="relative">
                          <video
                            src={typeof values.course_trailer === "string" ? values.course_trailer : URL.createObjectURL(values.course_trailer)}
                            controls
                            className="h-32 w-48 rounded-lg object-cover border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setFieldValue("course_trailer", "")}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-md"
                            aria-label="Remove video"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-48 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="course_trailer"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Video
                        <input
                          id="course_trailer"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const uploadedUrl = await fileUpload(file);
                              setFieldValue("course_trailer", uploadedUrl);
                            }
                          }}
                        />
                      </label>
                      {errors.course_trailer && touched.course_trailer && (
                        <p className="text-sm text-red-500 mt-2">{errors.course_trailer}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fees */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Fees</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="regular_price">Regular Fee</Label>
                      <Field
                        as={Input}
                        id="regular_price"
                        name="regular_price"
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          setFieldValue("regular_price", parseFloat(e.target.value));
                          if (values.discounted_price) {
                            const amount = parseFloat(e.target.value) - parseFloat(values.discounted_price || 0);
                            const percentage = ((amount / parseFloat(e.target.value)) * 100).toFixed(2);
                            setFieldValue("discounted_percentage", percentage);
                            setFieldValue("discounted_amount", amount);
                          }
                        }}
                      />
                      {errors.regular_price && touched.regular_price && (
                        <p className="text-sm text-red-500">{errors.regular_price}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="discounted_price">ScholarPASS Fee</Label>
                      <Field
                        as={Input}
                        id="discounted_price"
                        name="discounted_price"
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          setFieldValue("discounted_price", parseFloat(e.target.value));
                          if (values.regular_price) {
                            const amount = parseFloat(values.regular_price) - parseFloat(e.target.value || 0);
                            const percentage = ((amount / parseFloat(values.regular_price)) * 100).toFixed(2);
                            setFieldValue("discounted_percentage", percentage);
                            setFieldValue("discounted_amount", amount);
                          }
                        }}
                      />
                      {errors.discounted_price && touched.discounted_price && (
                        <p className="text-sm text-red-500">{errors.discounted_price}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="discounted_percentage">ScholarPASS Percentage</Label>
                      <Field
                        as={Input}
                        id="discounted_percentage"
                        name="discounted_percentage"
                        type="number"
                        placeholder="0"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="discounted_amount">ScholarPASS Amount</Label>
                      <Field
                        as={Input}
                        id="discounted_amount"
                        name="discounted_amount"
                        type="number"
                        placeholder="0.00"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold mb-4 hover:bg-blue-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default AddCourse;
