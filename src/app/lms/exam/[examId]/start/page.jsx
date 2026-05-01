"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ExamPageContent from "./(c)/exam-page-content";

export default function ExamPage({ params }) {
  return (
    <ErrorBoundary>
      <ExamPageContent params={params} />
    </ErrorBoundary>
  );
}
