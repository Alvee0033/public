"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirecting plural /learninghubs to singular /learninghub to resolve 
 * route confusion and unify the user experience.
 */
export default function LearningHubsPluralRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learninghub");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
         <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--sp-purple)] border-t-transparent" />
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Router...</p>
      </div>
    </div>
  );
}
