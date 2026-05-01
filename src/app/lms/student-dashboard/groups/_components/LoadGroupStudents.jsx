"use client"

import React from "react"
import useSWR from "swr"
import axios from "@/lib/axios"
import { useParams } from "next/navigation"

const fetcher = (url) => axios.get(url).then((res) => res.data)

const LoadGroupStudents = () => {
  const params = useParams()
  const groupId = params?.id
  const { data, isLoading, error } = useSWR("/group-student-map", fetcher)

  // Filter students by groupId
  const students = React.useMemo(() => {
    if (!data?.data || !groupId) return []
    return data.data.filter((item) => String(item.group_id) === String(groupId))
  }, [data, groupId])

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-red-600 font-medium">Failed to load students</p>
        </div>
      </div>
    )
  }

  if (!students.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Students in this Group</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No students found for this group</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Students in this Group</h3>
      <div className="space-y-3 max-h-100 overflow-y-auto">
        {students.map((item, idx) => {
          const studentName =
            item.student?.full_name ||
            `${item.student?.first_name || ""} ${item.student?.last_name || ""}`.trim() ||
            item.student?.username ||
            "Student"
          const initial = studentName[0]?.toUpperCase() || "S"

          return (
            <div
              key={item.student?.id || idx}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{studentName}</div>
                {item.student?.email_address && (
                  <div className="text-sm text-gray-500 truncate">{item.student.email_address}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LoadGroupStudents
