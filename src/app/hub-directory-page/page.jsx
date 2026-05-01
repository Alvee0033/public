"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirecting legacy /hub-directory-page to /learninghub to ensure
 * users always see the new stunning discovery experience.
 */
export default function HubDirectoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learninghub");
  }, [router]);

  return null;
}
