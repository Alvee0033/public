'use client';

import axios from './axios';

export async function checkCourseEnrollment(courseId) {
  if (!courseId) return { enrolled: false, reason: 'invalid_course' };

  try {
    const { data } = await axios.post('/edumarket/enrollments/check', {
      course_id: parseInt(courseId),
    });

    return data.data || data;
  } catch (error) {
    const { response } = error;

    if (!response)
      return { enrolled: false, error: error.message, reason: 'network_error' };

    const { status, data } = response;

    if (status === 401)
      return { enrolled: false, authError: true, reason: 'auth_error' };

    if (status === 400 && data?.message?.includes('No enrollment found'))
      return { enrolled: false, reason: 'not_enrolled' };

    return { enrolled: false, error: error.message, reason: 'unknown_error' };
  }
}
