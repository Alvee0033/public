"use client";

import axios, { instance } from "@/lib/axios";
import { Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { useAppSelector } from "@/redux/hooks";

export default function AssignmentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pointsFilter, setPointsFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Get user data from Redux state
  const userData = useAppSelector((state) => state.auth.user);

  // Fetch student course assignments filtered by studentId
  const studentId = userData?.student_id;
  const getAssignments = async () => {
    if (!studentId) return [];
    const res = await instance.get(
      `/student-course-assignments?limit=1000&filter={"student": ${studentId}}`
    );
    return res?.data?.data || [];
  };

  const {
    data: assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useSWR(
    studentId ? ["student-course-assignments", studentId] : null,
    getAssignments,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    }
  );

  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "Student";

  // Helper functions for formatting
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter and search functionality
  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];

    return assignments.filter((assignment) => {
      // Search filter - searches in title and description
      const matchesSearch =
        assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Points filter
      const matchesPoints =
        !pointsFilter ||
        (pointsFilter === "high" && assignment.assignment_points >= 100) ||
        (pointsFilter === "medium" &&
          assignment.assignment_points >= 50 &&
          assignment.assignment_points < 100) ||
        (pointsFilter === "low" && assignment.assignment_points < 50);

      // Date filter
      const matchesDate =
        !dateFilter ||
        (() => {
          const now = new Date();
          const dueDate = new Date(assignment.due_date);
          const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

          return (
            (dateFilter === "overdue" && daysDiff < 0) ||
            (dateFilter === "today" && daysDiff === 0) ||
            (dateFilter === "week" && daysDiff > 0 && daysDiff <= 7) ||
            (dateFilter === "month" && daysDiff > 7 && daysDiff <= 30)
          );
        })();

      return matchesSearch && matchesPoints && matchesDate;
    });
  }, [assignments, searchTerm, pointsFilter, dateFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setPointsFilter("");
    setDateFilter("");
  };

  // Get active filter count
  const activeFiltersCount = [searchTerm, pointsFilter, dateFilter].filter(
    Boolean
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--primaryColor)] whitespace-nowrap overflow-hidden text-ellipsis">
          Assignments
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial sm:min-w-[280px]">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--primaryColor)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-[var(--primaryColor)] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--secondaryColor)] hover:text-[var(--primaryColor)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showFilters
                ? "bg-[var(--primaryColor)] text-white shadow-md"
                : "bg-gray-100 text-[var(--primaryColor)] hover:bg-[var(--primaryColor)] hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--secondaryColor)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Points Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Points
              </label>
              <select
                value={pointsFilter}
                onChange={(e) => setPointsFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Points</option>
                <option value="high">High (100+ pts)</option>
                <option value="medium">Medium (50-99 pts)</option>
                <option value="low">Low (&lt;50 pts)</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Dates</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="week">Due This Week</option>
                <option value="month">Due This Month</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex-shrink-0">
              <button
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
                className="w-full lg:w-auto px-6 py-2.5 text-sm font-medium bg-[var(--primaryColor)] text-white border border-[var(--primaryColor)] rounded-lg hover:bg-[var(--secondaryColor)] hover:border-[var(--secondaryColor)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {assignmentsLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-3">Loading assignments...</p>
        </div>
      )}

      {/* Error State */}
      {assignmentsError && !assignmentsLoading && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">
            Failed to load assignments
          </div>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      )}

      {/* No Data State */}
      {!assignmentsLoading &&
        !assignmentsError &&
        (!assignments || assignments.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg font-medium mb-2">
              No assignments found
            </div>
            <p className="text-gray-500">You don't have any assignments yet.</p>
          </div>
        )}

      {/* No Results State */}
      {!assignmentsLoading &&
        !assignmentsError &&
        assignments &&
        assignments.length > 0 &&
        filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg font-medium mb-2">
              No assignments match your filters
            </div>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[var(--secondaryColor)] text-white rounded-lg hover:bg-[var(--primaryColor)] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      {/* Responsive Table */}
      {!assignmentsLoading &&
        !assignmentsError &&
        filteredAssignments &&
        filteredAssignments.length > 0 && (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-separate border-spacing-x-4 border-spacing-y-0">
                  <thead>
                    <tr className="text-left text-xs sm:text-sm text-gray-500 border-b">
                      <th className="pb-4 font-medium text-center">No</th>
                      <th className="pb-4 font-medium">Title</th>
                      <th className="pb-4 font-medium hidden lg:table-cell">
                        Description
                      </th>
                      <th className="pb-4 font-medium text-center">Points</th>
                      <th className="pb-4 font-medium text-center hidden md:table-cell">
                        Assign Date
                      </th>
                      <th className="pb-4 font-medium text-center">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">
                    {filteredAssignments.map((assignment, index) => (
                      <tr key={assignment.id} className="border-b">
                        <td className="py-4 text-center">
                          <span className="font-mono text-gray-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-gray-900 mb-1 text-base sm:text-sm line-clamp-1">
                            {assignment.title}
                          </div>
                          {/* Show description on mobile when hidden */}
                          <div className="lg:hidden text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {assignment.description
                              ? assignment.description
                                  .replace(/<[^>]+>/g, "")
                                  .trim() || "No description"
                              : "No description"}
                          </div>
                          {/* Mobile: Due date and assign date stacked, compact */}
                          <div className="md:hidden flex flex-col gap-0.5 mt-1">
                            <span className="text-xs font-semibold text-[var(--primaryColor)]">
                              Due: {formatDate(assignment.due_date)}
                            </span>
                            <span className="text-xs text-gray-400">
                              Assigned: {formatDate(assignment.assign_date)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(assignment.due_date)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <div className="text-gray-600 max-w-xs">
                            {assignment.description ? (
                              <span className="line-clamp-2">
                                {assignment.description
                                  .replace(/<[^>]+>/g, "")
                                  .trim() || "No description"}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                No description
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 min-w-[70px]">
                              {assignment.assignment_points} pts
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center hidden md:table-cell">
                          <div className="text-gray-600">
                            {formatDate(assignment.assign_date)}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(assignment.due_date)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(assignment.due_date)}
                            </div>
                            {/* Show assign date on mobile */}
                            <div className="md:hidden text-xs text-gray-400 mt-1">
                              Assigned: {formatDate(assignment.assign_date)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Responsive Summary Cards */}
            {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-[var(--primaryColor)] to-[var(--secondaryColor)] p-4 sm:p-6 rounded-xl ">
                <div className="text-sm font-medium text-white mb-1">
                  {activeFiltersCount > 0 ? 'Filtered' : 'Total'} Assignments
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {filteredAssignments.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[var(--secondaryColor)] to-[var(--primaryColor)] p-4 sm:p-6 rounded-xl ">
                <div className="text-sm font-medium text-white mb-1">
                  {activeFiltersCount > 0 ? 'Filtered' : 'Total'} Points
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {filteredAssignments.reduce(
                    (sum, assignment) =>
                      sum + (assignment.assignment_points || 0),
                    0
                  )}
                </div>
              </div>
            </div> */}

            {/* Clean & Simple Summary Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-600">
                    {activeFiltersCount > 0 ? "Filtered" : "Total"} Assignments
                  </div>
                  <div className="text-base font-bold text-[var(--primaryColor)]">
                    {filteredAssignments.length}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-600">
                    {activeFiltersCount > 0 ? "Filtered" : "Total"} Points
                  </div>
                  <div className="text-base font-bold text-[var(--primaryColor)]">
                    {filteredAssignments.reduce(
                      (sum, assignment) =>
                        sum + (assignment.assignment_points || 0),
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-500 text-center sm:text-right">
                Showing {filteredAssignments.length} of{" "}
                {assignments?.length || 0} assignments
              </div>
            </div>
          </>
        )}
    </div>
  );
}
