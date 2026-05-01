"use client";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamQuestionsPage() {
  const params = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/exams/${params.examId}`);
        setExam(response.data?.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || err?.message || "Failed to load exam"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]);

  if (loading) {
    return <div>Loading exam questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exam) {
    return <div>No exam found</div>;
  }

  return (
    <div>
      <h1>{exam.title}</h1>
      <p>Questions will be implemented here</p>
    </div>
  );
}
