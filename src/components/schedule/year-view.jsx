"use client"

import { cn } from "@/lib/utils"
import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth } from "date-fns"

export function YearView({ selectedDate, scheduledTasks = [], onSelectMonth }) {
    const currentYear = selectedDate.getFullYear()
    // Generate all months for the year
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1)
        return {
            date,
            name: format(date, "MMMM"),
            days: generateMonthDays(date),
        }
    })

    // Generate days for a month in a compact format
    function generateMonthDays(monthDate) {
        const monthStart = startOfMonth(monthDate)
        const monthEnd = endOfMonth(monthDate)
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

        // Get the day of week for the first day (0-6, where 0 is Sunday)
        const firstDayOfWeek = monthStart.getDay()

        // Create a 7x6 grid (max possible days in a month view)
        const calendarGrid = Array(42).fill(null)

        // Fill in the actual days
        days.forEach((day, index) => {
            calendarGrid[firstDayOfWeek + index] = day
        })

        return calendarGrid
    }

    // Count tasks for a specific month by type
    const getTaskCountForMonth = (month, type) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date)
            return taskDate.getMonth() === month &&
                taskDate.getFullYear() === currentYear &&
                task.type === type
        }).length
    }

    // Get tutoring sessions count for a month
    const getTutoringCountForMonth = (month) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            // Make sure we have a valid date before attempting to use it
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date || task?.class_date || task?.assign_date);
            // Check if this is a valid date
            if (isNaN(taskDate.getTime())) return false;

            return taskDate.getMonth() === month &&
                taskDate.getFullYear() === currentYear &&
                task.type === "tutoring";
        }).length;
    }

    // Get lessons count for a month
    const getLessonsCountForMonth = (month) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            // Make sure we have a valid date before attempting to use it
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date || task?.class_date || task?.assign_date);
            // Check if this is a valid date
            if (isNaN(taskDate.getTime())) return false;

            return taskDate.getMonth() === month &&
                taskDate.getFullYear() === currentYear &&
                task.type === "lesson";
        }).length;
    }

    // Get assignments count for a month
    const getAssignmentsCountForMonth = (month) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            // Make sure we have a valid date before attempting to use it
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date || task?.class_date || task?.assign_date);
            // Check if this is a valid date
            if (isNaN(taskDate.getTime())) return false;

            return taskDate.getMonth() === month &&
                taskDate.getFullYear() === currentYear &&
                task.type === "assignment";
        }).length;
    }

    // Get exams count for a month
    const getExamsCountForMonth = (month) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            // Make sure we have a valid date before attempting to use it
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date || task?.class_date || task?.assign_date);
            // Check if this is a valid date
            if (isNaN(taskDate.getTime())) return false;

            return taskDate.getMonth() === month &&
                taskDate.getFullYear() === currentYear &&
                task.type === "exam";
        }).length;
    }

    // Count total tasks for a specific month
    const getTotalTaskCountForMonth = (month) => {
        if (!Array.isArray(scheduledTasks)) return 0;

        return scheduledTasks.filter((task) => {
            // Make sure we have a valid date before attempting to use it
            const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date);
            // Check if this is a valid date
            if (isNaN(taskDate.getTime())) return false;

            return taskDate.getMonth() === month && taskDate.getFullYear() === currentYear;
        }).length;
    }

    // Calculate total stats for the year
    const totalStats = Array.isArray(scheduledTasks)
        ? scheduledTasks.reduce(
            (acc, task) => {
                // Get task date based on available properties, prioritizing standard ones
                const taskDate = new Date(task.start_date_time || task.date || task.due_date || task.exam_date || task?.class_date || task?.assign_date);

                // Skip invalid dates
                if (isNaN(taskDate.getTime())) return acc;

                if (taskDate.getFullYear() === currentYear) {
                    if (task.type === "tutoring") {
                        acc.totalTutoring += 1;
                    } else if (task.type === "lesson") {
                        acc.totalLessons += 1;
                    } else if (task.type === "assignment") {
                        acc.totalAssignments += 1;
                    } else if (task.type === "exam") {
                        acc.totalExams += 1;
                    }
                }
                return acc;
            },
            {
                totalTutoring: 0,
                totalLessons: 0,
                totalAssignments: 0,
                totalExams: 0
            }
        )
        : {
            totalTutoring: 0,
            totalLessons: 0,
            totalAssignments: 0,
            totalExams: 0
        };

    return (
        <div className="flex-1 overflow-auto p-4">
            {/* Display total stats */}
            <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                <div className="font-medium">Yearly Stats</div>
                <div className="text-sm text-blue-600">
                    Total Tutoring Sessions: {totalStats.totalTutoring}
                </div>
                <div className="text-sm text-green-600">
                    Total Lessons: {totalStats.totalLessons}
                </div>
                <div className="text-sm text-amber-600">
                    Total Assignments: {totalStats.totalAssignments}
                </div>
                <div className="text-sm text-red-600">
                    Total Exams: {totalStats.totalExams}
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {months.map((month, idx) => {
                    const tutoringCount = getTutoringCountForMonth(month.date.getMonth());
                    const lessonsCount = getLessonsCountForMonth(month.date.getMonth());
                    const assignmentsCount = getAssignmentsCountForMonth(month.date.getMonth());
                    const examsCount = getExamsCountForMonth(month.date.getMonth());
                    const isCurrentMonth = isSameMonth(month.date, new Date())

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "border rounded-lg p-3 cursor-pointer hover:border-blue-400 transition-colors",
                                isCurrentMonth && "border-blue-400 bg-blue-50",
                            )}
                            onClick={() => onSelectMonth(month.date)}
                        >
                            <div className="font-medium mb-2">{month.name}</div>

                            {/* Mini calendar */}
                            <div className="grid grid-cols-7 gap-1 text-xs">
                                {/* Day headers */}
                                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                                    <div key={idx} className="text-center text-gray-500">
                                        {day}
                                    </div>
                                ))}

                                {/* Calendar days */}
                                {month.days.map((day, i) => {
                                    if (!day) return <div key={`empty-${i}`} className="w-4 h-4"></div>

                                    const isToday = isSameDay(day, new Date())

                                    return (
                                        <div
                                            key={i}
                                            className={cn("w-4 h-4 text-center text-xs", isToday && "bg-blue-500 text-white rounded-full")}
                                        >
                                            {format(day, "d")}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Task counts */}
                            <div className="mt-2 flex flex-col gap-1">
                                {tutoringCount > 0 && (
                                    <div className="text-xs text-blue-600">
                                        {tutoringCount} {tutoringCount === 1 ? "tutoring session" : "tutoring sessions"}
                                    </div>
                                )}
                                {lessonsCount > 0 && (
                                    <div className="text-xs text-green-600">
                                        {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
                                    </div>
                                )}
                                {assignmentsCount > 0 && (
                                    <div className="text-xs text-amber-600">
                                        {assignmentsCount} {assignmentsCount === 1 ? "assignment" : "assignments"}
                                    </div>
                                )}
                                {examsCount > 0 && (
                                    <div className="text-xs text-red-600">
                                        {examsCount} {examsCount === 1 ? "exam" : "exams"}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
