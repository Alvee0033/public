"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Link } from 'lucide-react';
import React from 'react';

export default function SidebarTabs({
  activeTab,
  setActiveTab,
  sessionsLoading,
  lessonsLoading,
  assignmentsLoading,
  tutorSessions,
  tutorLessons,
  tutorAssignments,
  handleDragStart
}) {

  // Use course_master_lesson.name to determine 1:1 or group session
  const isOneToOneSession = (session) => session?.course_master_lesson?.name === "1:1 Session";
  const isGroupSession = (session) => session?.course_master_lesson?.name && session.course_master_lesson.name !== "1:1 Session";

  // Sub-tab state for sessions
  const [sessionTypeTab, setSessionTypeTab] = React.useState('oneToOne');

  // Split sessions into approved and pending based on is_requested
  const approvedSessions = Array.isArray(tutorSessions)
    ? tutorSessions.filter((s) => s.is_requested === false)
    : [];
  const pendingSessions = Array.isArray(tutorSessions)
    ? tutorSessions.filter((s) => s.is_requested === true)
    : [];

  // Further filter by type for sub-tabs
  const filteredSessions = {
    'oneToOne': sessionTypeTab === 'oneToOne'
      ? (activeTab === 'sessions'
        ? approvedSessions.filter(isOneToOneSession)
        : pendingSessions.filter(isOneToOneSession))
      : [],
    'group': sessionTypeTab === 'group'
      ? (activeTab === 'sessions'
        ? approvedSessions.filter(isGroupSession)
        : pendingSessions.filter(isGroupSession))
      : [],
  };

  return (
    <Tabs defaultValue="sessions" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-w-0">
      <TabsList className="w-full justify-start px-2 sm:px-4 pt-2 h-12 bg-white border-b overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <TabsTrigger value="sessions" className="data-[state=active]:bg-gray-100 text-xs sm:text-base px-2 sm:px-4">Approved sessions</TabsTrigger>
        <TabsTrigger value="pending" className="data-[state=active]:bg-gray-100 text-xs sm:text-base px-2 sm:px-4">Pending Sessions</TabsTrigger>
        {/* <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-100 text-xs sm:text-base px-2 sm:px-4">Assignments</TabsTrigger> */}
      </TabsList>

      {/* Sessions Tab Content with sub-tabs */}
      <TabsContent value="sessions" className="flex-1 flex flex-col min-w-0">
        <div className="w-full flex gap-2 border-b bg-white px-2 sm:px-4 pt-2 mb-2">
          <button
            className={`px-3 py-1 rounded-t text-xs sm:text-sm font-medium focus:outline-none transition-colors ${sessionTypeTab === 'oneToOne' ? 'bg-gray-100 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSessionTypeTab('oneToOne')}
          >
            1:1 Sessions
          </button>
          <button
            className={`px-3 py-1 rounded-t text-xs sm:text-sm font-medium focus:outline-none transition-colors ${sessionTypeTab === 'group' ? 'bg-gray-100 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSessionTypeTab('group')}
          >
            Group Sessions
          </button>
        </div>
        {/* 1:1 Sessions List */}
        {sessionTypeTab === 'oneToOne' && (
          <div className="p-2 sm:p-4 min-h-[160px] max-h-[60vh] sm:min-h-0 sm:max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessionsLoading ? (
              <div className="text-center text-gray-500">
                <span className="animate-spin h-5 w-5 inline-block">⏳</span>
              </div>
            ) : filteredSessions.oneToOne.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.oneToOne.map((session) => (
                  // ...existing code for 1:1 session card...
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-grab group"
                    draggable
                    onDragStart={() => handleDragStart(session)}
                  >
                    {/* ...existing code for 1:1 session card... */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <span className="text-lg">📚</span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                              {session.course_lesson?.title || session.name || "Tutoring Session"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 ml-10 font-medium">
                            {session.subject || session.course_name || "General Tutoring"}
                          </p>
                        </div>
                        {session.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm bg-blue-500">
                            {session.status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.student?.full_name || "Tutor TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">⏰</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.class_start_time && session.class_end_time ? (() => {
                              const start = new Date(session.class_start_time);
                              const end = new Date(session.class_end_time);
                              const duration = Math.round((end - start) / (1000 * 60)); // in minutes
                              return `${duration} min`;
                            })() : "Duration TBD"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-sm">📅</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">
                          {session.class_start_time ? format(new Date(session.class_start_time), "MMM d, yyyy") : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white-50 rounded-full flex items-center justify-center">
                          <span className="text-sm"><Link size={12} /></span>
                        </div>
                        {/* <span className="text-xs text-gray-700 font-semibold">
                          {session.google_meet_link || "Yet to be provided"}
                        </span> */}
                        {session.google_meet_link ? (
                          <a
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-semibold underline"
                          >
                            {session.google_meet_link}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-700 font-semibold">
                            Yet to be provided
                          </span>
                        )}
                      </div>
                      {session.description && (
                        <div className="mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                              {session.description}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">No 1:1 sessions scheduled</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Sessions will appear here when scheduled</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Group Sessions List */}
        {sessionTypeTab === 'group' && (
          <div className="p-2 sm:p-4 min-h-[160px] max-h-[60vh] sm:min-h-0 sm:max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessionsLoading ? (
              <div className="text-center text-gray-500">
                <span className="animate-spin h-5 w-5 inline-block">⏳</span>
              </div>
            ) : filteredSessions.group.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.group.map((session) => (
                  // ...existing code for group session card...
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-grab group"
                    draggable
                    onDragStart={() => handleDragStart(session)}
                  >
                    {/* ...existing code for group session card... */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <span className="text-lg">👥</span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                              {session.course_lesson?.title || session.name || "Group Session"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 ml-10 font-medium">
                            {session.subject || session.course_name || "General Tutoring"}
                          </p>
                        </div>
                        {session.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm bg-blue-500">
                            {session.status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">👥</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {/* Show all student names if available */}
                            {Array.isArray(session.students) && session.students.length > 0
                              ? session.students.map(s => s.full_name).join(', ')
                              : session.student?.full_name || "Students TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">⏰</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.class_start_time && session.class_end_time ? (() => {
                              const start = new Date(session.class_start_time);
                              const end = new Date(session.class_end_time);
                              const duration = Math.round((end - start) / (1000 * 60)); // in minutes
                              return `${duration} min`;
                            })() : "Duration TBD"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-sm">📅</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">
                          {session.class_start_time ? format(new Date(session.class_start_time), "MMM d, yyyy") : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white-50 rounded-full flex items-center justify-center">
                          <span className="text-sm"><Link size={12} /></span>
                        </div>
                        {session.google_meet_link ? (
                          <a
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-semibold underline"
                          >
                            {session.google_meet_link}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-700 font-semibold">
                            Yet to be provided
                          </span>
                        )}
                      </div>
                      {session.description && (
                        <div className="mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                              {session.description}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">No group sessions scheduled</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Sessions will appear here when scheduled</p>
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>
      {/* Pending Tab */}
      <TabsContent value="pending" className="flex-1 flex flex-col min-w-0">
        <div className="w-full flex gap-2 border-b bg-white px-2 sm:px-4 pt-2 mb-2">
          <button
            className={`px-3 py-1 rounded-t text-xs sm:text-sm font-medium focus:outline-none transition-colors ${sessionTypeTab === 'oneToOne' ? 'bg-gray-100 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSessionTypeTab('oneToOne')}
          >
            1:1 Sessions
          </button>
          <button
            className={`px-3 py-1 rounded-t text-xs sm:text-sm font-medium focus:outline-none transition-colors ${sessionTypeTab === 'group' ? 'bg-gray-100 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setSessionTypeTab('group')}
          >
            Group Sessions
          </button>
        </div>
        {/* 1:1 Pending Sessions List */}
        {sessionTypeTab === 'oneToOne' && (
          <div className="p-2 sm:p-4 min-h-[160px] max-h-[60vh] sm:min-h-0 sm:max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessionsLoading ? (
              <div className="text-center text-gray-500">
                <span className="animate-spin h-5 w-5 inline-block">⏳</span>
              </div>
            ) : filteredSessions.oneToOne.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.oneToOne.map((session) => (
                  // ...existing code for 1:1 session card...
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-grab group"
                    draggable
                    onDragStart={() => handleDragStart(session)}
                  >
                    {/* ...existing code for 1:1 session card... */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <span className="text-lg">📚</span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                              {session.course_lesson?.title || session.name || "Tutoring Session"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 ml-10 font-medium">
                            {session.subject || session.course_name || "General Tutoring"}
                          </p>
                        </div>
                        {session.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm bg-blue-500">
                            {session.status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.student?.full_name || "Tutor TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">⏰</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.class_start_time && session.class_end_time ? (() => {
                              const start = new Date(session.class_start_time);
                              const end = new Date(session.class_end_time);
                              const duration = Math.round((end - start) / (1000 * 60)); // in minutes
                              return `${duration} min`;
                            })() : "Duration TBD"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-sm">📅</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">
                          {session.class_start_time ? format(new Date(session.class_start_time), "MMM d, yyyy") : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white-50 rounded-full flex items-center justify-center">
                          <span className="text-sm"><Link size={12} /></span>
                        </div>
                        {session.google_meet_link ? (
                          <a
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-semibold underline"
                          >
                            {session.google_meet_link}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-700 font-semibold">
                            Yet to be provided
                          </span>
                        )}
                      </div>
                      {session.description && (
                        <div className="mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                              {session.description}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">No 1:1 sessions pending</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Pending sessions will appear here when requested</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Group Pending Sessions List */}
        {sessionTypeTab === 'group' && (
          <div className="p-2 sm:p-4 min-h-[160px] max-h-[60vh] sm:min-h-0 sm:max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessionsLoading ? (
              <div className="text-center text-gray-500">
                <span className="animate-spin h-5 w-5 inline-block">⏳</span>
              </div>
            ) : filteredSessions.group.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.group.map((session) => (
                  // ...existing code for group session card...
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-grab group"
                    draggable
                    onDragStart={() => handleDragStart(session)}
                  >
                    {/* ...existing code for group session card... */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-4 relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <span className="text-lg">👥</span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                              {session.course_lesson?.title || session.name || "Group Session"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 ml-10 font-medium">
                            {session.subject || session.course_name || "General Tutoring"}
                          </p>
                        </div>
                        {session.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm bg-blue-500">
                            {session.status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">👥</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {/* Show all student names if available */}
                            {Array.isArray(session.students) && session.students.length > 0
                              ? session.students.map(s => s.full_name).join(', ')
                              : session.student?.full_name || "Students TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-sm">⏰</span>
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {session.class_start_time && session.class_end_time ? (() => {
                              const start = new Date(session.class_start_time);
                              const end = new Date(session.class_end_time);
                              const duration = Math.round((end - start) / (1000 * 60)); // in minutes
                              return `${duration} min`;
                            })() : "Duration TBD"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                          <span className="text-sm">📅</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">
                          {session.class_start_time ? format(new Date(session.class_start_time), "MMM d, yyyy") : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white-50 rounded-full flex items-center justify-center">
                          <span className="text-sm"><Link size={12} /></span>
                        </div>
                        {session.google_meet_link ? (
                          <a
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-semibold underline"
                          >
                            {session.google_meet_link}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-700 font-semibold">
                            Yet to be provided
                          </span>
                        )}
                      </div>
                      {session.description && (
                        <div className="mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                              {session.description}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex flex-col gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">No group sessions pending</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Pending sessions will appear here when requested</p>
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>
      {/* Assignments Tab */}
      <TabsContent value="assignments" className="flex-1 overflow-y-auto p-0 m-0">
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
          {assignmentsLoading ? (
            <div className="text-center text-gray-500">
              <span className="animate-spin h-5 w-5 inline-block">⏳</span>
            </div>
          ) : Array.isArray(tutorAssignments) && tutorAssignments.length > 0 ? (
            <div className="space-y-3">
              {tutorAssignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-grab group relative" draggable onDragStart={() => handleDragStart(assignment)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Due: {assignment.dueDate ? format(new Date(assignment.dueDate), "MMM d, yyyy") : "No due date"}</span>
                        <span>Points: {assignment.points || 0}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-3 py-4">
              <p className="text-gray-500">No assignments available.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
