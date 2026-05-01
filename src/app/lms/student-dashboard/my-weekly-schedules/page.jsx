import React from 'react';
import ScheduleContainer from './_components/ScheduleContainer';

/**
 * Server-side component for Student Weekly Work Schedules page
 * Renders the client-side ScheduleContainer
 */
const StudentWeeklySchedulesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <ScheduleContainer />
      </div>
    </div>
  );
};

export default StudentWeeklySchedulesPage;
