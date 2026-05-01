"use client";

// Update imports to include the new filter functions
import {
  getApprovedCompletedSessions,
  getApprovedPendingSessions,
  getRequestedCompletedSessions,
  getRequestedPendingSessions,
  useStudentExams,
  useStudentTutoringSessions,
} from "../_context/ScheduleContext";
import { useAppSelector } from "@/redux/hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  FlaskRoundIcon as Flask,
  Loader2,
  Trash,
  User,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIAgentChat } from "./ai-agent-chat";
import { InstantTutoringModal } from "./instant-tutoring-modal";

const tabs = [
  {
    id: "tutoring",
    label: "Online Season 1:1",
    icon: User,
    color: "bg-blue-500",
    lightColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    id: "group",
    label: "Group Classes",
    icon: Users,
    color: "bg-green-500",
    lightColor: "bg-green-50 border-green-200",
    textColor: "text-green-700",
  },
  {
    id: "lesson",
    label: "Self Learning",
    icon: BookOpen,
    color: "bg-purple-500",
    lightColor: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
  },
  {
    id: "scholarpass",
    label: "ScholarPASS Lab",
    icon: Flask,
    color: "bg-teal-500",
    lightColor: "bg-teal-50 border-teal-200",
    textColor: "text-teal-700",
  },
  // {
  //   id: "assessment",
  //   label: "Assessments",
  //   icon: FileText,
  //   color: "bg-orange-500",
  //   lightColor: "bg-orange-50 border-orange-200",
  //   textColor: "text-orange-700",
  // },
  {
    id: "exam",
    label: "Exams",
    icon: Award,
    color: "bg-red-500",
    lightColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
  },
];

