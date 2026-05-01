"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PreTestPage({ params }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to start page
    router.push(`/lms/student-dashboard/course-player/${params.courseId}/pre-test/start`);
  }, [params.courseId, router]);

  return null;
}

