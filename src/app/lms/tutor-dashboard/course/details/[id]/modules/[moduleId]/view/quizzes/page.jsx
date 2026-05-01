"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ModuleQuizzesViewPage() {
  const { id, moduleId } = useParams();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await axios.get(`/quizs?limit=10000`);
        const allQuizzes = res.data.data || [];
        const filtered = allQuizzes.filter(q => String(q.course_module) === String(moduleId) || String(q.course_module_id) === String(moduleId));
        setQuizzes(filtered);
        if (filtered.length > 0) setSelectedQuizId(filtered[0].id);
      } catch (error) {
        setQuizzes([]);
      }
      setLoading(false);
    }
    if (moduleId) fetchQuizzes();
  }, [moduleId]);

  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quizzes for Module #{moduleId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold mr-2">Select Quiz:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedQuizId || ''}
                onChange={e => setSelectedQuizId(Number(e.target.value))}
              >
                {quizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>{quiz.name || quiz.title}</option>
                ))}
              </select>
            </div>
            <Button onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/modules/${moduleId}/add-quiz`)}>
              Add Quiz
            </Button>
          </div>
          {loading ? (
            <div>Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div>No quizzes found for this module.</div>
          ) : selectedQuiz ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="font-bold text-lg mb-2">{selectedQuiz.name || selectedQuiz.title}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {selectedQuiz.description}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Points:</span> {selectedQuiz.points}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Created At:</span> {new Date(selectedQuiz.created_at).toLocaleString()}</div>
              {/* You can add more quiz details here as needed */}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
