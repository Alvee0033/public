"use client";

import { useEffect } from "react";
import {
  fetchEnrolledCoursesExpandedForm,
  ScheduleProvider,
  StudentTutoringSessionsProvider,
  useSchedule,
  useSchedule as useScheduleContext,
  useStudentTutoringSessions, // Add this import
} from "../_context/ScheduleContext";
import { allEvents, getYearlyStats } from "../data/sample-data";
import { ActivitySidebar } from "./activity-sidebar";
import { CalendarView } from "./calendar-view";
import { LearningTeamWidget } from "./learning-team-widget";
import { MyTutorsWidget } from "./my-tutors-widget";
import { StudentProfileHeader } from "./student-profile-header";

export default function ScheduleDashboard() {
  return (
    <ScheduleProvider>
      <StudentTutoringSessionsProvider>
        <ScheduleDashboardContent />
      </StudentTutoringSessionsProvider>
    </ScheduleProvider>
  );
}

function ScheduleDashboardContent() {
  const currentYear = new Date().getFullYear();
  const yearlyStats = getYearlyStats(currentYear);
  const { selectedTab, setSelectedTab } = useSchedule();
  const { studentId } = useScheduleContext();
  const { fetchSessions } = useStudentTutoringSessions(); // Add this line

  // Log enrolled courses on mount or when studentId changes
  useEffect(() => {
    if (!studentId) return;
    fetchEnrolledCoursesExpandedForm(studentId).then((courses) => {
      console.log("Enrolled Courses Expanded Form:", courses);
    });
  }, [studentId]);

  // Add this effect to ensure tutoring tab is selected and data is loaded
  useEffect(() => {
    // Force tab selection
    setSelectedTab("tutoring");

    // Force data fetch with a delay to ensure localStorage is available
    const timer = setTimeout(() => {
      console.log(
        "ScheduleDashboard mounted - forcing tutoring sessions fetch"
      );
      fetchSessions();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchSessions]); // Add fetchSessions as a dependency

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StudentProfileHeader />
      <div className="flex flex-col flex-1 md:flex-row">
        <ActivitySidebar
          events={allEvents}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <CalendarView events={allEvents} yearlyStats={yearlyStats} />
          {/* <div className="bg-gray-50 border-t border-gray-200 p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-7xl mx-auto">
                            <MyTutorsWidget />
                            <LearningTeamWidget />
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
}
