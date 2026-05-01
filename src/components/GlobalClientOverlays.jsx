"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), {
  ssr: false,
});
const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

export default function GlobalClientOverlays() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), {
        timeout: 1000,
      });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!ready) return null;

  return (
    <>
      <NextTopLoader color="#F59E0B" showSpinner={false} />
      <Toaster />
    </>
  );
}
