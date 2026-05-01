"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import PreTestPageContent from "./(c)/pre-test-page-content";

export default function PreTestStartPage({ params }) {
  return (
    <ErrorBoundary>
      <PreTestPageContent params={params} />
    </ErrorBoundary>
  );
}
