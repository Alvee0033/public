"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ModuleLessonsViewPage() {
  const { id, moduleId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await axios.get(`/course-lessons?limit=10000`);
        const allLessons = res.data.data || [];
        const filtered = allLessons.filter(l => String(l.course_module_id) === String(moduleId));
        setLessons(filtered);
        if (filtered.length > 0) setSelectedLessonId(filtered[0].id);
      } catch (error) {
        setLessons([]);
      }
      setLoading(false);
    }
    if (moduleId) fetchLessons();
  }, [moduleId]);

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Lessons for Module #{moduleId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold mr-2">Select Lesson:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedLessonId || ''}
                onChange={e => setSelectedLessonId(Number(e.target.value))}
              >
                {lessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
            <Button onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/modules/${moduleId}/add-lesson`)}>
              Add Lesson
            </Button>
          </div>
          {loading ? (
            <div>Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div>No lessons found for this module.</div>
          ) : selectedLesson ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="font-bold text-lg mb-2">{selectedLesson.title}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Summary:</span> {selectedLesson.summary}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Short Description:</span> {selectedLesson.short_description}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> <span dangerouslySetInnerHTML={{ __html: selectedLesson.description }} /></div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Duration:</span> {selectedLesson.duration}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Guideline for Instructor:</span> {selectedLesson.guideline_for_instructor}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Approved:</span> {selectedLesson.lesson_content_approved ? "Yes" : "No"}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Created At:</span> {new Date(selectedLesson.created_at).toLocaleString()}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
