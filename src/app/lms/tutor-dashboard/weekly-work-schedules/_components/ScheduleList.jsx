'use client';

import React, { useState, useEffect } from 'react';
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

const ScheduleList = ({
  schedules,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  heightClass = 'h-80',
  // number of items to show in the scroll viewport
  itemsToShow = 2,
  // height in pixels for each item (used to calculate container height)
  itemHeight = 220,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // close modal on Escape
  useEffect(() => {
    if (!deleteConfirm) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setDeleteConfirm(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteConfirm]);

  // If itemsToShow is provided, compute inline style to make the scroll
  // container exactly itemsToShow * itemHeight tall. Keeps the list
  // compact and scrollable.
  const containerStyle = itemsToShow ? { height: `calc(${itemHeight}px * ${itemsToShow})` } : undefined;

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

  const getWorkHours = (schedule) => {
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
        <div className={`${heightClass} overflow-y-auto space-y-3 pr-2`} style={containerStyle}>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-[200px] bg-gray-100 rounded-xl p-4 animate-pulse flex flex-col justify-center"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="space-y-4">
        <div className={`${heightClass} overflow-y-auto flex items-center justify-center p-6`} style={containerStyle}>
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-base font-medium">No schedules yet</p>
            <p className="text-gray-400 text-sm">Create a schedule to appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-4">
      <div className={`${heightClass} overflow-y-auto space-y-4 pr-2`} style={containerStyle}>
        {schedules.map((schedule) => {
        const activeDays = getActiveDays(schedule);
        const workHours = getWorkHours(schedule);

        return (
          <div
            key={schedule.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow border border-gray-200"
            style={{ minHeight: `${itemHeight}px` }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Schedule</p>
                <h3 className="text-sm font-semibold text-gray-900">{formatDate(schedule.start_date)}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(schedule)}
                  className="p-1 text-blue-600 hover:bg-gray-50 rounded"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(schedule.id)}
                  className="p-1 text-red-500 hover:bg-gray-50 rounded"
                  title="Delete"
                  disabled={isDeleting === schedule.id}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Compact details area */}
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="col-span-1 md:col-span-1 p-3 bg-gray-50 rounded-lg border border-gray-100 max-h-28 overflow-y-auto pr-2">
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-sm font-medium text-gray-800">{activeDays.length} days</p>
                <div className="mt-2 flex flex-col gap-2 text-xs text-gray-600">
                  {Object.keys(DAYS_MAP).map((dayNum) => {
                    const dayName = DAYS_MAP[dayNum];
                    const startTimeKey = `${dayName}_start_time`;
                    const endTimeKey = `${dayName}_end_time`;
                    const locationKey = `${dayName}_onsite_or_remote`;
                    if (!schedule[startTimeKey]) return null;
                    return (
                      <div key={dayName} className="py-1 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-700 capitalize">{dayName.slice(0,3)}</div>
                          <div className="text-xs text-gray-500">{schedule[startTimeKey]} - {schedule[endTimeKey]}</div>
                        </div>
                        <div className={`text-xs font-medium ${schedule[locationKey] ? 'text-red-600' : 'text-green-600'}`}>
                          {schedule[locationKey] ? 'Onsite' : 'Remote'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-1 md:col-span-1 p-3 bg-gray-50 rounded-lg border border-gray-100 max-h-28 overflow-y-auto pr-2">
                <p className="text-xs text-gray-500">Hours / week</p>
                <p className="text-sm font-medium text-gray-800">{Number(workHours).toFixed(1)} hrs</p>
                {schedule.number_of_work_hours_per_month ? (
                  <p className="text-xs text-gray-400 mt-1">{schedule.number_of_work_hours_per_month} hrs / month</p>
                ) : null}
                <div className="mt-2 flex flex-col gap-2 text-xs text-gray-600">
                  {Object.keys(DAYS_MAP).map((dayNum) => {
                    const dayName = DAYS_MAP[dayNum];
                    const startTimeKey = `${dayName}_start_time`;
                    const endTimeKey = `${dayName}_end_time`;
                    if (!schedule[startTimeKey] || !schedule[endTimeKey]) return null;
                    const start = new Date(`2025-01-01 ${schedule[startTimeKey]}`);
                    const end = new Date(`2025-01-01 ${schedule[endTimeKey]}`);
                    const hrs = Math.max(0, (end - start) / (1000 * 60 * 60));
                    return (
                      <div key={dayName} className="flex items-center justify-between py-1">
                        <div className="capitalize text-xs text-gray-700">{dayName.slice(0,3)}</div>
                        <div className="text-xs text-gray-500">{hrs.toFixed(1)} hrs</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compact daily schedule */}
              <div className="col-span-1 md:col-span-1 p-3 bg-gray-50 rounded-lg border border-gray-100 max-h-28 overflow-y-auto pr-2">
                <p className="text-xs text-gray-500">Daily</p>
                <div className="mt-2 flex flex-col gap-2 text-xs text-gray-600">
                  {Object.keys(DAYS_MAP).map((dayNum) => {
                    const dayName = DAYS_MAP[dayNum];
                    const startTimeKey = `${dayName}_start_time`;
                    const endTimeKey = `${dayName}_end_time`;
                    if (!schedule[startTimeKey]) return null;
                    return (
                      <div key={dayName} className="py-1">
                        <div className="text-xs text-gray-700 capitalize">{dayName.slice(0,3)}</div>
                        <div className="text-xs text-gray-500">{schedule[startTimeKey]} - {schedule[endTimeKey]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
    {/* Centralized delete confirmation modal */}
    {deleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteConfirm(null)} />
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Delete schedule</h4>
          <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this schedule? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-3 py-1 rounded border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
              disabled={isDeleting === deleteConfirm}
              className="px-3 py-1 rounded text-sm bg-red-600 text-white disabled:opacity-50"
            >
              {isDeleting === deleteConfirm ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ScheduleList;
