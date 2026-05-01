"use client";
import { getDashboardRoute } from "@/lib/dashboard-route";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LmsIndex() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    let resolvedUser = user;

    if (!resolvedUser && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("user");
        resolvedUser = raw ? JSON.parse(raw) : null;
      } catch {}
    }

    if (!resolvedUser) {
      router.replace("/login");
      return;
    }

    router.replace(getDashboardRoute(resolvedUser));
  }, [user, router]);

  return null;
}
