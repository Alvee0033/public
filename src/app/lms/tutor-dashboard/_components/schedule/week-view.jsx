import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";

export function WeekView({ selectedDate, scheduledTasks, onDragOver, onDrop }) {
    // Generate time slots for 24 hours (00:00 to 23:00)
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        return `${i.toString().padStart(2, '0')}:00`;
    });

    // Get the start of the week (Monday)
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })

    // Generate days of the week
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    // Only show approved sessions/tasks (is_requested === false)
    const approvedTasks = Array.isArray(scheduledTasks)
        ? scheduledTasks.filter(task => task.is_requested === false)
        : [];

    // Find sessions/tasks for a specific day and time slot, supporting class_start_time
    const getTasksForDayAndTime = (date, timeSlot) => {
        const [slotHour] = timeSlot.split(":").map(Number);
        return approvedTasks.filter((task) => {
            let start = null;
            if (task.class_start_time) {
                start = new Date(task.class_start_time);
            } else if (task.start_date_time) {
                start = new Date(task.start_date_time);
            } else if (task.startTime) {
                start = new Date(task.startTime);
            }
            if (!start || isNaN(start)) return false;
            return (
                start.getFullYear() === date.getFullYear() &&
                start.getMonth() === date.getMonth() &&
                start.getDate() === date.getDate() &&
                start.getHours() === slotHour
            );
        });
    }

    return (
        <div className="flex-1 overflow-y-auto pb-16" style={{ maxHeight: 'calc(100vh - 56px)', minHeight: '600px' }}>
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

                        {weekDays.map((day, dayIdx) => {
                            const tasksForSlot = getTasksForDayAndTime(day, timeSlot);
                            return (
                                <div
                                    key={dayIdx}
                                    className="p-1 border-r min-h-[80px] hover:bg-gray-50"
                                    onDragOver={onDragOver}
                                    onDrop={(event) => {
                                        const taskData = event.dataTransfer.getData("task");
                                        if (!taskData) {
                                            console.error("No task data found in the drop event.");
                                            return;
                                        }

                                        let droppedTask;
                                        try {
                                            droppedTask = JSON.parse(taskData);
                                        } catch (error) {
                                            console.error("Failed to parse task data:", error);
                                            return;
                                        }

                                        // Set start and end time to this slot
                                        const [slotHour] = timeSlot.split(":").map(Number);
                                        const startDate = new Date(day);
                                        startDate.setHours(slotHour, 0, 0, 0);
                                        const endDate = new Date(startDate);
                                        endDate.setHours(startDate.getHours() + 1);
                                        const updatedTask = {
                                            ...droppedTask,
                                            start_date_time: startDate.toISOString(),
                                            end_date_time: endDate.toISOString(),
                                        };

                                        onDrop(updatedTask);
                                    }}
                                >
                                    {tasksForSlot.map((task, idx) => {
                                        let start = null, end = null;
                                        if (task.class_start_time) {
                                            start = new Date(task.class_start_time);
                                            end = task.class_end_time ? new Date(task.class_end_time) : null;
                                        } else if (task.start_date_time) {
                                            start = new Date(task.start_date_time);
                                            end = task.end_date_time ? new Date(task.end_date_time) : null;
                                        } else if (task.startTime) {
                                            start = new Date(task.startTime);
                                            end = task.endTime ? new Date(task.endTime) : null;
                                        }
                                        const name = task.course_lesson?.title || task.title || task.name || task.session_name || "Tutoring Session";
                                        const taskDay = start ? format(start, "EEE, MMM d") : "";
                                        const taskStartTime = start && !isNaN(start) ? format(start, "HH:mm") : "";
                                        const taskEndTime = end && !isNaN(end) ? format(end, "HH:mm") : "";
                                        // Determine session type (1:1 or Group)
                                        let sessionType = null;
                                        if (task.course_master_lesson && task.course_master_lesson.name) {
                                            if (task.course_master_lesson.name.toLowerCase().includes('1:1')) {
                                                sessionType = '1:1';
                                            } else if (task.course_master_lesson.name.toLowerCase().includes('group')) {
                                                sessionType = 'Group';
                                            } else {
                                                sessionType = task.course_master_lesson.name;
                                            }
                                        }
                                        return (
                                            <div
                                                key={idx}
                                                className="rounded-md p-1 mb-1 text-sm border truncate cursor-pointer"
                                                style={{ borderColor: task?.master_task_status?.color_code || '#22c55e' }}
                                                title={`${name} (${taskDay}, ${taskStartTime} - ${taskEndTime})`}
                                            >
                                                {sessionType && (
                                                    <div className={
                                                        sessionType === '1:1'
                                                            ? 'mb-1 px-1 rounded bg-blue-100 text-blue-700 border border-blue-300 text-[10px] font-semibold w-fit'
                                                            : 'mb-1 px-1 rounded bg-purple-100 text-purple-700 border border-purple-300 text-[10px] font-semibold w-fit'
                                                    }>
                                                        {sessionType}
                                                    </div>
                                                )}
                                                <div className="font-medium truncate">{name}</div>
                                                <div className="text-xs truncate">{taskDay}</div>
                                                <div className="text-xs truncate">
                                                    {taskStartTime} - {taskEndTime}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
