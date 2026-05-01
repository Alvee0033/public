"use client";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChipInput from "@/components/chipsInput";
import SelectField from "@/components/selectField";
import TextareaList from "@/components/textarea-dynmaic";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/redux/hooks";
import { Textarea } from "@/components/ui/textarea";
import { fileUpload } from "@/lib/fileUpload";
import useCourseData from "@/hooks/useCourseSelectors";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { Field, FieldArray, Form, Formik } from "formik";
import AsyncSelect from "react-select/async";
import { X, Plus, Trash, Upload, Image, Play } from "lucide-react";
import * as Yup from "yup";
import Loading from "@/app/loading";

const EditCourse = () => <Edit />;
export default EditCourse;

const defaultCourseData = {
  title: "",
  short_description: "",
  description: "",
  thumbnail: "",
  overview_video: "",
  price: "",
  discount: "",
  duration: "",
  level: "",
  category: "",
  subCategory: "",
  course_type: "",
  courseTags: [],
  language: "",
  totalSeat: "",
  requirements: [],
  courseIncludes: [],
  cetification: false,
  outcomes: [],
  instructor: {},
  status: "",
  isBootcamp: false,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  course_category: Yup.number().required("Course category is required"),
  image: Yup.string().nullable(),
  course_trailer: Yup.string().nullable(),
  short_description: Yup.string().nullable(),
  description: Yup.string().nullable(),
  course_faq: Yup.array()
    .of(
      Yup.object({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
      })
    )
    .nullable(),
  course_pre_requisition: Yup.string().nullable(),
  course_outcome: Yup.string().nullable(),
  regular_price: Yup.number().nullable(),
  discounted_price: Yup.number()
    .nullable()
    .when("regular_price", (regular_price, schema) =>
      regular_price
        ? schema.max(
            regular_price,
            "Discounted price cannot exceed regular price"
          )
        : schema
    ),
  discounted_percentage: Yup.number()
    .nullable()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%"),
  discounted_amount: Yup.number().nullable().min(0, "Cannot be negative"),
  course_duration: Yup.string().nullable(),
});

const defaultValues = {
  name: "",
  course_category: "",
  short_description: "",
  description: "",
  course_faq: [],
  course_pre_requisition: "",
  course_outcome: "",
  regular_price: "",
  has_scholarship: false,
  discounted_price: "",
  discounted_percentage: "",
  discounted_amount: "",
  course_duration: "",
  image: "",
  course_trailer: "",
  is_trending_course: false,
  regular_course_or_bootcamp_course: false,
  single_or_bundle_course: false,
  free_or_paid_course: false,
  published_on_public_site: false,
  private_or_public_course: false,
  drip_content_based_course: false,
  internal_notes: "",
  course_approved: false,
  guideline_for_instructor: "",
  // ...add other fields as needed
};

