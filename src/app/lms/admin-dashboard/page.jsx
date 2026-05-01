"use client"
import React from 'react'
import useSWR from 'swr'
import { swrFetcher, swrCountFetcher } from '@/lib/swrFetcher'
import TutorStats from './_components/TutorStats'
import StudentStats from './_components/StudentStats'
import StudentWidget from './_components/StudentWidget'
import TutorsWidget from './_components/TutorsWidget'
import InstituteWidget from './_components/InstituteWidget'
import InstituteStats from './_components/InstituteStats'
import EmployeeStats from './_components/EmployeeStats'

const SuperAdminDashboardPage = () => {
    // Fetch all data using SWR
    const { data: students, error: studentsError, isLoading: studentsLoading } = useSWR(
        ['/students', { page: 1, limit: 50 }],
        ([url, params]) => swrFetcher(url, params)
    )

    const { data: tutors, error: tutorsError, isLoading: tutorsLoading } = useSWR(
        ['/tutors', { page: 1, limit: 50 }],
        ([url, params]) => swrFetcher(url, params)
    )

    const { data: institutes, error: institutesError, isLoading: institutesLoading } = useSWR(
        ['/learning-hub', { page: 1, limit: 200 }],
        async ([url, params]) => {
            const data = await swrFetcher(url, params)
            const hubs = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                    ? data.items
                    : []

            return hubs.map((hub) => ({
                id: hub.id,
                name: hub.hub_name || hub.name || 'Learning Hub',
                logo: hub.logo || hub.logo_url || '',
                email: hub.email || '—',
                full_address: [hub.address_line1, hub.city].filter(Boolean).join(', '),
            }))
        }
    )

    const { data: studentCount, error: studentCountError, isLoading: studentCountLoading } = useSWR(
        '/students/count',
        swrCountFetcher
    )

    const { data: tutorCount, error: tutorCountError, isLoading: tutorCountLoading } = useSWR(
        '/tutors/count',
        swrCountFetcher
    )

    const instituteCount = Array.isArray(institutes) ? institutes.length : 0
    const instituteCountError = null
    const instituteCountLoading = institutesLoading

    const { data: employeeCount, error: employeeCountError, isLoading: employeeCountLoading } = useSWR(
        '/employees/count',
        swrCountFetcher
    )

    // Check if any data is still loading
    const isLoading = studentsLoading || tutorsLoading || institutesLoading || studentCountLoading || tutorCountLoading || instituteCountLoading || employeeCountLoading

    // Check if there are any errors
    const hasError = studentsError || tutorsError || institutesError || studentCountError || tutorCountError || instituteCountError || employeeCountError

    // Show global loading state
    if (isLoading) {
        return (
            <div className='p-8 flex justify-center items-center min-h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-4 border-blue-500 mx-auto mb-4'></div>
                    <p className='text-lg font-semibold text-gray-700'>Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    // Show error state
    if (hasError) {
        return (
            <div className='p-8 flex justify-center items-center min-h-screen'>
                <div className='text-center'>
                    <div className='text-red-500 text-6xl mb-4'>⚠️</div>
                    <p className='text-lg font-semibold text-red-600'>Failed to load dashboard data</p>
                    <p className='text-sm text-gray-600 mt-2'>Please refresh the page or contact support</p>
                </div>
            </div>
        )
    }

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8'>
            <div className='flex justify-center rounded-lg mb-6 sm:mb-8 bg-gradient-to-tr from-blue-500 to-purple-500 py-6 sm:py-8'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white px-4'>
                    Admin Dashboard
                </h1>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="w-80 sm:w-full mx-auto overflow-x-hidden">
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 
                  overflow-x-auto sm:overflow-visible px-2">

                    <div className="flex-shrink-0 flex justify-center w-64 sm:w-auto">
                        <StudentStats count={studentCount} />
                    </div>

                    <div className="flex-shrink-0 flex justify-center w-64 sm:w-auto">
                        <TutorStats count={tutorCount} />
                    </div>

                    <div className="flex-shrink-0 flex justify-center w-64 sm:w-auto">
                        <InstituteStats count={instituteCount} />
                    </div>

                    <div className="flex-shrink-0 flex justify-center w-64 sm:w-auto">
                        <EmployeeStats count={employeeCount} />
                    </div>
                </div>
            </div>


            {/* Widgets - Responsive Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8'>
                <div><StudentWidget data={students} /></div>
                <div><TutorsWidget data={tutors} /></div>
            </div>

            {/* Institute Widget */}
            <div className='grid grid-cols-1 gap-4 sm:gap-6 mb-8'>
                <div><InstituteWidget data={institutes} /></div>
            </div>
        </div>
    )
}

export default SuperAdminDashboardPage