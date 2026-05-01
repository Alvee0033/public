"use client";
import { useState, useEffect } from "react";
import TutorDashboardClient from "./TutorDashboardClient";
import DashboardStats from "./_components/DashboardStats";
import DashboardWidgetDatas from "./_components/DashboardWidgetDatas";
import TutorNameServer from "./_components/TutorNameServer";
import ScheduleContainer from "./weekly-work-schedules/_components/ScheduleContainer";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function TutorDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate async data fetching (or check when child data is ready)
    const timer = setTimeout(() => setLoading(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-4 rounded-lg p-6 bg-white shadow-md">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-purple-900">
          <TutorNameServer>stats</TutorNameServer>
        </h1>
        <DashboardStats />
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          <TutorNameServer>scheduler</TutorNameServer>
        </h1>
        <TutorDashboardClient />
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md w-full">
        <DashboardWidgetDatas />
      </div>
      <div className="text-xs text-gray-500 mt-6 border-t pt-4">
        <ScheduleContainer />
      </div>
    </div>
  );
}
