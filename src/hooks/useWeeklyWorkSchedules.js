import useSWR from 'swr';
import axios from '@/lib/axios';
import { swrFetcher } from '@/lib/swrFetcher';

/**
 * Hook to fetch weekly work schedules for a specific tutor
 * @param {number|string} tutorId - The tutor ID to fetch schedules for
 * @returns {object} - { schedules, isLoading, error, mutate }
 */
export const useWeeklyWorkSchedules = (tutorId) => {
  const { data, error, isLoading, mutate } = useSWR(
    tutorId ? `/employee-weekly-work-schedules?tutor=${tutorId}` : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Filter to show only schedules matching the logged-in tutor's ID
  const filteredSchedules = data ? data.filter(schedule => schedule.tutor_id === Number(tutorId)) : [];

  return {
    schedules: filteredSchedules,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook to create a new weekly work schedule
 */
export const useCreateWeeklyWorkSchedule = () => {
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
 * Hook to update a weekly work schedule
 */
export const useUpdateWeeklyWorkSchedule = () => {
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
 * Hook to delete a weekly work schedule
 */
export const useDeleteWeeklyWorkSchedule = () => {
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
