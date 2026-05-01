"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useAppSelector } from "@/redux/hooks";

const AddModule = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tutorId, setTutorId] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  const formik = useFormik({
    initialValues: {
      title: "",
      short_description: "",
      description: "",
      duration: "",
      number_of_lessons: 0,
      save_as_template: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "Required";
      if (!values.short_description) errors.short_description = "Required";
      if (!values.description) errors.description = "Required";
      if (!values.duration) errors.duration = "Required";
      if (values.number_of_lessons === "" || values.number_of_lessons < 0) errors.number_of_lessons = "Must be 0 or higher";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        // Build payload according to /course-modules swagger
        const payload = {
          title: values.title,
          short_description: values.short_description,
          description: values.description,
          duration: values.duration,
          module_content_approved: false, // default
          guidelinefor_instructor: "",
          number_of_lessons: Number(values.number_of_lessons),
          save_as_template: Boolean(values.save_as_template),
          course: Number(id),
          tutor: 0,
          institute: null,
          approved_by_employee: null,
        };

  // ensure tutor id is present
  payload.tutor = Number(tutorId) || 0;

  await axios.post(`/course-modules`, payload);
        setSuccess("Module added successfully!");
        resetForm();
        // Optionally navigate back or refresh
        // router.push(`/lms/tutor-dashboard/course/details/${id}`);
      } catch (err) {
        setError("Failed to add module. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    let mounted = true;
    const getTutorId = () => {
      setLoadingMe(true);
      try {
        // Get tutor ID from Redux state
        const tid = user?.tutor_id;
        if (mounted) setTutorId(tid);
      } catch (err) {
        console.error("Failed to get tutor ID from user data", err);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    };

    if (user) {
      getTutorId();
    } else {
      setLoadingMe(false);
    }
    return () => (mounted = false);
  }, [user]);

  return (
    <main className="p-4 max-w-xl mx-auto">
      <Card>
        <CardHeader className="p-0 overflow-hidden rounded-t-lg">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-center">
            <CardTitle className="text-white">Add Module to Course</CardTitle>
            <div className="text-indigo-100 text-sm mt-1">Create a new module and attach it to this course.</div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="Module title"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 placeholder:text-gray-400"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && <div className="mt-1 text-sm text-red-600">{formik.errors.title}</div>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                <input
                  name="short_description"
                  type="text"
                  placeholder="One-line summary"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 placeholder:text-gray-400"
                  value={formik.values.short_description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.short_description && formik.errors.short_description && <div className="mt-1 text-sm text-red-600">{formik.errors.short_description}</div>}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
              <textarea
                name="description"
                placeholder="Full module description and learning goals"
                className="w-full min-h-[120px] rounded-lg border border-transparent bg-white px-4 py-3 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 resize-none"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
              />
              {formik.touched.description && formik.errors.description && <div className="mt-1 text-sm text-red-600">{formik.errors.description}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <input
                  name="duration"
                  type="text"
                  placeholder="e.g. 3 weeks, 5 hours"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 placeholder:text-gray-400"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.duration && formik.errors.duration && <div className="mt-1 text-sm text-red-600">{formik.errors.duration}</div>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Number of Lessons</label>
                <input
                  name="number_of_lessons"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 placeholder:text-gray-400"
                  value={formik.values.number_of_lessons}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.number_of_lessons && formik.errors.number_of_lessons && <div className="mt-1 text-sm text-red-600">{formik.errors.number_of_lessons}</div>}
              </div>

              <div className="flex items-center md:justify-center">
                <div className="flex items-center gap-3 bg-gradient-to-r from-white/60 to-purple-50 p-3 rounded-lg border border-indigo-50">
                  <input
                    id="save_as_template"
                    name="save_as_template"
                    type="checkbox"
                    checked={formik.values.save_as_template}
                    onChange={(e) => formik.setFieldValue('save_as_template', e.target.checked)}
                    className="h-5 w-5 text-pink-500 rounded focus:ring-pink-200"
                  />
                  <div>
                    <label htmlFor="save_as_template" className="font-medium text-gray-700">Save as template</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {loadingMe && <div className="text-sm text-gray-600">Loading user...</div>}
              {!loadingMe && tutorId == null && <div className="text-sm text-yellow-700">Unable to determine tutor id — submission will include tutor: 0</div>}
              {error && <div className="rounded-md bg-gradient-to-r from-red-50 to-red-25 border border-red-100 p-3 text-red-700">{error}</div>}
              {success && <div className="rounded-md bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 p-3 text-emerald-700">{success}</div>}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={loading || formik.isSubmitting || loadingMe}
                className="bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white shadow-lg"
              >
                <span className="px-4">{loading ? "Adding..." : "Add Module"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AddModule;
