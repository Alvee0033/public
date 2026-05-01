'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';

const DAYS_MAP = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const ScheduleList = ({ schedules, isLoading, onEdit, onDelete, isDeleting }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getActiveDays = (schedule) => {
    const days = [];
    Object.keys(DAYS_MAP).forEach((dayNum) => {
      const dayName = DAYS_MAP[dayNum];
      const startTimeKey = `${dayName}_start_time`;
      if (schedule[startTimeKey]) {
        days.push(dayName.charAt(0).toUpperCase() + dayName.slice(1));
      }
    });
    return days;
  };

  const getStudyHours = (schedule) => {
    const hours = schedule.number_of_work_hours_per_week || 0;
    if (hours === 0) {
      // Calculate based on individual days
      let totalHours = 0;
      Object.keys(DAYS_MAP).forEach((dayNum) => {
        const dayName = DAYS_MAP[dayNum];
        const startTimeKey = `${dayName}_start_time`;
        const endTimeKey = `${dayName}_end_time`;
        if (schedule[startTimeKey] && schedule[endTimeKey]) {
          const start = new Date(`2025-01-01 ${schedule[startTimeKey]}`);
          const end = new Date(`2025-01-01 ${schedule[endTimeKey]}`);
          totalHours += (end - start) / (1000 * 60 * 60);
        }
      });
      return totalHours;
    }
    return hours;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg font-medium">No study schedules found</p>
        <p className="text-gray-400 text-sm">Create your first study schedule to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => {
        const activeDays = getActiveDays(schedule);
        const studyHours = getStudyHours(schedule);

        return (
          <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header Section */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Schedule Period</p>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(schedule.start_date)}
                </h3>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(schedule)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit schedule"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(schedule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete schedule"
                  disabled={isDeleting === schedule.id}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="px-4 md:px-6 py-4 space-y-4">
              {/* Study Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Study Days</p>
                  <p className="text-lg font-bold text-blue-600">{activeDays.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Hours/Week</p>
                  <p className="text-lg font-bold text-green-600">{studyHours.toFixed(1)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Hours/Month</p>
                  <p className="text-lg font-bold text-purple-600">
                    {(schedule.number_of_work_hours_per_month || studyHours * 4).toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Active Days */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Study Days</p>
                <div className="flex flex-wrap gap-2">
                  {activeDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time Details */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Daily Study Schedule</p>
                {Object.keys(DAYS_MAP).map((dayNum) => {
                  const dayName = DAYS_MAP[dayNum];
                  const startTimeKey = `${dayName}_start_time`;
                  const endTimeKey = `${dayName}_end_time`;
                  const locationKey = `${dayName}_onsite_or_remote`;

                  if (!schedule[startTimeKey]) return null;

                  return (
                    <div
                      key={dayName}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <span className="font-medium text-gray-700 capitalize">{dayName}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Clock size={16} />
                          {schedule[startTimeKey]} - {schedule[endTimeKey]}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            schedule[locationKey]
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          <MapPin size={14} />
                          {schedule[locationKey] ? 'In-Person' : 'Online'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm === schedule.id && (
              <div className="px-4 md:px-6 py-4 bg-red-50 border-t border-red-200 flex items-center justify-between">
                <p className="text-sm text-red-700">Are you sure you want to delete this schedule?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete(schedule.id);
                      setDeleteConfirm(null);
                    }}
                    disabled={isDeleting === schedule.id}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting === schedule.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleList;
