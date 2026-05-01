"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, DollarSign, User, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchStudents,
  getRequestedPendingSessions,
  useStudentId,
  useStudentTutoringSessions,
} from "../_context/ScheduleContext";
import { AIAgentChat } from "./ai-agent-chat";
import { InstantTutoringModal } from "./instant-tutoring-modal";

export function StudentProfileHeader() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const studentId = useStudentId();
  const { sessions } = useStudentTutoringSessions();
  const pendingRequests = getRequestedPendingSessions(sessions);

  // session count + request capability (limit 10)
  const sessionCount = Array.isArray(sessions) ? sessions.length : 0;
  const canRequest = sessionCount < 10;

  useEffect(() => {
    async function getStudent() {
      if (!studentId) return;
      try {
        const data = await fetchStudents(studentId);
        setStudent(data);
      } catch (e) {
        setStudent(null);
      }
    }
    getStudent();
  }, [studentId]);

  // Fallbacks for missing data
  const firstName = student?.first_name || "-";
  const lastName = student?.last_name || "";
  const grade = student?.master_k12_grade || "-";
  const address = student?.full_address || "-";
  const scholarPass =
    student?.scholar_pass_amount != null
      ? `$${student.scholar_pass_amount}`
      : "-";
  const mentor = student?.assigned_employee || "-";

  return (
    <>
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-col lg:flex-row items-center justify-between lg:space-x-4">
            {/* Left side - Student Info */}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                My Learning Calendar
              </h2>
              <p className="text-gray-600 text-sm my-2">
                Track your academic journey
              </p>
            </div>

            {/* center side - Student Info */}
            {/* <div className="items-center space-x-4 mb-4 sm:mb-0 flex flex-col lg:flex-row lg:flex">
              <Avatar className="w-16 h-16">
                <AvatarImage src={student?.profile_picture || "/images/placeholder-user.jpg"} alt={student?.full_name || `${student?.first_name || ""} ${student?.last_name || ""}`} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                  {(student?.first_name?.[0] || "-")}{(student?.last_name?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 mt-2 lg:mt-0">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-gray-900">{student?.full_name || `${student?.first_name || "-"} ${student?.last_name || ""}`}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {student?.master_k12_grade || "-"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{student?.full_address || "-"}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span className="font-medium">Email:</span>
                  <span>{student?.email_address || "-"}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span className="font-medium">Mobile:</span>
                  <span>{student?.mobile_number || "-"}</span>
                </div>
              </div>
            </div> */}

            {/* Right side - Action Button & Stats */}
            {/* <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex md:gap-3 lg:flex-row items-center space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-3 w-full sm:w-auto">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">1:1 Sessions</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-blue-600">
                      {sessionCount} / 10
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                {canRequest ? (
                  <InstantTutoringModal />
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    Limit reached
                  </Button>
                )}
              </div>
              <div className="block md:hidden">
                {canRequest ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                  >
                    Request Tutoring
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-xs px-2 py-1"
                  >
                    Limit reached
                  </Button>
                )}
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 w-full sm:w-auto">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-xs font-medium text-gray-700">
                        ScholarPASS
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-green-600">
                          {scholarPass}
                        </span>
                        {student?.scholar_pass_amount ? (
                          <Badge className="bg-green-500 text-white text-xs px-2 py-0">
                            Active
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 w-full sm:w-auto">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-medium text-gray-700">
                        Success Mentor
                      </div>
                      <div className="text-sm font-semibold text-purple-700">
                        {mentor}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>

      {/* AI Chat modal is now rendered in the global header */}
    </>
  );
}
