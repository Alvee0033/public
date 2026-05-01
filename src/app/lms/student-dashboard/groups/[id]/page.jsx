"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import axios from '@/lib/axios';

// Import components
import SessionHeader from '../_components/SessionHeader';
import SessionInfo from '../_components/SessionInfo';
import SessionTiming from '../_components/SessionTiming';
import SessionJoin from '../_components/SessionJoin';
import SessionParticipants from '../_components/SessionParticipants';
import SessionDetailsSkeleton from '../_components/SessionDetailsSkeleton';

import { formatDateTime, getSessionStatus } from '../_components/utils';
import LoadGroupStudents from '../_components/LoadGroupStudents';

const fetcher = (url) => axios.get(url).then(res => res.data);

const GroupDetailsPage = () => {
  const params = useParams();
  const groupId = params?.id;

  // Fetch all group tutoring sessions
  const { data, isLoading, error } = useSWR('/group-tutoring-sessions', fetcher);

  // Filter session by id from the route
  const groupSession = React.useMemo(() => {
    if (!data?.data || !groupId) return null;
    return data.data.find(session => String(session.id) === String(groupId));
  }, [data, groupId]);

  // Fetch tutors only if tutor_id exists
  const tutorId = groupSession?.tutor_id;
  const { data: tutorsData } = useSWR(
    tutorId ? '/tutors' : null,
    fetcher
  );

  // Find tutor name by tutor_id
  const tutorName = React.useMemo(() => {
    if (!tutorsData?.data || !tutorId) return null;
    const tutor = tutorsData.data.find(t => String(t.id) === String(tutorId));
    if (!tutor) return null;
    return tutor.full_name || 
           `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 
           tutor.email || 
           tutor.username || 
           `Tutor #${tutorId}`;
  }, [tutorsData, tutorId]);



  if (isLoading) return <SessionDetailsSkeleton />;
  if (error) return <div className="p-6 text-red-500 bg-red-50 rounded-lg">Failed to load group details. Please try again.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {groupSession ? (
              <>
                <SessionHeader 
                  session={groupSession} 
                  status={getSessionStatus(groupSession)} 
                />
                <div className="p-6 space-y-6">
                  <SessionInfo session={groupSession} formatDateTime={formatDateTime} />
                  <SessionTiming 
                    session={groupSession} 
                    formatDateTime={formatDateTime} 
                    status={getSessionStatus(groupSession)}
                  />
                  <SessionJoin session={groupSession} status={getSessionStatus(groupSession)} />
                  <SessionParticipants session={groupSession} tutorName={tutorName} />
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Session Not Found</h3>
                <p className="text-gray-500">No group session found for this ID.</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-80">
          <LoadGroupStudents />
        </div>
      </div>
    </div>
  );
};



export default GroupDetailsPage;