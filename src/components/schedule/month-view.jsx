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

    // Get tasks for a specific day
    const getTasksForDay = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd")
        return scheduledTasks.filter(task => {
            // Try to get a valid date from any available date field
            let taskDate;
            try {
                taskDate = new Date(
                    task.start_date_time ||
                    task.startTime ||
                    task.date ||
                    task.due_date ||
                    task.exam_date ||
                    task.class_date ||
                    task.assign_date
                );
            } catch (e) {
                return false; // Skip tasks with invalid dates
            }

            // Check if the task date matches the current calendar day
            if (taskDate && !isNaN(taskDate.getTime())) {
                return format(taskDate, "yyyy-MM-dd") === formattedDate;
            }

            return false;
        });
    }

    // Handle dropping a task on a day
    const handleDropOnDay = (e, date) => {
        e.preventDefault()
        // Default to 9:00 AM when dropping on a day in month view
        onDrop("9:00", date)
    }

    // Get task color based on type
    const getTaskColor = (task) => {
        switch (task.type) {
            case "tutoring":
                return "border-blue-500";
            case "assignment":
                return "border-green-500";
            case "exam":
                return "border-red-500";
            case "lesson":
                return "border-purple-500";
            default:
                return "border-gray-400";
        }
    }

    return (
        <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-7 gap-1">
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
                                        {/* Display all tasks */}
                                        {tasksForDay
                                            .sort((a, b) => {
                                                const aTime = a.start_date_time ? new Date(a.start_date_time) :
                                                    a.startTime ? new Date(a.startTime) : new Date();
                                                const bTime = b.start_date_time ? new Date(b.start_date_time) :
                                                    b.startTime ? new Date(b.startTime) : new Date();
                                                return aTime - bTime;
                                            })
                                            .slice(0, 3)
                                            .map((task, idx) => {
                                                const taskColor = getTaskColor(task);

                                                // Get time display
                                                let timeDisplay = "";
                                                if (task.start_date_time) {
                                                    const startTime = new Date(task.start_date_time);
                                                    if (!isNaN(startTime)) {
                                                        timeDisplay = format(startTime, "HH:mm");
                                                    }
                                                } else if (task.startTime instanceof Date) {
                                                    timeDisplay = format(task.startTime, "HH:mm");
                                                }

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={cn(
                                                            "text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-50 border-l-2",
                                                            taskColor
                                                        )}
                                                        title={`${task.title} (${task.type || "task"})`}
                                                    >
                                                        <div className="font-medium">
                                                            {timeDisplay && <span className="text-gray-500 mr-1">{timeDisplay}</span>}
                                                            {task.title || new Date(task?.class_date).toLocaleString("en-US", {
                                                                weekday: "short",
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        {tasksForDay.length > 3 && (
                                            <div className="text-xs text-gray-500 pl-1">+{tasksForDay.length - 3} more</div>
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
