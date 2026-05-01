"use client"

import { cn } from "@/lib/utils"
import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth } from "date-fns"
import React from "react"

export function MonthView({ selectedDate, scheduledTasks, onDragOver, onDrop, onSelectDate }) {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    // Add days from previous and next month to fill the calendar grid
    const firstDayOfMonth = monthStart.getDay() || 7 // 1-7 (Monday-Sunday)
    const lastDayOfMonth = monthEnd.getDay() || 7

    // Calculate days needed before the first day of the month
    const daysFromPrevMonth = firstDayOfMonth - 1

    // Calculate days needed after the last day of the month
    const daysFromNextMonth = 7 - lastDayOfMonth

    // Create a full calendar grid with days from previous and next months
    const calendarDays = []

    // Add days from previous month
    for (let i = daysFromPrevMonth; i > 0; i--) {
        const date = new Date(monthStart)
        date.setDate(date.getDate() - i)
        calendarDays.push(date)
    }

    // Add days from current month
    calendarDays.push(...monthDays)

    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
        const date = new Date(monthEnd)
        date.setDate(date.getDate() + i)
        calendarDays.push(date)
    }

    // Group days into weeks
    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7))
    }

    // Show all sessions/tasks (approved and pending)
    const allTasks = Array.isArray(scheduledTasks) ? scheduledTasks : [];

    // Get tasks/sessions for a specific day (support class_start_time for sessions)
    const getTasksForDay = (date) => {
        return allTasks.filter((task) => {
            if (task?.class_start_time) {
                const sessionDate = new Date(task.class_start_time);
                return (
                    sessionDate.getFullYear() === date.getFullYear() &&
                    sessionDate.getMonth() === date.getMonth() &&
                    sessionDate.getDate() === date.getDate()
                );
            } else if (task?.start_date_time) {
                const taskDate = new Date(task.start_date_time);
                return (
                    taskDate.getFullYear() === date.getFullYear() &&
                    taskDate.getMonth() === date.getMonth() &&
                    taskDate.getDate() === date.getDate()
                );
            } else if (task?.date) {
                const formattedDate = format(date, "yyyy-MM-dd");
                return task.date === formattedDate;
            }
            return false;
        });
    }

    // Handle dropping a task on a day
    const handleDropOnDay = (e, date) => {
        e.preventDefault();
        // Pass the drop event up to parent (TutorDashboardClient)
        onDrop("9:00", date);
    }

    // Group tasks by type
    const getTasksByType = (tasks, type) => {
        return tasks.filter((task) => task.type === type)
    }
    // Function to generate a random color
    const getRandomColor = () => {
        const colors = ["border-red-400", "border-green-400", "border-blue-400", "border-yellow-400", "border-purple-400"]
        return colors[Math.floor(Math.random() * colors.length)]
    }
    return (
        <div className="flex-1 p-4 pb-16">
            <div className="grid grid-cols-7 gap-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)', minHeight: 0 }}>
                {/* Day headers */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                    <div key={idx} className="text-center font-medium p-2 text-gray-500">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {weeks.map((week, weekIndex) => (
                    <React.Fragment key={weekIndex}>
                        {week.map((day, idx) => {
                            const tasksForDay = getTasksForDay(day)
                            const isCurrentMonth = isSameMonth(day, selectedDate)
                            const isToday = isSameDay(day, new Date())

                            const taskTasks = getTasksByType(tasksForDay, "task")
                            const tutoringTasks = getTasksByType(tasksForDay, "tutoring")

                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "border rounded-md min-h-[120px] p-1 relative",
                                        !isCurrentMonth && "bg-gray-50 text-gray-400",
                                        isToday && "border-blue-400",
                                        "hover:border-blue-300 transition-colors",
                                    )}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => handleDropOnDay(e, day)}
                                    onClick={() => onSelectDate(day)}
                                >
                                    <div className="text-right p-1">
                                        <span
                                            className={cn(
                                                "inline-block w-6 h-6 text-center rounded-full",
                                                isToday && "bg-blue-500 text-white",
                                            )}
                                        >
                                            {format(day, "d")}
                                        </span>
                                    </div>

                                    <div className="space-y-1 mt-1">
                                        {/* Tasks */}


                                        {tasksForDay
                                            .sort((a, b) => {
                                                // Prefer class_start_time, fallback to start_date_time
                                                const aTime = a.class_start_time || a.start_date_time;
                                                const bTime = b.class_start_time || b.start_date_time;
                                                return new Date(aTime) - new Date(bTime);
                                            })
                                            .slice(0, 2)
                                            .map((session, idx) => {
                                                const start = session.class_start_time ? new Date(session.class_start_time) : (session.start_date_time ? new Date(session.start_date_time) : null);
                                                const end = session.class_end_time ? new Date(session.class_end_time) : (session.end_date_time ? new Date(session.end_date_time) : null);
                                                const isValidDate = (date) => date instanceof Date && !isNaN(date);
                                                // Determine session type (1:1 or Group)
                                                let sessionType = null;
                                                if (session.course_master_lesson && session.course_master_lesson.name) {
                                                    if (session.course_master_lesson.name.toLowerCase().includes('1:1')) {
                                                        sessionType = '1:1';
                                                    } else if (session.course_master_lesson.name.toLowerCase().includes('group')) {
                                                        sessionType = 'Group';
                                                    } else {
                                                        sessionType = session.course_master_lesson.name;
                                                    }
                                                }
                                                // Icon for approval status
                                                const isApproved = session.is_requested === false;
                                                return (
                                                    <div
                                                        key={idx}
                                                        style={{ borderLeft: isApproved ? `4px solid #22c55e` : `4px solid #fbbf24` }}
                                                        className={cn(
                                                            "text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-50",
                                                            isApproved ? "bg-green-50" : "bg-yellow-50"
                                                        )}
                                                        title={
                                                            isValidDate(start) && isValidDate(end)
                                                                ? `${session.course_lesson?.title || session.name || session.title || "Session"} (${format(start, "EEE, MMM d, HH:mm")} - ${format(end, "HH:mm")})`
                                                                : session.course_lesson?.title || session.name || session.title || "Session"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {/* Approval status icon */}
                                                            {isApproved ? (
                                                                <span title="Approved" className="text-green-500" style={{ fontSize: '14px' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                </span>
                                                            ) : (
                                                                <span title="Pending" className="text-orange-500" style={{ fontSize: '14px' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                            {sessionType && (
                                                                <div className={
                                                                    sessionType === '1:1'
                                                                        ? 'px-1 rounded bg-blue-100 text-blue-700 border border-blue-300 text-[10px] font-semibold w-fit'
                                                                        : 'px-1 rounded bg-purple-100 text-purple-700 border border-purple-300 text-[10px] font-semibold w-fit'
                                                                }>
                                                                    {sessionType}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="font-bold">
                                                            {session.course_lesson?.title || session.name || session.title || "Session"}
                                                        </div>
                                                        {isValidDate(start) && isValidDate(end) && (
                                                            <div className="text-gray-500 text-xs">
                                                                {format(start, "HH:mm")} - {format(end, "HH:mm")}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                        {tasksForDay.length > 2 && (
                                            <div className="text-xs text-gray-500 pl-1">+{tasksForDay.length - 2} more tasks</div>
                                        )}

                                        {/* Tutoring */}
                                        {tutoringTasks.slice(0, 2).map((task, idx) => (
                                            <div
                                                key={idx}
                                                className={cn("text-xs p-1 rounded truncate border-l-2 border-blue-400", task.color)}
                                                title={`${task.title} (${task.startTime} - ${task.endTime})`}
                                            >
                                                {task.title}
                                            </div>
                                        ))}

                                        {tutoringTasks.length > 2 && (
                                            <div className="text-xs text-blue-500 pl-1">+{tutoringTasks.length - 2} more tutoring</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
