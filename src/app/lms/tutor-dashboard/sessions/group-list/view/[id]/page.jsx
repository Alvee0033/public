"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  BookOpen,
  FileText,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { AddStudentModal } from "../../_components/AddStudentModal";
import EditGroupModal from "./_components/EditGroupModal";

export default function GroupViewPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching group details for ID:", params.id);

        const response = await axios.get(
          `/group-tutoring-sessions/${params.id}`
        );
        console.log("Group details received:", response.data);

        setGroup(response.data?.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching group details:", err);
        setError(
          "Failed to load group session details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGroupDetails();
    }
  }, [params.id]);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      if (!params.id) return;

      try {
        setStudentsLoading(true);
        console.log("Fetching enrolled students for group ID:", params.id);

        // Fetch all group-student mappings and filter by group_id
        const response = await axios.get("/group-student-map");
        const allMappings = response.data?.data || [];

        // Filter mappings for current group
        const currentGroupMappings = allMappings.filter(
          (mapping) => String(mapping.group_id) === String(params.id)
        );

        console.log("Found student mappings:", currentGroupMappings);

        // Extract student information
        const students = currentGroupMappings
          .map((mapping) => mapping.student)
          .filter(Boolean);
        setEnrolledStudents(students);
      } catch (err) {
        console.error("Error fetching enrolled students:", err);
        // Don't set error state for students as it's not critical
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [params.id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionStatus = (group) => {
    if (!group) return { status: "unknown", color: "gray", icon: AlertCircle };

    const now = new Date();
    const startTime = new Date(group.start_time);
    const endTime = new Date(group.end_time);

    if (endTime < now) {
      return {
        status: "Completed",
        color: "gray",
        icon: CheckCircle,
        bgClass: "bg-gray-100 text-gray-700",
      };
    } else if (startTime <= now && endTime > now) {
      return {
        status: "Live Now",
        color: "green",
        icon: Video,
        bgClass: "bg-green-500 text-white",
      };
    } else {
      return {
        status: "Scheduled",
        color: "blue",
        icon: Calendar,
        bgClass: "bg-blue-100 text-blue-700 border-blue-300",
      };
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleJoinMeeting = () => {
    if (group?.session_link) {
      window.open(group.session_link, "_blank");
    }
  };

  const handleStudentAdded = (addedStudents) => {
    console.log("Students added to group:", addedStudents);
    // You could refetch the group data here if needed
    // fetchGroupDetails()
  };

  const handleGroupUpdated = (updatedGroup) => {
    console.log("Group updated:", updatedGroup);
    setGroup(updatedGroup);
    toast.success("Group session updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-indigo-50/30 blur-sm"></div>
              </div>
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Loading Group Session</h2>
                <p className="text-xl text-gray-600 mb-6">Please wait while we fetch your group session details...</p>
                
                {/* Enhanced loading skeleton */}
                <div className="mt-8 space-y-4 max-w-lg mx-auto">
                  <div className="h-5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded animate-pulse w-1/2 mx-auto"></div>
                </div>
                
                {/* Additional loading indicators */}
                <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 hover:bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Group Sessions
            </Button>
          </div>

          <div className="flex items-center justify-center py-20">
            <Card className="max-w-2xl w-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center py-20 px-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mx-auto flex items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-4">Group Session Not Found</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                  {error || "We couldn't find the group session you're looking for. It may have been moved, cancelled, or deleted."}
                </p>

                <div className="space-y-4">
                  <Button
                    onClick={() => router.back()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-4 rounded-xl w-full font-bold text-lg transform hover:scale-105"
                  >
                    <ArrowLeft className="w-6 h-6 mr-3" />
                    Go Back
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push('/lms/tutor-dashboard/sessions/group-list')}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-10 py-4 rounded-xl w-full font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    View All Group Sessions
                  </Button>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 grid grid-cols-3 gap-4 opacity-20">
                  <div className="h-3 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></div>
                  <div className="h-3 bg-gradient-to-r from-pink-300 to-indigo-300 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getSessionStatus(group);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 shadow-2xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 px-4 py-2 rounded-xl font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-indigo-100 text-lg font-medium mb-1">Group Tutoring Session</p>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                    {group.course_name || "Group Session"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    {group.topic && (
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-lg font-medium">{group.topic}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                      <Users className="w-5 h-5" />
                      <span className="text-lg font-medium">{enrolledStudents.length} Students</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:ml-8">
              <Badge
                className={`px-6 py-3 text-lg font-bold backdrop-blur-sm border-2 rounded-xl ${
                  statusInfo.status === "Live Now"
                    ? "animate-pulse bg-green-500 text-white border-green-400 shadow-green-500/50 shadow-lg"
                    : statusInfo.status === "Completed"
                    ? "bg-gray-500/20 text-gray-100 border-gray-400/30"
                    : "bg-blue-500/20 text-blue-100 border-blue-400/30"
                }`}
              >
                <StatusIcon className="w-6 h-6 mr-3" />
                {statusInfo.status}
              </Badge>
              
              {group.session_link && (
                <Button
                  onClick={handleJoinMeeting}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl hover:shadow-2xl px-8 py-4 h-auto rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Video className="w-6 h-6 mr-3" />
                  Join Meeting
                </Button>
              )}
            </div>
          </div>
          
          {/* Quick info bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Start Date</p>
              <p className="text-white font-bold">
                {group.start_time ? new Date(group.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
              </p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <Clock className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Duration</p>
              <p className="text-white font-bold">
                {group.start_time && group.end_time ? 
                  `${Math.round((new Date(group.end_time) - new Date(group.start_time)) / (1000 * 60))} min` : 
                  '-'
                }
              </p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <Users className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Students</p>
              <p className="text-white font-bold">{enrolledStudents.length}</p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <StatusIcon className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm font-medium">Status</p>
              <p className="text-white font-bold">{statusInfo.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-20xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Session Overview Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                <CardTitle className="text-3xl text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  Session Overview
                </CardTitle>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Start Time</span>
                    </div>
                    <p className="text-lg text-gray-600 font-semibold pl-16">
                      {group.start_time ? formatDateTime(group.start_time) : "Not scheduled"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">End Time</span>
                    </div>
                    <p className="text-lg text-gray-600 font-semibold pl-16">
                      {group.end_time ? formatDateTime(group.end_time) : "Not specified"}
                    </p>
                  </div>
                </div>

                {group.topic && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-gray-700">Session Topic</span>
                    </div>
                    <p className="text-lg text-gray-600 font-semibold pl-16">{group.topic}</p>
                  </div>
                )}
                
                {/* Session Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-900">Session Date</p>
                    <p className="text-sm text-gray-600">
                      {group.start_time ? new Date(group.start_time).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-900">Students</p>
                    <p className="text-sm text-gray-600">{enrolledStudents.length} enrolled</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <StatusIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-900">Status</p>
                    <p className="text-sm text-gray-600">{statusInfo.status}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-900">Meeting</p>
                    <p className="text-sm text-gray-600">{group.session_link ? 'Ready' : 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Information Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
                <CardTitle className="text-3xl text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  Meeting Information
                </CardTitle>
              </div>
              <CardContent className="p-8 space-y-8">
                {group.session_link ? (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <ExternalLink className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-bold text-xl text-gray-700">Session Link</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(group.session_link, "Session link")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          {copied ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-blue-100">
                        <p className="text-base text-gray-600 break-all font-mono">{group.session_link}</p>
                      </div>
                    </div>

                    {group.session_password && (
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                              <Copy className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-700">Meeting Password</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(group.session_password, "Meeting password")}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            {copied ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <p className="text-xl text-gray-800 font-bold text-center tracking-wider">{group.session_password}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        onClick={handleJoinMeeting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <Video className="w-8 h-8 mr-4" />
                        Join Meeting Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Meeting Link Available</h3>
                    <p className="text-lg text-gray-500">The meeting link will be provided before the session starts.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Details Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8">
                <CardTitle className="text-3xl text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  Additional Details
                </CardTitle>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center border border-blue-200">
                    <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-600 mb-2">Created</p>
                    <p className="text-sm text-gray-800 font-bold">
                      {group.created_at ? new Date(group.created_at).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 text-center border border-purple-200">
                    <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-600 mb-2">Last Updated</p>
                    <p className="text-sm text-gray-800 font-bold">
                      {group.updated_at ? new Date(group.updated_at).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 text-center border border-green-200">
                    <FileText className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-600 mb-2">Session ID</p>
                    <p className="text-sm text-gray-800 font-bold font-mono">#{group.id || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Quick Info */}
          <div className="space-y-8">
            
            {/* Quick Actions Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-6">
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Edit className="w-6 h-6 mr-3" />
                  Edit Session
                </Button>

                <Button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-6 h-6 mr-3" />
                  Add Students
                </Button>
                
                <Button
                  onClick={() => router.push('/lms/tutor-dashboard/sessions/group-list')}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-6 h-6 mr-3" />
                  Back to All Sessions
                </Button>
              </CardContent>
            </Card>
            
            {/* Enrolled Students Card */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Enrolled Students
                  <Badge className="bg-white/20 text-white px-3 py-1 ml-auto rounded-full font-bold">
                    {enrolledStudents.length}
                  </Badge>
                </CardTitle>
              </div>
              <CardContent className="p-6">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-500 mx-auto mb-4"></div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Loading Students</h3>
                      <p className="text-gray-500">Fetching enrolled student information...</p>
                    </div>
                  </div>
                ) : enrolledStudents.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-200 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <UserPlus className="w-12 h-12 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Students Enrolled</h3>
                    <p className="text-lg text-gray-500 mb-6">Start building your group by adding students to this session.</p>
                    <Button
                      onClick={() => setIsAddStudentModalOpen(true)}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Add First Student
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {enrolledStudents.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                          index % 4 === 0
                            ? "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:border-blue-300"
                            : index % 4 === 1
                            ? "bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 hover:border-purple-300"
                            : index % 4 === 2
                            ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:border-green-300"
                            : "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:border-orange-300"
                        }`}
                      >
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            index % 4 === 0
                              ? "bg-gradient-to-br from-blue-400 to-blue-600"
                              : index % 4 === 1
                              ? "bg-gradient-to-br from-purple-400 to-purple-600"
                              : index % 4 === 2
                              ? "bg-gradient-to-br from-green-400 to-green-600"
                              : "bg-gradient-to-br from-orange-400 to-orange-600"
                          }`}
                        >
                          <span className="text-white text-xl font-bold">
                            {student.full_name?.charAt(0) || 
                             student.first_name?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg text-gray-800 truncate mb-1">
                            {student.full_name ||
                              (student.first_name && student.last_name
                                ? `${student.first_name} ${student.last_name}`
                                : "Unknown Student")}
                          </p>
                          {student.email_address && (
                            <p className="text-sm text-gray-600 truncate font-medium">
                              {student.email_address}
                            </p>
                          )}
                          {student.mobile_number && (
                            <p className="text-xs text-gray-500 font-medium">
                              {student.mobile_number}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <Badge className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full font-semibold">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        group={group}
        onGroupUpdated={handleGroupUpdated}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        groupId={params.id}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
}
