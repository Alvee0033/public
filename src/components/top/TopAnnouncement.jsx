"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

/**
 * Polished announcement bar with CTA and dismiss button.
 * Dismissal lasts only for the current React lifecycle. To persist across reloads,
 * pass `persistKey` prop (localStorage key) or I can add persistent logic for you.
 *
 * Props:
 * - message: string
 * - onApply: optional function called when Apply button is clicked
 * - className: extra class names
 * - alwaysShow: boolean - if true, always display regardless of application status
 */
const TopAnnouncement = ({
  message = "Apply for scholarship!",
  onApply = null,
  className = "",
  alwaysShow = false,
}) => {
  const [visible, setVisible] = useState(true);
  const [eligible, setEligible] = useState(null); // null = loading, true = show bar, false = don't show

  useEffect(() => {
    // If alwaysShow is true, skip eligibility check
    if (alwaysShow) {
      setEligible(true);
      return;
    }

    // Read user from localStorage and fetch scholarship applications for that student_id
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("user");
    let studentId = null;
    try {
      const user = raw ? JSON.parse(raw) : null;
      studentId = user?.student_id;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }

    if (!studentId) {
      // No student id available — don't show
      setEligible(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get("/scholarship-student-applications", {
          params: {
            limit: 1000,
            filter: JSON.stringify({ student: studentId }),
          },
        });

        const data = res?.data?.data;
        if (!cancelled) {
          // Show the bar only if data is an array and it's empty (student hasn't applied)
          setEligible(Array.isArray(data) && data.length === 0);
        }
      } catch (err) {
        console.error("Error fetching scholarship applications", err);
        if (!cancelled) setEligible(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [alwaysShow]);

  // While checking eligibility, don't render anything to avoid flicker
  if (eligible === null) return null;

  if (!eligible) return null;

  if (!visible) return null;

  const router = useRouter();

  const handleApply = () => {
    try {
      if (onApply) onApply();
      router.push("/scholarship-application");
    } catch (err) {
      console.error("Failed to navigate to scholarship application", err);
    } finally {
      setVisible(false);
    }
  };

  return (
    <div
      className={`w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#5F2DED] rounded-full"></div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#5F2DED]/10 text-[#5F2DED]">
                📚 Scholarship Available
              </span>
            </div>
            <p className="text-sm text-gray-700 font-medium">{message}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#5F2DED] hover:bg-[#4a20d6] focus:outline-none focus:ring-2 focus:ring-[#5F2DED] focus:ring-offset-2 transition-colors duration-200"
            >
              Apply Now
            </button>

            <button
              aria-label="Close announcement"
              onClick={() => setVisible(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopAnnouncement;
