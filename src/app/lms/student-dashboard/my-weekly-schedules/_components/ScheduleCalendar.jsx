'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { getDaysInMonth, addMonths, subMonths, startOfMonth } from 'date-fns';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_MAP = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const ScheduleCalendar = ({ schedules, onDateSelect, selectedDate, onEditSchedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Debug log
  React.useEffect(() => {
    console.log('Calendar - Schedules received:', schedules);
    console.log('Calendar - Current viewing month:', currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
  }, [schedules, currentDate]);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth.getDay() }, (_, i) => i);

  const getScheduleForDate = (day) => {
    if (!schedules || schedules.length === 0) return null;
    
    const currentCalendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    currentCalendarDate.setHours(0, 0, 0, 0);
    
    // Check if this calendar date matches any schedule's start_date
    const found = schedules.find(schedule => {
      const startDate = new Date(schedule.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      // Display the schedule on its start_date
      const isStartDate = currentCalendarDate.getTime() === startDate.getTime();
      
      if (isStartDate) {
        console.log(`Day ${day} matches start_date:`, {
          calendarDate: currentCalendarDate.toDateString(),
          scheduleStartDate: startDate.toDateString(),
        });
      }
      
      return isStartDate;
    });
    
    return found;
  };

  const hasScheduleForDay = (day) => {
    const schedule = getScheduleForDate(day);
    if (!schedule) return false;

    // Check if this schedule has any study hours for any day of the week
    const DAYS_ARRAY = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return DAYS_ARRAY.some(dayName => schedule[`${dayName}_start_time`] != null);
  };

  const getScheduleDetails = (day) => {
    const schedule = getScheduleForDate(day);
    if (!schedule) return null;

    // Find the first day of the week that has study hours
    const DAYS_ARRAY = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const firstStudyDay = DAYS_ARRAY.find(dayName => schedule[`${dayName}_start_time`] != null);
    
    if (!firstStudyDay) return null;

    const startTimeKey = `${firstStudyDay}_start_time`;
    const endTimeKey = `${firstStudyDay}_end_time`;
    const locationKey = `${firstStudyDay}_onsite_or_remote`;

    const startTime = schedule[startTimeKey];
    const endTime = schedule[endTimeKey];

    // Format time to HH:MM (remove seconds if present)
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      return timeStr.substring(0, 5);
    };

    return {
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      isOnsite: schedule[locationKey],
      dayName: firstStudyDay.charAt(0).toUpperCase() + firstStudyDay.slice(1),
      schedule,
    };
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateSelect?.(date);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-0 px-4 md:px-6 py-3 border-b border-gray-200">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-600 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of month */}
          {days.map((day) => {
            const hasSchedule = hasScheduleForDay(day);
            const scheduleDetails = getScheduleDetails(day);
            const today = isToday(day);
            const selected = isSelected(day);

            return (
              <div key={day} className="relative group">
                <button
                  onClick={() => handleDateClick(day)}
                  className={`w-full aspect-square p-2 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-xs md:text-sm cursor-pointer relative
                    ${selected
                      ? 'border-blue-500 bg-blue-50'
                      : today
                      ? 'border-green-500 bg-green-50'
                      : hasSchedule
                      ? 'border-purple-300 bg-purple-50 hover:border-purple-400'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <span className={`font-semibold ${selected ? 'text-blue-600' : today ? 'text-green-600' : hasSchedule ? 'text-purple-600' : 'text-gray-700'}`}>
                    {day}
                  </span>

                  {/* Schedule indicator dot */}
                  {hasSchedule && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  )}

                  {/* Show time on the date cell if there's a schedule */}
                  {scheduleDetails && (
                    <span className="text-xs text-gray-600 mt-1 leading-tight">
                      {scheduleDetails.startTime.substring(0, 5)}
                    </span>
                  )}
                </button>

                {/* Tooltip on hover - positioned to avoid overflow */}
                {scheduleDetails && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                       style={{
                         bottom: '100%',
                         marginBottom: '8px',
                       }}
                  >
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-3 w-56 shadow-lg">
                      <div className="flex items-start gap-2 mb-1">
                        <Clock size={14} className="flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="font-semibold">{scheduleDetails.dayName}</span>
                          <span className="font-medium">{scheduleDetails.startTime} - {scheduleDetails.endTime}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{scheduleDetails.isOnsite ? 'In-Person' : 'Online'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 bg-green-50 rounded" />
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-purple-300 bg-purple-50 rounded" />
            <span className="text-gray-600">Has Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-200 bg-white rounded" />
            <span className="text-gray-600">No Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
