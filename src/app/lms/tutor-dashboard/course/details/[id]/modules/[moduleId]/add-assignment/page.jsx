"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fileUpload } from "@/lib/fileUpload";
import { useFormik } from "formik";

const AddAssignment = () => {
  const { id, moduleId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      guideline_for_instructor: "",
      save_as_template: false,
      submissions_deadline: "",
      points: 0,
      attachment: "",
      course: id ? Number(id) : 0,
      course_module: moduleId ? Number(moduleId) : 0,
      course_lesson: 0,
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "Required";
      if (!values.description) errors.description = "Required";
      if (values.points < 0) errors.points = "Must be 0 or higher";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        // Build payload according to /course-assignments swagger
        const payload = {
          title: values.title,
          description: values.description,
          course_points: Number(values.points),
          guideline_for_instructor: values.guideline_for_instructor,
          assignment_content_approved: false,
          save_as_template: Boolean(values.save_as_template),
          submissions_deadline: values.submissions_deadline,
          points: Number(values.points),
          attachment: values.attachment,
          course: Number(values.course) || (id ? Number(id) : 0),
          course_module:
            Number(values.course_module) || (moduleId ? Number(moduleId) : 0),
          course_lesson: Number(values.course_lesson) || null,
          approved_by_employee: null,
        };

        await axios.post(`/course-assignments`, payload);
        setSuccess("Assignment created successfully.");
        resetForm();
      } catch (err) {
        console.error(err);
        setError("Failed to create assignment. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ensure course_module stays in sync if moduleId changes
  useEffect(() => {
    if (moduleId) formik.setFieldValue("course_module", Number(moduleId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="p-0 overflow-hidden rounded-t-lg">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-6 py-4 text-center">
            <CardTitle className="text-white">
              Add Assignment to Module
            </CardTitle>
            <div className="text-pink-100 text-sm mt-1">
              Create an assignment students can submit for this module.
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Title
              </label>
              <input
                name="title"
                type="text"
                placeholder="Assignment title"
                className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-200"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.title}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the assignment and expectations"
                className="w-full min-h-[120px] rounded-lg border border-transparent bg-white px-4 py-3 shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-200 resize-none"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.description}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Guideline for instructor
                </label>
                <input
                  name="guideline_for_instructor"
                  type="text"
                  placeholder="Private notes for graders/instructors"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200"
                  value={formik.values.guideline_for_instructor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Submissions deadline
                </label>
                <input
                  name="submissions_deadline"
                  type="datetime-local"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  value={formik.values.submissions_deadline}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Points
                </label>
                <input
                  name="points"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  value={formik.values.points}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.points && formik.errors.points && (
                  <div className="mt-1 text-sm text-red-600">
                    {formik.errors.points}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Attachment (file)
                </label>
                <input
                  name="attachment_file"
                  type="file"
                  accept="image/*,video/*,audio/*,application/pdf,application/*"
                  className="w-full rounded-lg border border-transparent bg-white px-2 py-2 shadow-sm focus:outline-none"
                  onChange={async (e) => {
                    const file =
                      e.currentTarget.files && e.currentTarget.files[0];
                    if (!file) return;
                    try {
                      setUploading(true);
                      setError("");
                      // upload via helper, returns URL
                      const url = await fileUpload(file);
                      if (url) {
                        formik.setFieldValue("attachment", url);
                        setUploadedName(file.name || "uploaded-file");
                      }
                    } catch (uploadErr) {
                      console.error("Upload failed", uploadErr);
                      setError(uploadErr.message || "Upload failed");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />

                {uploading && (
                  <div className="mt-2 text-sm text-gray-600">Uploading...</div>
                )}
                {!uploading && formik.values.attachment && (
                  <div className="mt-2 flex items-center justify-between gap-4 bg-gray-50 p-2 rounded">
                    <div className="text-sm text-gray-700">
                      {uploadedName || formik.values.attachment}
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => {
                        formik.setFieldValue("attachment", "");
                        setUploadedName("");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-3 bg-gradient-to-r from-white/60 to-indigo-50 p-3 rounded-lg border border-indigo-50 w-full">
                <input
                  id="save_as_template"
                  name="save_as_template"
                  type="checkbox"
                  checked={formik.values.save_as_template}
                  onChange={(e) =>
                    formik.setFieldValue("save_as_template", e.target.checked)
                  }
                  className="h-5 w-5 text-pink-500 rounded focus:ring-pink-200"
                />
                <div>
                  <label
                    htmlFor="save_as_template"
                    className="font-medium text-gray-700"
                  >
                    Save as template
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-100 p-3 text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3 text-emerald-700">
                  {success}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white"
              >
                <span className="px-4">
                  {loading ? "Creating..." : "Create Assignment"}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AddAssignment;
