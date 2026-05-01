import useSWR from 'swr';
import axios from '@/lib/axios';
import { swrFetcher } from '@/lib/swrFetcher';

/**
 * Hook to fetch weekly work schedules for a specific student
 * @param {number|string} studentId - The student ID to fetch schedules for
 * @returns {object} - { schedules, isLoading, error, mutate }
 */
export const useStudentWeeklyWorkSchedules = (studentId) => {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? `/employee-weekly-work-schedules?student_id=${studentId}` : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Filter out schedules where student_id is null - double check to ensure only student records are shown
  const filteredSchedules = data ? data.filter(schedule => schedule.student_id != null && schedule.student_id === studentId) : [];

  return {
    schedules: filteredSchedules,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook to create a new weekly work schedule for student
 */
export const useCreateStudentWeeklyWorkSchedule = () => {
  const create = async (scheduleData) => {
    try {
      const response = await axios.post('/employee-weekly-work-schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  };

  return { create };
};

/**
 * Hook to update a weekly work schedule for student
 */
export const useUpdateStudentWeeklyWorkSchedule = () => {
  const update = async (id, scheduleData) => {
    try {
      const response = await axios.patch(`/employee-weekly-work-schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  };

  return { update };
};

/**
 * Hook to delete a weekly work schedule for student
 */
export const useDeleteStudentWeeklyWorkSchedule = () => {
  const delete_schedule = async (id) => {
    try {
      const response = await axios.delete(`/employee-weekly-work-schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  };

  return { delete_schedule };
};
