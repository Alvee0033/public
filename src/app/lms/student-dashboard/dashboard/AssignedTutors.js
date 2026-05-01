'use client';
import { avatarPlaceHolder } from '@/assets/images';
import axios, { instance } from '@/lib/axios';
import Image from 'next/image';
import useSWR from 'swr';
import { useAppSelector } from '@/redux/hooks';

function TutorCard({ tutorStudent }) {
  const tutor = tutorStudent.tutor;

  // Calculate rating stars based on actual rating_score
  const ratingScore = tutor.rating_score || 0;
  const fullStars = Math.floor(ratingScore);
  const hasHalfStar = ratingScore % 1 !== 0;

  // Format tutor since date
  const tutorSinceDate = tutor.tutor_since_date
    ? new Date(tutor.tutor_since_date).getFullYear()
    : null;

  return (
    <div className="bg-gradient-to-br from-[var(--primaryColor)]/5 to-[var(--secondaryColor)]/10 p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-[var(--primaryColor)] hover:shadow-xl hover:border-[var(--secondaryColor)] hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-1">
          {/* Avatar with verification badge */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border-2 md:border-3 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Image
                src={tutor.profile_picture || avatarPlaceHolder}
                alt={tutor.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name and title */}
            <div className="mb-2 md:mb-3">
              <h3 className="text-base sm:text-lg font-bold text-[var(--primaryColor)] group-hover:text-[var(--secondaryColor)] transition-colors duration-200 truncate flex items-center gap-1 sm:gap-2">
                <span className="truncate">{tutor.name}</span>
                {tutor.verified_tutor && (
                  <span className="text-blue-500 flex-shrink-0">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <span className="text-[var(--secondaryColor)] text-xs sm:text-sm font-semibold bg-[var(--secondaryColor)]/10 px-2 sm:px-3 py-1 rounded-full w-fit">
                  {tutor.job_title || 'Tutor'}
                </span>
                {tutor.company_name && (
                  <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full w-fit max-w-[120px] sm:max-w-[150px] md:max-w-[200px] truncate">
                    {tutor.company_name}
                  </span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="bg-white/60 rounded-lg p-2 text-center border border-[var(--primaryColor)]/10">
                <div className="text-sm sm:text-base lg:text-lg font-bold text-[var(--primaryColor)]">
                  {tutor.teach_students || 0}
                </div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center border border-[var(--secondaryColor)]/10">
                <div className="text-sm sm:text-base lg:text-lg font-bold text-[var(--secondaryColor)]">
                  {tutor.tutoring_sessions || 0}
                </div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
            </div>

            {/* Contact info and experience */}
            <div className="space-y-1 md:space-y-1.5 lg:space-y-2">
              {tutor.mobile && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium truncate max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-full">
                    {tutor.mobile}
                  </span>
                </div>
              )}

              {tutor.personal_email && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="truncate font-medium max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-full">
                    {tutor.personal_email}
                  </span>
                </div>
              )}

              {tutor.years_of_experience && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">
                    {tutor.years_of_experience} years experience
                  </span>
                </div>
              )}

              {tutorSinceDate && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">
                    Tutoring since {tutorSinceDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons removed */}
      </div>

      {/* Bottom section with dynamic rating */}
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200/60">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dynamic rating stars */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${
                    i < fullStars
                      ? 'text-yellow-400'
                      : i === fullStars && hasHalfStar
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              ({ratingScore}/5)
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {tutor.active_tutor_or_passive && (
              <div className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                Active
              </div>
            )}

            {tutor.offered_courses > 0 && (
              <div className="text-xs font-medium text-[var(--primaryColor)] bg-[var(--primaryColor)]/10 px-2 py-1 rounded-full">
                {tutor.offered_courses} Courses
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssignedTutors() {
  // Get user data from Redux state
  const userData = useAppSelector((state) => state.auth.user);

  // Fetch tutor-students data
  const getTutorStudents = async () => {
    if (!userData?.student_id) return [];

    // Use the exact filter format as specified: ?filter={"student":14}
    const filterParam = JSON.stringify({
      student: userData.student_id,
    });

    const res = await instance.get(`/tutor-students?filter=${filterParam}`);
    return res?.data?.data || [];
  };

  const {
    data: tutorStudents,
    isLoading: tutorsLoading,
    error: tutorsError,
  } = useSWR(
    userData?.student_id ? `tutor-students-${userData.student_id}` : null,
    getTutorStudents
  );

  const studentName = userData?.first_name || 'Student';

  // Since we're already filtering by student_id in the API call,
  // we don't need additional client-side filtering
  const currentStudentTutors = tutorStudents || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--primaryColor)]">
          {`${studentName.toUpperCase()}'S ASSIGNED TUTORS`}
        </h2>
      </div>

      {/* Loading State */}
      {tutorsLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-2 text-gray-500">Loading tutors...</p>
        </div>
      )}

      {/* Error State */}
      {tutorsError && !tutorsLoading && (
        <div className="text-center py-8">
          <p className="text-red-500">
            Failed to load assigned tutors. Please try again later.
          </p>
        </div>
      )}

      {/* No Tutors State */}
      {!tutorsLoading &&
        !tutorsError &&
        currentStudentTutors.length === 0 &&
        userData?.student_id && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tutors assigned yet.</p>
          </div>
        )}

      {/* Tutors Grid */}
      {!tutorsLoading && !tutorsError && currentStudentTutors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentStudentTutors.map((tutorStudent) => (
            <TutorCard key={tutorStudent.id} tutorStudent={tutorStudent} />
          ))}
        </div>
      )}

      {/* Summary */}
      {!tutorsLoading && !tutorsError && currentStudentTutors.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--primaryColor)]/10 to-[var(--secondaryColor)]/10 rounded-lg">
          <div className="mt-4">
            <p className="text-[var(--primaryColor)] text-sm">
              You have {currentStudentTutors.length} tutor
              {currentStudentTutors.length > 1 ? 's' : ''} assigned to you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