const Edit = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [category, setCategory] = useState(null);
  const [tutorId, setTutorId] = useState(null);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  const [course, setCourse] = useState(defaultCourseData);
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [courseIncludes, setCourseIncludes] = useState([]);
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false);
  const [isBootcamp, setIsBootcamp] = useState(false);

  // Fetch course data by ID
  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const { data } = await axios.get(`/courses/${courseId}`);
        const courseData = data?.data || {};
        setCourse({
          ...defaultCourseData,
          ...courseData,
        });
        setChips(courseData.courseTags || []);
        setRequirements(courseData.requirements || []);
        setOutcomes(courseData.outcomes || []);
        setCourseIncludes(courseData.courseIncludes || []);
        setIsCertificateAvailable(!!courseData.cetification);
        setIsBootcamp(!!courseData.isBootcamp);
        setInitialValues({
          ...defaultValues,
          ...courseData,
          course_category: courseData.course_category?.id || courseData.course_category_id || "",
          course_faq:
            Array.isArray(courseData.course_faq) && courseData.course_faq.length > 0
              ? courseData.course_faq.map((faq) =>
                  typeof faq === "string"
                    ? {
                        question: faq.split(" - ")[0] || "",
                        answer: faq.split(" - ")[1] || "",
                      }
                    : faq
                )
              : [],
        });
        setCategory(
          courseData.course_category
            ? {
                id: courseData.course_category.id,
                label: courseData.course_category.name,
                value: courseData.course_category.id,
              }
            : null
        );
      } catch (error) {
        toast.error("Failed to fetch course data");
      }
      setLoading(false);
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
    function getMe() {
      try {
        // Get tutor ID from Redux state
        setTutorId(user?.tutor_id || null);
      } catch (error) {
        toast.error("Failed to get user info");
      }
    }
    
    if (user) {
      getMe();
    }
  }, [user]);

  // Category/level/type data
  const {
    categoryData,
    subCategoryData,
    courseTypeData,
    levelData,
    setSubCategoryData,
  } = useCourseData({ categoryID: course.category });

  // File upload progress tracking wrapper
  const uploadWithProgress = async (file) => {
    setUploading(true);
    setUploadProgress(1);
    try {
      const url = await fileUpload(file);
      setUploading(false);
      setUploadProgress(0);
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      setUploadProgress(0);
      return "";
    }
  };
  
  // Handlers for select fields
  const handleCategoryChange = (value) => {
    setCourse((prev) => ({ ...prev, category: value }));
    setSubCategoryData(
      categoryData.find((c) => c._id === value)?.subCategory || []
    );
  };
  const handleSubCategory = (value) =>
    setCourse((prev) => ({ ...prev, subCategory: value }));
  const handleLevelChange = (value) => setCourse((prev) => ({ ...prev, level: value }));
  const handleCourseTypeChange = (value) => setCourse((prev) => ({ ...prev, course_type: value }));
  const handleCheckboxChange = (event) => setIsCertificateAvailable(event.target.checked);

  const calculateScholarPassValues = (regularPrice, discountedPrice) => {
    if (!regularPrice || !discountedPrice) return { percentage: null, amount: null };
    const amount = regularPrice - discountedPrice;
    const percentage = ((amount / regularPrice) * 100).toFixed(2);
    return {
      percentage: parseFloat(percentage),
      amount: parseFloat(amount.toFixed(2)),
    };
  };

  const handlePriceChange = (values, setFieldValue, field, value) => {
    setFieldValue(field, value);
    if (field === "regular_price" || field === "discounted_price") {
      const regularPrice = field === "regular_price" ? value : values.regular_price;
      const discountedPrice = field === "discounted_price" ? value : values.discounted_price;
      if (regularPrice && discountedPrice) {
        const { percentage, amount } = calculateScholarPassValues(regularPrice, discountedPrice);
        setFieldValue("discounted_percentage", percentage);
        setFieldValue("discounted_amount", amount);
      }
    }
  };

  // PATCH update
  const updateCourse = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Updating course...");

    // Build payload with only changed fields if needed, or send all
    const payload = {
      ...course,
      courseTags: chips,
      requirements,
      outcomes,
      courseIncludes,
      cetification: isCertificateAvailable,
      isBootcamp,
    };

    try {
      await axios.patch(`/courses/${courseId}`, payload);
      toast.success("Course updated successfully", { id: toastId });
      router.push("/lms/tutor-dashboard/course");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to update course");
    }
    setSubmitting(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadWithProgress(file);
        if (uploadedUrl) {
          setCourse({
            ...course,
            image: uploadedUrl
          });
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      ...values,
      course_faq: Array.isArray(values.course_faq)
        ? values.course_faq.map(faq =>
            typeof faq === "string"
              ? faq
              : [faq.question, faq.answer].filter(Boolean).join(" - ")
          )
        : [],
      primary_tutor: tutorId,
    };
    try {
      await axios.patch(`/courses/${courseId}`, payload);
      toast.success("Course updated successfully!");
      setSubmitting(false);
      router.push("/lms/tutor-dashboard/course");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update course. Please try again."
      );
      setSubmitting(false);
    }
  };

  const loadCategories = async (inputValue) => {
    const { data } = await axios.get("https://api.tutorsplan.com/course-categories");
    return (data?.data || []).map((cat) => ({
      ...cat,
      id: cat.id,
      label: cat.name,
      value: cat.id,
    }));
  };

  if (loading) return <Loading />;

  return (
    <div>
      <main className="grid flex-1 mt-3 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Basic Info */}
              <div className="mb-6">
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
                      Course Category <span className="text-red-500">*</span>
                    </Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadCategories}
                      value={category}
                      onChange={(option) => {
                        setCategory(option);
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

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Course Description</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="short_description">Short Description</Label>
                    <Field
                      as={Textarea}
                      id="short_description"
                      name="short_description"
                      placeholder="Short description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Full description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="course_pre_requisition">Prerequisites</Label>
                    <Field
                      as={Textarea}
                      id="course_pre_requisition"
                      name="course_pre_requisition"
                      placeholder="Prerequisites"
                    />
                  </div>
                  <div>
                    <Label htmlFor="course_outcome">Learning Outcomes</Label>
                    <Field
                      as={Textarea}
                      id="course_outcome"
                      name="course_outcome"
                      placeholder="Learning outcomes"
                    />
                  </div>
                  <div>
                    <Label>Course FAQ</Label>
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
                            onClick={() =>
                              arrayHelpers.push({ question: "", answer: "" })
                            }
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                            Add FAQ
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Course Media</h2>
                <div className="flex gap-10">
                  <div className="flex flex-col items-center justify-center">
                    {values.image ? (
                      <div className="relative">
                        <img
                          src={typeof values.image === "string" ? values.image : URL.createObjectURL(values.image)}
                          alt="Course Thumbnail"
                          className="h-32 w-48 rounded-lg object-cover border border-gray-200"
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
                            try {
                              const uploadedUrl = await uploadWithProgress(file);
                              if (uploadedUrl) {
                                setFieldValue("image", uploadedUrl);
                              }
                            } catch (error) {
                              console.error("Image upload error:", error);
                              toast.error("Failed to upload image");
                            }
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
                      {videoUploadProgress > 0 ? `Uploading ${Math.round(videoUploadProgress)}%` : "Upload Video"}
                      <input
                        id="course_trailer"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setVideoUploadProgress(1);
                            try {
                              // Track video upload progress
                              const uploadedUrl = await fileUpload(file);
                              if (uploadedUrl) {
                                setVideoUploadProgress(100);
                                setFieldValue("course_trailer", uploadedUrl);
                              }
                            } catch (error) {
                              console.error("Video upload error:", error);
                              toast.error("Failed to upload video");
                            } finally {
                              setTimeout(() => setVideoUploadProgress(0), 1500);
                            }
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
                      onChange={(e) =>
                        handlePriceChange(values, setFieldValue, "regular_price", parseFloat(e.target.value))
                      }
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
                      onChange={(e) =>
                        handlePriceChange(values, setFieldValue, "discounted_price", parseFloat(e.target.value))
                      }
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

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Course"}
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};
