"use client";

import { useEffect } from "react";
import {
  useSchedule,
  useSchedule as useScheduleContext,
} from "./_context/ScheduleContext";
import { ActivitySidebar } from "./_components/activity-sidebar";
import { CalendarView } from "./_components/calendar-view";
import { StudentProfileHeader } from "./_components/student-profile-header";

export default function ScheduleWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <h2 className="sr-only">
        Schedule Dashboard - Manage your tutoring sessions and activities
      </h2>
      <div className="p-0">
        <ScheduleDashboardContent />
      </div>
    </div>
  );
}

function ScheduleDashboardContent() {
  const { selectedTab, setSelectedTab } = useSchedule();
  const { studentId } = useScheduleContext();

  useEffect(() => {
    if (studentId && selectedTab !== "tutoring") {
      setSelectedTab("tutoring");
    }
  }, [selectedTab, setSelectedTab, studentId]);

  return (
    <div className="flex flex-col bg-gray-50">
      <StudentProfileHeader />
      <div className="flex flex-col flex-1 md:flex-row">
        <ActivitySidebar
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
