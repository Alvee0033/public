"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ModuleViewPage() {
  const { id, moduleId } = useParams();
  const router = useRouter();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await axios.get(`/course-modules/${moduleId}`);
        setModule(res.data.data);
      } catch (error) {
        setModule(null);
      }
      setLoading(false);
    }
    if (moduleId) fetchModule();
  }, [moduleId]);

  if (loading) {
    return <main className="p-4 max-w-4xl mx-auto">Loading module details...</main>;
  }
  if (!module) {
    return <main className="p-4 max-w-4xl mx-auto">Module not found.</main>;
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Module: {module.title}</CardTitle>
          <div className="text-gray-500 text-sm">Course: {module.course?.name || module.course_id}</div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Badge variant={module.module_content_approved ? "success" : "destructive"}>
              {module.module_content_approved ? "Approved" : "Pending"}
            </Badge>
          </div>
          <div className="mb-2 text-lg font-semibold">Short Description</div>
          <div className="mb-4 text-gray-700">{module.short_description}</div>
          <div className="mb-2 text-lg font-semibold">Description</div>
          <div className="mb-4 text-gray-700">{module.description}</div>
          <div className="mb-2 text-lg font-semibold">Duration</div>
          <div className="mb-4 text-gray-700">{module.duration}</div>
          {/* <div className="mb-2 text-lg font-semibold">Number of Lessons</div>
          <div className="mb-4 text-gray-700">{module.number_of_lessons}</div> */}
          {/* <div className="mb-2 text-lg font-semibold">Guideline for Instructor</div>
          <div className="mb-4 text-gray-700">{module.guidelinefor_instructor || module.guideline_for_instructor || "-"}</div> */}
          <div className="mb-2 text-lg font-semibold">Created At</div>
          <div className="mb-4 text-gray-700">{new Date(module.created_at).toLocaleString()}</div>
          <div className="mb-2 text-lg font-semibold flex items-center justify-between">
            {/* <span>Lessons</span> */}
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-blue-900 to-blue-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                size="sm"
                onClick={() => router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/view/lessons`)}
              >
                View Lessons
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                size="sm"
                onClick={() => router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/view/quizzes`)}
              >
                View Quizzes
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                size="sm"
                onClick={() => router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/view/assignments`)}
              >
                View Assignments
              </Button>
            </div>
          </div>
          {/* <ul className="mb-4 list-disc pl-6">
            {Array.isArray(module.course_lessons) && module.course_lessons.length > 0 ? (
              module.course_lessons.map(lesson => (
                <li key={lesson.id} className="mb-2">
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-sm text-gray-600">{lesson.summary}</div>
                  <div className="text-xs text-gray-400">Created: {new Date(lesson.created_at).toLocaleDateString()}</div>
                </li>
              ))
            ) : (
              <li>No lessons found for this module.</li>
            )}
          </ul> */}
        </CardContent>
      </Card>
    </main>
  );
}

