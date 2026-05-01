"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isValid, parseISO } from "date-fns"
import { Calendar, FileText, Laptop, Layers, Video } from "lucide-react"

export function TutoringSessionCard({ session }) {
    // Format date if available, otherwise show "Not scheduled"
    const formatDate = (dateString) => {
        if (!dateString) return "Not scheduled";
        const date = parseISO(dateString);
        return isValid(date) ? format(date, "MMM d, yyyy") : "Not scheduled";
    }

    // Format time if available
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const time = parseISO(timeString);
        return isValid(time) ? format(time, "h:mm a") : "";
    }

    // Get status badge
    const getStatusBadge = () => {
        if (session.is_requested) {
            return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
        }

        const now = new Date();
        const sessionDate = session.class_date ? parseISO(session.class_date) : null;

        if (!isValid(sessionDate)) {
            return <Badge className="bg-gray-500 hover:bg-gray-600">Not Scheduled</Badge>
        }

        if (sessionDate < now) {
            return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        }

        return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">
                        Tutoring Session
                    </CardTitle>
                    {getStatusBadge()}
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
                {/* Course details */}
                <div className="flex items-start gap-2">
                    <Laptop className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium">
                            {session.course?.name || "No course selected"}
                        </p>
                    </div>
                </div>

                {/* Module details */}
                <div className="flex items-start gap-2">
                    <Layers className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                        <p className="text-sm text-slate-600">
                            {session.course_module?.title || "No module selected"}
                        </p>
                    </div>
                </div>

                {/* Lesson details */}
                <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                        <p className="text-sm text-slate-600">
                            {session.course_lesson?.title || "No lesson selected"}
                        </p>
                    </div>
                </div>

                {/* Date and time if available */}
                {session.class_date && (
                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-600">
                                {formatDate(session.class_date)}
                                {session.class_start_time && (
                                    <span className="ml-1">at {formatTime(session.class_start_time)}</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Google Meet link if available */}
                {session.google_meet_link && (
                    <div className="flex items-start gap-2">
                        <Video className="h-4 w-4 text-slate-500 mt-0.5" />
                        <a
                            href={session.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Join Google Meet
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}