"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import TopAnnouncement from "@/components/top/TopAnnouncement";

export default function MyScholarshipsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingIds, setCancellingIds] = useState([]);
  
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);

  // move loading logic to a reusable function so Retry can call it
  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const studentId = user?.student_id;

      if (!studentId) {
        setError("Student not found. Please login.");
        setApplications([]);
        setLoading(false);
        return;
      }

      // build filter param as a JSON string
      const filter = JSON.stringify({ student: Number(studentId) });
      const url = `/scholarship-student-applications?limit=1000&filter=${encodeURIComponent(
        filter
      )}`;

      const res = await axios.get(url);
      const data = res?.data?.data ?? [];

      // The API now embeds scholarship info in the application response.
      // The fields may be shaped different ways depending on backend (e.g., scholarship_detail, scholarship, or scholarship_name fields).
      const enrichFromEmbedded = (app) => {
        // prefer scholarship_detail if present
        const s = app.scholarship_detail || app.scholarship || null;
        // normalize fields
        const name = s?.name || app.scholarship_name || app.name || null;
        const short_description =
          s?.short_description ||
          app.scholarship_short_description ||
          app.short_description ||
          "";
        const amount = s?.amount ?? app.scholarship_amount ?? app.amount ?? 0;
        return {
          ...app,
          scholarship_detail: { name, short_description, amount },
        };
      };

      const enriched = data.map(enrichFromEmbedded);
      setApplications(enriched);
    } catch (err) {
      console.error("Failed to load applications", err);
      setError(err?.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <TopAnnouncement className="mb-6" alwaysShow={true} />
        <h2 className="text-2xl font-bold mb-6 text-[#5F2DED]">
          My Scholarship Applications
        </h2>

        {loading && (
          <div className="w-full">
            <div className="min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4">
              <div className="w-full max-w-2xl mx-auto my-6 flex flex-col items-center gap-4 px-4">
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center"
                >
                  <svg
                    className="h-12 w-12 text-[#5F2DED] animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
                <div className="text-center text-gray-600">
                  <span className="font-medium">Loading applications</span>
                  <span className="ml-2 text-[#5F2DED]" aria-hidden>
                    <span className="animate-pulse">...</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full">
            <div className="min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4">
              <div className="w-full max-w-2xl mx-auto my-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M11.001 10h2v5h-2zM11 16h2v2h-2z"
                        fill="currentColor"
                        className="opacity-90"
                      />
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        stroke="currentColor"
                        strokeWidth="0"
                        fill="currentColor"
                        className="opacity-20"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Unable to load applications
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{error}</p>

                    <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                      <button
                        onClick={() => loadApplications()}
                        disabled={loading}
                        className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                          loading
                            ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                            : "bg-[#5F2DED] text-white hover:bg-[#4a20d6]"
                        }`}
                        aria-label="Retry loading applications"
                      >
                        {loading ? (
                          <svg
                            className="animate-spin h-4 w-4 text-gray-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : null}
                        <span>{loading ? "Retrying..." : "Retry"}</span>
                      </button>

                      <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-150"
                        aria-label="Reload page"
                      >
                        Reload Page
                      </button>

                      <a
                        href="/contact"
                        className="mt-2 sm:mt-0 sm:ml-auto text-sm text-[#5F2DED] hover:underline text-center sm:text-left"
                      >
                        Contact support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-[#5F2DED]/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No scholarship applications yet
              </h3>
            </div>
            <button
              onClick={() => {
                try {
                  window.location.href = "/scholarship-application";
                } catch (err) {
                  console.error(
                    "Failed to navigate to scholarship application",
                    err
                  );
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white bg-[#5F2DED] hover:bg-[#4a20d6] focus:outline-none focus:ring-2 focus:ring-[#5F2DED] focus:ring-offset-2 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <article
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-[#5F2DED]/20 transition-all duration-300 overflow-hidden"
            >
              {/* Header with Status Badge */}
              <div className="bg-gradient-to-r from-[#5F2DED]/5 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5F2DED] rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Applied{" "}
                      {new Date(app.application_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.approved_date ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Approved
                      </span>
                    ) : app.is_cancelled_by_student ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✕ Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ⏱ Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scholarship Details */}
              {app.scholarship_detail && (
                <div className="px-6 py-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                      {app.scholarship_detail.name || "Scholarship Application"}
                    </h3>
                    {app.scholarship_detail.short_description && (
                      <div
                        className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: app.scholarship_detail.short_description,
                        }}
                      />
                    )}
                  </div>

                  {/* Amount Display */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">
                        Scholarship Amount
                      </span>
                      <span className="text-xl font-bold text-green-800">
                        ${(app.scholarship_detail.amount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {app.approved_date
                      ? `Approved on ${new Date(
                          app.approved_date
                        ).toLocaleDateString()}`
                      : app.is_cancelled_by_student
                      ? "Application was cancelled"
                      : "Awaiting review"}
                  </div>
                  <div>
                    {!app.is_cancelled_by_student && !app.approved_date ? (
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              "Are you sure you want to cancel this application?"
                            )
                          )
                            return;
                          try {
                            setCancellingIds((s) => [...s, app.id]);
                            await axios.patch(
                              `/scholarship-student-applications/${app.id}`,
                              { is_cancelled_by_student: true }
                            );
                            setApplications((prev) =>
                              prev.map((p) =>
                                p.id === app.id
                                  ? { ...p, is_cancelled_by_student: true }
                                  : p
                              )
                            );
                          } catch (e) {
                            console.error("Failed to cancel application", e);
                            alert(
                              e?.response?.data?.message ||
                                "Failed to cancel application."
                            );
                          } finally {
                            setCancellingIds((s) =>
                              s.filter((id) => id !== app.id)
                            );
                          }
                        }}
                        disabled={cancellingIds.includes(app.id)}
                        className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {cancellingIds.includes(app.id)
                          ? "Cancelling..."
                          : "Cancel Application"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