export function ActivitySidebar({ events, selectedTab, onTabChange }) {
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);
  
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const router = useRouter();
  const { data: exams, loading: examsLoading } = useStudentExams();
  const { sessions, loading, fetchSessions } = useStudentTutoringSessions();

  // Ref for horizontal scroll container
  const scrollContainerRef = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Define session categories based on status flags (move out of block so they are visible to the component)
  const requestedPendingSessions = getRequestedPendingSessions(sessions);
  const requestedCompletedSessions = getRequestedCompletedSessions(sessions);
  const approvedPendingSessions = getApprovedPendingSessions(sessions);
  const approvedCompletedSessions = getApprovedCompletedSessions(sessions);

  // current tutoring session count and limit
  const sessionCount = Array.isArray(sessions) ? sessions.length : 0;
  const SESSION_LIMIT = 10;

  // badge/count helper
  const getTabCount = (tabId) => {
    // Force zero for tabs without reliable backend counts
    const zeroTabs = new Set(["group", "lesson", "scholarpass", "assessment"]);
    if (zeroTabs.has(tabId)) return 0;

    if (tabId === "tutoring") {
      // show "current / limit" for tutoring
      return `${sessionCount} / ${SESSION_LIMIT}`;
    }
    if (tabId === "exam") {
      return Array.isArray(exams) ? exams.length : 0;
    }

    // fallback: defensive event counting
    const list = Array.isArray(events) ? events : [];
    return list.filter((e) => e.type === tabId).length;
  };

  // Add state for group classes
  const [groupSessions, setGroupSessions] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);

  // Define group session categories
  const upcomingGroupSessions = Array.isArray(groupSessions)
    ? groupSessions.filter(
        (session) =>
          session.class_date && new Date(session.class_date) >= new Date()
      )
    : [];

  const pastGroupSessions = Array.isArray(groupSessions)
    ? groupSessions.filter(
        (session) =>
          session.class_date && new Date(session.class_date) < new Date()
      )
    : [];

  // Exam categories
  const upcomingExams = Array.isArray(exams)
    ? exams.filter((exam) => exam.is_taken === false)
    : [];
  const completedExams = Array.isArray(exams)
    ? exams.filter((exam) => exam.is_taken === true)
    : [];

  const tutoringSessions =
    selectedTab === "tutoring" && Array.isArray(sessions) ? sessions : [];

  // Function to fetch group sessions
  const fetchGroupSessions = async () => {
    try {
      setGroupLoading(true);
      if (!user?.student_id) {
        console.warn("Cannot fetch group sessions: No student ID available");
        setGroupLoading(false);
        return;
      }

      console.log("Fetching group sessions for student:", user.student_id);
      const data = await fetchGroupTutoringSessions(user.student_id);
      console.log("Group sessions fetched:", data.length);
      setGroupSessions(data || []);
    } catch (error) {
      console.error("Error fetching group sessions:", error);
    } finally {
      setGroupLoading(false);
    }
  };

  // Update handleTabChange to handle group tab
  const handleTabChange = (tabId) => {
    // Call the parent component's tab change handler
    onTabChange(tabId);

    // If selecting tutoring tab, immediately fetch sessions
    if (tabId === "tutoring") {
      console.log("Tutoring tab clicked, fetching sessions...");
      setTimeout(() => {
        fetchSessions();
      }, 100);
    }

    // If selecting group classes tab, fetch group sessions
    if (tabId === "group") {
      console.log("Group Classes tab clicked, fetching group sessions...");
      setTimeout(() => {
        fetchGroupSessions();
      }, 100);
    }

    // For exams tab, we don't need to fetch data explicitly
    if (tabId === "exam") {
      console.log("Exams tab clicked, data loaded via useStudentExams hook");
    }
  };

  // Add effect to fetch group sessions when tab is selected
  useEffect(() => {
    if (selectedTab === "group") {
      console.log("Group tab selected, fetching latest group sessions data");
      fetchGroupSessions();
    }
  }, [selectedTab]);

  // Log the response when the tutoring tab is selected and data changes
  useEffect(() => {
    if (selectedTab === "tutoring" && Array.isArray(tutoringSessions)) {
      console.log("Tutoring Sessions:", tutoringSessions);
    }
  }, [selectedTab, tutoringSessions]);

  // Session tracking data
  const totalSessions = 60;
  const usedSessions = 34;
  const remainingSessions = 23;

  const getTabEvents = (tabId) => {
    return events
      .filter((event) => event.type === tabId)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const selectedTabData = tabs.find((tab) => tab.id === selectedTab);
  const [selectedSession, setSelectedSession] = useState(null);
  const [copied, setCopied] = useState(false);

  // Reusable card and title classes for fetched-data items
  const cardClass =
    "group relative w-full max-w-full p-3 rounded-xl bg-white border border-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer overflow-hidden";
  const titleClass =
    "font-semibold text-gray-900 text-[14px] leading-tight mb-1 truncate";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Add this function
  const handleDeleteSession = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`/student-tutoring-sessions/${id}`);
      fetchSessions(); // Refresh the sessions list
    } catch (err) {
      alert("Failed to delete session.");
    }
  };

  // Replace your existing effect with this more robust version
  useEffect(() => {
    if (selectedTab === "tutoring") {
      console.log("Tutoring tab selected, fetching latest sessions data");

      // Small delay to ensure any state updates have completed
      const timer = setTimeout(() => {
        fetchSessions();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [selectedTab, fetchSessions]);

  // Mouse wheel scroll handler
  const handleWheel = (e) => {
    if (scrollContainerRef[0]) {
      e.preventDefault();
      scrollContainerRef[0].scrollLeft += e.deltaY;
    }
  };

  // Mouse drag scroll handlers
  const handleMouseDown = (e) => {
    if (scrollContainerRef[0]) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef[0].offsetLeft);
      setScrollLeft(scrollContainerRef[0].scrollLeft);
      scrollContainerRef[0].style.cursor = "grabbing";
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef[0]) {
      scrollContainerRef[0].style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef[0]) {
      scrollContainerRef[0].style.cursor = "grab";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef[0]) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef[0].offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef[0].scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}
      </style>
      <div className="w-full md:w-[300px] lg:w-[320px] xl:w-[340px] border-r border-gray-200 flex flex-col md:shrink-0 h-[1084px] max-h-[1084px] min-h-[1084px]">
        {/* Tab Navigation - Horizontal Scrollable */}
        <div className="border-b border-gray-200 bg-white px-2 py-2 overflow-hidden">
          <div
            ref={(el) => (scrollContainerRef[0] = el)}
            className="overflow-x-auto overflow-y-hidden hide-scrollbar"
            style={{ scrollBehavior: "smooth", cursor: "grab" }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div
              className="flex gap-1.5 pb-1"
              style={{ minWidth: "max-content" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isSelected ? "default" : "ghost"}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-full transition-all ${
                      isSelected
                        ? `${tab.color} text-white hover:${tab.color}/90 hover:text-white shadow-md`
                        : "text-gray-800 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => {
                      // navigate to documents page when documents tab is clicked
                      if (tab.id === "documents") {
                        router.push("/lms/student-dashboard/documents");
                        return;
                      }
                      handleTabChange(tab.id);
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium whitespace-nowrap">
                      {tab.label}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`ml-0.5 text-[9px] px-1.5 py-0 h-4 ${
                        isSelected
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-white text-gray-700 border border-gray-200"
                      }`}
                    >
                      {getTabCount(tab.id)}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Tab Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTabData && (
            <div className={`p-2 ${selectedTabData.lightColor} border-b`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <selectedTabData.icon
                    className={`w-4 h-4 mr-1.5 ${selectedTabData.textColor}`}
                  />
                  <h3
                    className={`text-sm font-semibold ${selectedTabData.textColor}`}
                  >
                    {selectedTabData.label}
                  </h3>
                </div>

                {/* Session Tracking for Tutoring Tab */}
                {selectedTab === "tutoring" && <InstantTutoringModal />}
              </div>

              {/* No static demo data below! */}
            </div>
          )}

          {/* Events List */}
          <ScrollArea className="flex-1 hide-scrollbar max-h-[920px] overflow-y-auto overflow-x-hidden bg-white">
            {/* Show exam content when exam tab is selected */}
            {selectedTab === "exam" ? (
              <div className="grid gap-6 h-full min-h-[744px] bg-white p-2 w-full">
                {/* Upcoming Exams */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 my-2">
                    Upcoming Exams
                  </h4>
                  {examsLoading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                    </div>
                  ) : upcomingExams.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {upcomingExams.map((exam) => (
                        <div key={exam.id} className={cardClass}>
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Upcoming
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[80px] min-w-0">
                            <div className={titleClass}>
                              {exam.exam_title || exam.title || "Untitled Exam"}
                            </div>

                            <div className="text-[11px] text-gray-700 leading-snug mb-1">
                              <span className="font-medium">Type:</span>{" "}
                              {exam.exam_type || "Standard"}
                            </div>

                            {exam.schedule_exam_date_time && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    exam.schedule_exam_date_time
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No upcoming exams</p>
                    </div>
                  )}
                </section>

                {/* Completed Exams */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 mt-8 mb-2">
                    Completed Exams
                  </h4>
                  {examsLoading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                    </div>
                  ) : completedExams.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {completedExams.map((exam) => (
                        <div key={exam.id} className={cardClass}>
                          {/* Score Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {exam.exam_points || 0}%
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[65px] min-w-0">
                            <div className={titleClass}>
                              {exam.exam_title || exam.title || "Untitled Exam"}
                            </div>

                            {exam.taken_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(exam.taken_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No completed exams</p>
                    </div>
                  )}
                </section>
              </div>
            ) : selectedTab === "group" ? (
              // Group Classes content - new section
              <div className="grid gap-6 h-full min-h-[744px] bg-white p-2 w-full">
                {/* Upcoming Group Sessions */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 my-2">
                    Upcoming Group Classes
                  </h4>
                  {groupLoading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                    </div>
                  ) : upcomingGroupSessions.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {upcomingGroupSessions.map((session) => (
                        <div key={session.id} className={cardClass}>
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Upcoming
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[80px] min-w-0">
                            <div className={titleClass}>
                              {session.group_name ||
                                session.title ||
                                "Untitled Group Class"}
                            </div>

                            {session.tutor?.name && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate">
                                <span className="font-medium">Tutor:</span>{" "}
                                {session.tutor.name}
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}

                            {session.google_meet_link && (
                              <a
                                href={session.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-green-600 hover:text-green-700 mt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video className="w-3 h-3 shrink-0" />
                                Join
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No upcoming group classes</p>
                    </div>
                  )}
                </section>

                {/* Past Group Sessions */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 mt-8 mb-2">
                    Completed Group Classes
                  </h4>
                  {groupLoading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                    </div>
                  ) : pastGroupSessions.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {pastGroupSessions.map((session) => (
                        <div key={session.id} className={cardClass}>
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[88px] min-w-0">
                            <div className={titleClass}>
                              {session.group_name ||
                                session.title ||
                                "Untitled Group Class"}
                            </div>

                            {session.tutor?.name && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate">
                                <span className="font-medium">Tutor:</span>{" "}
                                {session.tutor.name}
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No completed group classes</p>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              // Tutoring tab content remains the same
              <div className="grid gap-6 h-full min-h-[744px] bg-white p-2 w-full">
                {/* REQUESTED PENDING SESSIONS - Requested but not yet completed */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 my-2">
                    Pending Tutoring Requests
                  </h4>
                  {loading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : requestedPendingSessions.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {requestedPendingSessions.map((session) => (
                        <div
                          key={session.id}
                          className={cardClass}
                          onClick={() => setSelectedSession(session)}
                        >
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                            <button
                              type="button"
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 transition-opacity"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session.id);
                              }}
                            >
                              <Trash className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="pr-[88px] min-w-0">
                            {session.course && (
                              <div className={titleClass}>
                                {session.course.name || "No course"}
                              </div>
                            )}

                            {session.course_module && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate flex items-center gap-1">
                                <span className="shrink-0 text-amber-600">
                                  📚
                                </span>
                                <span className="truncate">
                                  {session.course_module.title || "No module"}
                                </span>
                              </div>
                            )}

                            {session.course_lesson && (
                              <div className="text-[10px] text-gray-600 leading-snug truncate flex items-center gap-1">
                                <span className="shrink-0 text-amber-500">
                                  📖
                                </span>
                                <span className="truncate">
                                  {session.course_lesson.title || "No lesson"}
                                </span>
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}

                            {session.google_meet_link && (
                              <a
                                href={session.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 mt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video className="w-3 h-3 shrink-0" />
                                Join
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No pending requests</p>
                    </div>
                  )}
                </section>

                {/* APPROVED PENDING SESSIONS - Approved but not yet completed */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 mt-4 mb-2">
                    Upcoming Tutoring Sessions
                  </h4>
                  {loading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : approvedPendingSessions.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {approvedPendingSessions.map((session) => (
                        <div
                          key={session.id}
                          className={cardClass}
                          onClick={() => setSelectedSession(session)}
                        >
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Scheduled
                            </span>
                            <button
                              type="button"
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 transition-opacity"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session.id);
                              }}
                            >
                              <Trash className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="pr-[88px] min-w-0">
                            {session.course && (
                              <div className={titleClass}>
                                {session.course.name || "No course"}
                              </div>
                            )}

                            {session.course_module && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate flex items-center gap-1">
                                <span className="shrink-0 text-blue-600">
                                  📚
                                </span>
                                <span className="truncate">
                                  {session.course_module.title || "No module"}
                                </span>
                              </div>
                            )}

                            {session.course_lesson && (
                              <div className="text-[10px] text-gray-600 leading-snug truncate flex items-center gap-1">
                                <span className="shrink-0 text-blue-500">
                                  📖
                                </span>
                                <span className="truncate">
                                  {session.course_lesson.title || "No lesson"}
                                </span>
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}

                            {session.google_meet_link && (
                              <a
                                href={session.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 mt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video className="w-3 h-3 shrink-0" />
                                Join
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No upcoming sessions</p>
                    </div>
                  )}
                </section>

                {/* COMPLETED SESSIONS - Combine approved and requested completed sessions */}
                <section className="grid grid-rows-[auto_1fr] flex-1 min-h-0 w-full">
                  <h4 className="font-medium text-gray-900 mt-8 mb-2">
                    Completed Sessions
                  </h4>
                  {loading ? (
                    <div className="flex justify-center items-center py-8 flex-1">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : approvedCompletedSessions.length > 0 ||
                    requestedCompletedSessions.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden grid gap-2 hide-scrollbar max-h-[calc(8*8rem)] w-full">
                      {/* Approved Completed */}
                      {approvedCompletedSessions.map((session) => (
                        <div
                          key={session.id}
                          className={cardClass}
                          onClick={() => setSelectedSession(session)}
                        >
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[88px] min-w-0">
                            {session.course && (
                              <div className={titleClass}>
                                {session.course.name || "No course"}
                              </div>
                            )}

                            {session.course_module && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate flex items-center gap-1">
                                <span className="shrink-0 text-emerald-600">
                                  📚
                                </span>
                                <span className="truncate">
                                  {session.course_module.title || "No module"}
                                </span>
                              </div>
                            )}

                            {session.course_lesson && (
                              <div className="text-[10px] text-gray-600 leading-snug truncate flex items-center gap-1">
                                <span className="shrink-0 text-emerald-500">
                                  📖
                                </span>
                                <span className="truncate">
                                  {session.course_lesson.title || "No lesson"}
                                </span>
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Requested Completed */}
                      {requestedCompletedSessions.map((session) => (
                        <div
                          key={session.id}
                          className={cardClass}
                          onClick={() => setSelectedSession(session)}
                        >
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Closed
                            </span>
                          </div>

                          {/* Content */}
                          <div className="pr-[70px] min-w-0">
                            {session.course && (
                              <div className={titleClass}>
                                {session.course.name || "No course"}
                              </div>
                            )}

                            {session.course_module && (
                              <div className="text-[11px] text-gray-700 leading-snug mb-0.5 truncate flex items-center gap-1">
                                <span className="shrink-0 text-orange-600">
                                  📚
                                </span>
                                <span className="truncate">
                                  {session.course_module.title || "No module"}
                                </span>
                              </div>
                            )}

                            {session.course_lesson && (
                              <div className="text-[10px] text-gray-600 leading-snug truncate flex items-center gap-1">
                                <span className="shrink-0 text-orange-500">
                                  📖
                                </span>
                                <span className="truncate">
                                  {session.course_lesson.title || "No lesson"}
                                </span>
                              </div>
                            )}

                            {session.class_date && (
                              <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {new Date(
                                    session.class_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 flex-1">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No completed sessions</p>
                    </div>
                  )}
                </section>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <AIAgentChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      <Dialog
        open={!!selectedSession}
        onOpenChange={() => {
          setSelectedSession(null);
          setCopied(false);
        }}
      >
        <DialogContent className="backdrop-blur-sm bg-white/90">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              {/* Course info */}
              {selectedSession.course && (
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Course</h3>
                  <p className="text-sm">{selectedSession.course.name}</p>
                </div>
              )}

              {/* Module info */}
              {selectedSession.course_module && (
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Module</h3>
                  <p className="text-sm">
                    {selectedSession.course_module.title}
                  </p>
                </div>
              )}

              {/* Lesson info */}
              {selectedSession.course_lesson && (
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Lesson</h3>
                  <p className="text-sm">
                    {selectedSession.course_lesson.title}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Status</h3>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      selectedSession.is_requested
                        ? selectedSession.completed_or_cancelled
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                        : selectedSession.completed_or_cancelled
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedSession.is_requested
                      ? selectedSession.completed_or_cancelled
                        ? "Closed Request"
                        : "Pending Request"
                      : selectedSession.completed_or_cancelled
                      ? "Completed"
                      : "Scheduled"}
                  </span>
                </div>
              </div>

              {/* Date/Time */}
              {selectedSession.class_date && (
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Schedule</h3>
                  <p className="text-sm">
                    {new Date(selectedSession.class_date).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Google Meet */}
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Google Meet Link</h3>
                {selectedSession.google_meet_link ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedSession.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline break-all"
                    >
                      {selectedSession.google_meet_link}
                    </a>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-blue-50"
                      onClick={() =>
                        handleCopy(selectedSession.google_meet_link)
                      }
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4 text-blue-500" />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-xs ml-1">
                        Copied!
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No meeting link available
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDeleteSession(selectedSession.id);
                    setSelectedSession(null);
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Session
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
