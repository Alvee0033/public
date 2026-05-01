'use client';

import CourseList from '@/components/shared/CourseList';
import PageTitle from '@/components/shared/pageTitle';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

function ZoneCoursePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const getCourses = async () => {
    const skip = (currentPage - 1) * pageSize;
    const queryString = new URLSearchParams({
      pagination: true,
      limit: pageSize,
      skip,
    }).toString();

    try {
      const res = await axios.get(`/courses?${queryString}`);
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load courses');
      throw error;
    }
  };

  const {
    data: coursesData,
    isLoading,
    error,
  } = useSWR(['courses', currentPage], getCourses, {
    keepPreviousData: true,
  });

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const courses = coursesData?.data || [];
  const totalItems = coursesData?.pagination?.total || 0;

  return (
    <>
      <PageTitle path={'Learning Hub Course List'} title={'Explore Brooklyn Courses'} />
      <div className="container mx-auto px-4 py-12">
        <CourseList
          courses={courses}
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default ZoneCoursePage;
