import { cn } from "@/lib/utils"
import { addDays, format, isSameDay, startOfWeek } from "date-fns"

export function WeekView({ selectedDate, scheduledTasks, onDragOver, onDrop }) {
    // Generate time slots from 9:00 to 17:00
    const timeSlots = Array.from({ length: 17 - 9 + 1 }, (_, i) => {
        const hour = i + 9
        return `${hour}:00`
    })

    // Get the start of the week (Monday)
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })

    // Generate days of the week
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    // Find tasks for a specific day
    const getTasksForDay = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd")

        return scheduledTasks.filter((task) => {
            try {
                // Use fallback pattern for determining task date
                const taskDate = format(
                    new Date(
                        task.start_date_time ||
                        task.date ||
                        task.due_date ||
                        task.exam_date ||
                        task?.class_date ||
                        task?.assign_date
                    ),
                    "yyyy-MM-dd"
                )
                return taskDate === formattedDate
            } catch (error) {
                return false
            }
        })
    }

    return (
        <div className="flex-1 overflow-auto">
            {/* Week header */}
            <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
                <div className="p-2 border-r"></div>
                {weekDays.map((day, idx) => (
                    <div
                        key={idx}
                        className={cn("p-2 text-center border-r", isSameDay(day, new Date()) && "bg-blue-50")}
                    >
                        <div className="font-medium">{format(day, "EEE")}</div>
                        <div className="text-sm">{format(day, "MMM d")}</div>
                    </div>
                ))}
            </div>

            {/* Time slots */}
            <div className="divide-y">
                {timeSlots.map((timeSlot, idx) => (
                    <div key={idx} className="grid grid-cols-8">
                        <div className="p-2 border-r text-muted-foreground">{timeSlot}</div>

                        {weekDays.map((day, idx) => {
                            const tasksForDay = getTasksForDay(day)

                            return (
                                <div
                                    key={idx}
                                    className="p-1 border-r min-h-[80px] hover:bg-gray-50"
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(timeSlot, day)}
                                >
                                    {tasksForDay.map((task, idx) => {
                                        try {
                                            // Use fallback pattern for determining task date
                                            const taskDateTime = new Date(
                                                task.start_date_time ||
                                                task.date ||
                                                task.due_date ||
                                                task.exam_date ||
                                                task?.class_date ||
                                                task?.assign_date
                                            )

                                            const taskEndDateTime = task.end_date_time ?
                                                new Date(task.end_date_time) :
                                                new Date(taskDateTime.getTime() + 60 * 60 * 1000) // Default 1 hour duration

                                            const taskStartTime = format(taskDateTime, "HH:mm")
                                            const taskEndTime = format(taskEndDateTime, "HH:mm")
                                            const taskDay = format(taskDateTime, "EEE, MMM d")

                                            return (
                                                <div
                                                    key={idx}
                                                    className="rounded-md p-1 mb-1 text-sm border truncate cursor-pointer"
                                                    style={{ borderColor: task?.master_task_status?.color_code }}
                                                    title={`${task.name} (${taskDay}, ${taskStartTime} - ${taskEndTime})`}
                                                >
                                                    <a target="_blank" className="font-medium">
                                                        <div className="font-medium truncate">{task.title}</div>
                                                        <div className="text-xs truncate">{taskDay}</div>
                                                        <div className="text-xs truncate">
                                                            {taskStartTime} - {taskEndTime}
                                                        </div>
                                                    </a>
                                                </div>
                                            )
                                        } catch (error) {
                                            return null
                                        }
                                    })}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
