"use client";

import { avatarPlaceHolder } from "@/assets/images";
import Button from "@/components/shared/buttons/Button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useAppSelector } from "@/redux/hooks";

function GuardianCard({ guardian }) {
  const guardianName =
    guardian.first_name || guardian.guardian_name || "Guardian";
  const avatarUrl = guardian.profile_picture_url || avatarPlaceHolder;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center gap-3 border border-gray-100">
      <Image
        src={avatarUrl}
        alt={guardianName}
        className="w-16 h-16 rounded-full object-cover border"
        width={64}
        height={64}
      />
      <div className="flex flex-col items-center">
        <span
          className="font-semibold text-lg"
          style={{ color: "var(--primaryColor)" }}
        >
          {guardianName}
        </span>
        {guardian.relation && (
          <span className="text-xs text-gray-500">
            Relationship: {guardian.relation}
          </span>
        )}
        {guardian.access_level && (
          <span className="text-xs text-gray-500">
            {guardian.access_level} Access
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 mt-1">
        {(guardian.guardian_email || guardian.email) && (
          <a
            href={`mailto:${guardian.guardian_email || guardian.email}`}
            className="text-xs hover:underline break-all"
            style={{ color: "var(--secondaryColor)" }}
          >
            {guardian.guardian_email || guardian.email}
          </a>
        )}
        {(guardian.guardian_phone || guardian.phone_number) && (
          <a
            href={`tel:${guardian.guardian_phone || guardian.phone_number}`}
            className="text-xs text-gray-600 hover:underline"
          >
            {guardian.guardian_phone || guardian.phone_number}
          </a>
        )}
        {(guardian.guardian_job_title || guardian.occupation) && (
          <span className="text-xs text-gray-500">
            {guardian.guardian_job_title || guardian.occupation}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Guardians() {
  // Get user data from Redux state
  const userData = useAppSelector((state) => state.auth.user);

  const studentId = userData?.student_id;

  // Fetch guardian accesses for this student
  const getGuardianAccesses = async () => {
    if (!studentId) return [];
    const filter = { student: studentId };
    const res = await axios.get(
      `/student-guardian-accesses?filter=${JSON.stringify(filter)}`
    );
    return res?.data?.data || [];
  };

  const {
    data: guardians = [],
    isLoading: guardiansLoading,
    error: guardiansError,
  } = useSWR(
    studentId ? ["student-guardian-accesses", studentId] : null,
    getGuardianAccesses
  );

  const isLoading = guardiansLoading;
  const error = guardiansError;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full container pb-20">
      <div className="flex flex-row items-center justify-between gap-2 mb-6 w-full min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2
            className="font-medium text-base sm:text-xl truncate"
            style={{ color: "var(--primaryColor)" }}
          >
            GUARDIANS{" "}
            {!isLoading && guardians.length > 0 && `(${guardians.length})`}
          </h2>
        </div>
        <Link
          href="/lms/student-dashboard/my-guardian/new"
          className="flex-shrink-0"
        >
          <Button
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white border-none rounded-md hover:opacity-90 transition-opacity min-w-[90px]"
            style={{ backgroundColor: "var(--secondaryColor)" }}
          >
            Add Guardian
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse flex flex-col items-center"
            >
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="w-24 h-6 mb-1" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-dashed border-gray-200 rounded-lg text-red-500">
          Error loading guardians. Please try again.
        </div>
      ) : guardians.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-gray-200 rounded-lg">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Guardians Found
          </h3>
          <p className="text-gray-500 mb-4">
            You currently don't have any guardians linked to your account.
          </p>
          <Link href="/lms/student-dashboard/my-guardian/new">
            <Button
              className="border-none transition-all rounded-md text-white hover:opacity-90"
              style={{ backgroundColor: "var(--primaryColor)" }}
            >
              Add Your First Guardian
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {guardians.map((guardian) => (
            <GuardianCard
              key={guardian.id || guardian.guardian_user_id}
              guardian={guardian}
            />
          ))}
        </div>
      )}
    </div>
  );
}
