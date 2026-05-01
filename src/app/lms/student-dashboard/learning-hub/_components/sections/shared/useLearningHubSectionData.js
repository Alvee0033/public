"use client";

import useSWR from "swr";
import { instance } from "@/lib/axios";

export function useLearningHubSectionData(slug) {
  const endpoint =
    slug === "overview"
      ? "/learning-hub/student/overview"
      : `/learning-hub/student/sections/${slug}`;

  const { data, isLoading, error } = useSWR(["learning-hub-section", slug], async () => {
    try {
      const res = await instance.get(endpoint);
      return res?.data ?? {};
    } catch {
      return {
        title: "",
        summary: { stats: [] },
        items: [],
        pagination: { page: 1, limit: 0, count: 0 },
        lastUpdated: new Date().toISOString(),
      };
    }
  });

  return {
    data,
    isLoading,
    error,
    summary: data?.summary ?? { stats: [] },
    items: Array.isArray(data?.items) ? data.items : [],
  };
}

