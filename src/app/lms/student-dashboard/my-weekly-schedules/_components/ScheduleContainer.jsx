'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useStudentWeeklyWorkSchedules, useCreateStudentWeeklyWorkSchedule, useUpdateStudentWeeklyWorkSchedule, useDeleteStudentWeeklyWorkSchedule } from '@/hooks/useStudentWeeklyWorkSchedules';
import ScheduleForm from './ScheduleForm';
import ScheduleList from './ScheduleList';
import ScheduleCalendar from './ScheduleCalendar';
import useAuth from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { useAppSelector } from '@/redux/hooks';

const ScheduleContainer = () => {
  useAuth();
  
  // Get user data from Redux state instead of /me API
  const user = useAppSelector((state) => state.auth.user);
  const studentId = user?.student_id;
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [studentError, setStudentError] = useState(null);

  // Check if student ID is available
  useEffect(() => {
    if (!studentId) {
      setStudentError('You are not registered as a student');
    } else {
      setStudentError(null);
    }
  }, [studentId]);

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  // Data fetching
  const { schedules, isLoading, error: fetchError, mutate } = useStudentWeeklyWorkSchedules(studentId);

  // CRUD operations
  const { create } = useCreateStudentWeeklyWorkSchedule();
  const { update } = useUpdateStudentWeeklyWorkSchedule();
  const { delete_schedule } = useDeleteStudentWeeklyWorkSchedule();

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (formData) => {
      try {
        setError(null);
        const data = {
          ...formData,
          student: studentId,
        };

        if (editingSchedule) {
          await update(editingSchedule.id, data);
        } else {
          await create(data);
        }

        // Revalidate data
        await mutate();
        setShowForm(false);
        setEditingSchedule(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to save schedule');
      }
    },
    [studentId, editingSchedule, create, update, mutate]
  );

  // Handle edit
  const handleEdit = useCallback((schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        setIsDeleting(id);
        setError(null);
        await delete_schedule(id);
        await mutate();
        setIsDeleting(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to delete schedule');
        setIsDeleting(null);
      }
    },
    [delete_schedule, mutate]
  );

  // Handle form close
  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingSchedule(null);
  }, []);

  // Handle create new
  const handleCreateNew = useCallback(() => {
    setEditingSchedule(null);
    setShowForm(true);
  }, []);

  // Show loading state
  if (loadingStudent) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Show error if student ID not found
  if (studentError || !studentId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold text-red-900">Access Denied</p>
          <p className="text-sm text-red-700">{studentError || 'You must be registered as a student to access schedules'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Study Schedule</h1>
          <p className="text-gray-600 mt-1">Manage your weekly study schedule</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          New Schedule
        </button>
      </div>

      {/* Error Alert */}
      {(error || fetchError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error || fetchError?.message}</p>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            viewMode === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            viewMode === 'calendar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <ScheduleList
          schedules={schedules}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      ) : (
        <ScheduleCalendar
          schedules={schedules}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
          onEditSchedule={handleEdit}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <ScheduleForm
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          initialData={editingSchedule}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ScheduleContainer;
