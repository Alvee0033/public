"use client";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import axios from "@/lib/axios";
import { fileUpload } from "@/lib/fileUpload";
const AddLesson = () => {
  const [videoFile, setVideoFile] = React.useState(null);
  const [attachments, setAttachments] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const { id: courseId, moduleId } = useParams();
  const [form, setForm] = React.useState({
    title: "",
    summary: "",
    short_description: "",
    description: "",
    duration: "",
    is_active: false,
    guideline_for_instructor: "",
    lesson_content_approved: false,
    number_of_lessons: "",
    save_as_template: false,
    course_lesson_type: "",
    course_lesson_type_id: "",
    primary_tutor: "",
    primary_tutor_id: "",
    course: courseId || "",
    course_id: courseId || "",
    course_module: moduleId || "",
    course_module_id: moduleId || "",
    master_video_library_id: "",
    master_book_library_id: "",
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleAttachmentsChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value === "" ? null : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    const submitLesson = async () => {
      try {
        let master_video_library_id = "";
        let master_book_library_id = "";

        // Upload video file if present
        if (videoFile) {
          const videoResult = await fileUpload(videoFile);
          // Use only the id property if available
          if (videoResult && typeof videoResult === 'object' && videoResult.id) {
            master_video_library_id = videoResult.id;
          } else {
            master_video_library_id = "";
          }
        }

        // Upload first attachment as book file if present
        if (attachments.length > 0) {
          const bookResult = await fileUpload(attachments[0]);
          master_book_library_id = bookResult?.id || bookResult || "";
        }

        const payload = {
          ...form,
          master_video_library_id,
          master_book_library_id
        };
        // Remove null/empty values
        Object.keys(payload).forEach(key => {
          if (payload[key] === null || payload[key] === "") {
            delete payload[key];
          }
        });
        const res = await axios.post("/course-lessons", payload);
        alert("Lesson created successfully!");
      } catch (err) {
        alert("Failed to create lesson");
      } finally {
        setUploading(false);
      }
    };
    submitLesson();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border border-blue-100 backdrop-blur">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Lesson to Module #{moduleId} of Course #{courseId}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="bg-blue-50/40 rounded-xl p-6 shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input name="title" required value={form.title || ""} onChange={handleChange} placeholder=" " className="peer w-full border-b-2 border-blue-200 bg-transparent px-2 py-3 focus:outline-none focus:border-blue-500 rounded-t-md" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.title ? 'top-[-0.8rem] text-xs text-blue-600 bg-white px-1' : 'top-2 peer-focus:text-blue-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Title<span className="text-red-500">*</span></label>
                </div>
                <div className="relative">
                  <input name="summary" value={form.summary || ""} onChange={handleChange} placeholder=" " className="peer w-full border-b-2 border-blue-200 bg-transparent px-2 py-3 focus:outline-none focus:border-blue-500 rounded-t-md" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.summary ? 'top-[-0.8rem] text-xs text-blue-600 bg-white px-1' : 'top-2 peer-focus:text-blue-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Summary</label>
                </div>
                <div className="relative">
                  <input name="short_description" value={form.short_description || ""} onChange={handleChange} placeholder=" " className="peer w-full border-b-2 border-blue-200 bg-transparent px-2 py-3 focus:outline-none focus:border-blue-500 rounded-t-md" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.short_description ? 'top-[-0.8rem] text-xs text-blue-600 bg-white px-1' : 'top-2 peer-focus:text-blue-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Short Description</label>
                </div>
                <div className="relative col-span-2">
                  <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder=" " rows={3} className="peer w-full border-b-2 border-blue-200 bg-transparent px-2 py-3 focus:outline-none focus:border-blue-500 rounded-t-md resize-none" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.description ? 'top-[-0.8rem] text-xs text-blue-600 bg-white px-1' : 'top-2 peer-focus:text-blue-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Description</label>
                </div>
              </div>
            </div>
            {/* Lesson Settings Section */}
            <div className="bg-purple-50/40 rounded-xl p-6 shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-600 mb-4">Lesson Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input name="duration" value={form.duration || ""} onChange={handleChange} placeholder=" " className="peer w-full border-b-2 border-purple-200 bg-transparent px-2 py-3 focus:outline-none focus:border-purple-500 rounded-t-md" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.duration ? 'top-[-0.8rem] text-xs text-purple-600 bg-white px-1' : 'top-2 peer-focus:text-purple-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Duration</label>
                </div>
                <div className="relative col-span-2">
                  <input name="guideline_for_instructor" value={form.guideline_for_instructor || ""} onChange={handleChange} placeholder=" " className="peer w-full border-b-2 border-purple-200 bg-transparent px-2 py-3 focus:outline-none focus:border-purple-500 rounded-t-md" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.guideline_for_instructor ? 'top-[-0.8rem] text-xs text-purple-600 bg-white px-1' : 'top-2 peer-focus:text-purple-600 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Guideline for Instructor</label>
                </div>
              </div>
            </div>
            
            {/* Lesson Contents Section */}
            <div className="bg-purple-50/40 rounded-xl p-6 shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-600 mb-4">Lesson Contents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative col-span-2">
                  <label className="block mb-2 text-gray-700 font-medium">Upload Lesson Video</label>
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                  {videoFile && (
                    <video src={URL.createObjectURL(videoFile)} controls className="mt-4 w-full rounded-lg border border-purple-200 shadow" style={{maxHeight: 220}} />
                  )}
                </div>
                <div className="relative col-span-2 mt-6">
                  <label className="block mb-2 text-gray-700 font-medium">Upload Lesson Books</label>
                  <input type="file" multiple onChange={handleAttachmentsChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                  {attachments.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                      {attachments.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* Course & Module Info Section */}
            <div className="bg-gray-50/60 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Course & Module Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input name="course" required value={form.course || ""} onChange={handleChange} readOnly className="peer w-full border-b-2 border-gray-200 bg-gray-100 px-2 py-3 rounded-t-md text-gray-500" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.course ? 'top-[-0.8rem] text-xs text-gray-700 bg-white px-1' : 'top-2 peer-focus:text-gray-700 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Course<span className="text-red-500">*</span></label>
                </div>
                <div className="relative">
                  <input name="course_id" required value={form.course_id || ""} onChange={handleChange} readOnly className="peer w-full border-b-2 border-gray-200 bg-gray-100 px-2 py-3 rounded-t-md text-gray-500" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.course_id ? 'top-[-0.8rem] text-xs text-gray-700 bg-white px-1' : 'top-2 peer-focus:text-gray-700 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Course ID<span className="text-red-500">*</span></label>
                </div>
                <div className="relative">
                  <input name="course_module" required value={form.course_module || ""} onChange={handleChange} readOnly className="peer w-full border-b-2 border-gray-200 bg-gray-100 px-2 py-3 rounded-t-md text-gray-500" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.course_module ? 'top-[-0.8rem] text-xs text-gray-700 bg-white px-1' : 'top-2 peer-focus:text-gray-700 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Course Module<span className="text-red-500">*</span></label>
                </div>
                <div className="relative">
                  <input name="course_module_id" required value={form.course_module_id || ""} onChange={handleChange} readOnly className="peer w-full border-b-2 border-gray-200 bg-gray-100 px-2 py-3 rounded-t-md text-gray-500" />
                  <label className={`absolute left-2 text-gray-500 text-sm transition-all duration-200 pointer-events-none ${form.course_module_id ? 'top-[-0.8rem] text-xs text-gray-700 bg-white px-1' : 'top-2 peer-focus:text-gray-700 peer-focus:top-[-0.8rem] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1'}`}>Course Module ID<span className="text-red-500">*</span></label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button type="submit" disabled={uploading} className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                {uploading ? 'Uploading...' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
export default AddLesson;
