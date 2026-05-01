'use client';

import { useEffect } from 'react';
import ScheduleDashboard from '../dashboard/_components/ScheduleDashboard';
import { useStudentTutoringSessions } from '../dashboard/_context/ScheduleContext';

export default function MySchedulesPage() {
  const { fetchSessions, sessions } = useStudentTutoringSessions();

  useEffect(() => {
    // Fetch sessions as soon as the page loads
    console.log('MySchedules page loaded - fetching tutoring sessions');

    // Allow a small delay for context initialization
    const timer = setTimeout(() => {
      fetchSessions();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchSessions]);

  return (
    <div className="mt-4">
      <ScheduleDashboard />
    </div>
  );
}
