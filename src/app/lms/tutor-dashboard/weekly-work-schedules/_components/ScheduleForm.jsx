'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Save, Clock, MapPin } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const ScheduleForm = ({ onSubmit, onClose, initialData, isLoading }) => {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: initialData || {
      start_date: new Date().toISOString().split('T')[0],
      monday_start_time: '',
      monday_end_time: '',
      monday_onsite_or_remote: true,
      tuesday_start_time: '',
      tuesday_end_time: '',
      tuesday_onsite_or_remote: true,
      wednesday_start_time: '',
      wednesday_end_time: '',
      wednesday_onsite_or_remote: true,
      thursday_start_time: '',
      thursday_end_time: '',
      thursday_onsite_or_remote: true,
      friday_start_time: '',
      friday_end_time: '',
      friday_onsite_or_remote: true,
      saturday_start_time: '',
      saturday_end_time: '',
      saturday_onsite_or_remote: true,
      sunday_start_time: '',
      sunday_end_time: '',
      sunday_onsite_or_remote: true,
    },
  });

  const formData = watch();
  const [expandedDays, setExpandedDays] = useState(new Set(DAYS));

  const toggleDay = (day) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleFormSubmit = (data) => {
    // Convert empty time strings to null
    const cleanedData = { ...data };
    DAYS.forEach((day) => {
      const startKey = `${day}_start_time`;
      const endKey = `${day}_end_time`;
      
      if (cleanedData[startKey] === '') {
        cleanedData[startKey] = null;
      }
      if (cleanedData[endKey] === '') {
        cleanedData[endKey] = null;
      }
    });

    const formattedData = {
      ...cleanedData,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : new Date().toISOString(),
    };
    onSubmit(formattedData);
  };

  const renderDaySection = (day) => {
    const startTimeKey = `${day}_start_time`;
    const endTimeKey = `${day}_end_time`;
    const locationKey = `${day}_onsite_or_remote`;

    return (
      <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Header */}
        <button
          type="button"
          onClick={() => toggleDay(day)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-900 capitalize">{DAY_LABELS[day]}</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${expandedDays.has(day) ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Day Content */}
        {expandedDays.has(day) && (
          <div className="px-4 py-4 space-y-4 bg-white">
            {/* Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} />
                  Start Time
                </label>
                <Controller
                  name={startTimeKey}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} />
                  End Time
                </label>
                <Controller
                  name={endTimeKey}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>
            </div>

            {/* Location Toggle */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                Work Location
              </label>
              <Controller
                name={locationKey}
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...field}
                        type="radio"
                        value="true"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Onsite</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...field}
                        type="radio"
                        value="false"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Remote</span>
                    </label>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {/* Start Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <Controller
              name="start_date"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            />
          </div>

          {/* Days Section */}
          <div className="mb-6 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
            {DAYS.map((day) => renderDaySection(day))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
