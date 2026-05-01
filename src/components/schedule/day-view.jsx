import { format } from "date-fns"

export function DayView({ selectedDate, scheduledTasks, onDragOver, onDrop }) {
    // Generate time slots from 9:00 to 17:00
    const timeSlots = Array.from({ length: 17 - 9 + 1 }, (_, i) => {
        const hour = i + 9
        return `${hour}:00`
    })
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    // Find tasks for the current time slot and date
    const getTasksForTimeSlot = (timeSlot) => {
        return scheduledTasks.filter((task) => {
            // Try to get a valid date from multiple possible date fields
            const dateValue = task.start_date_time ||
                task.startTime ||
                task.date ||
                task.due_date ||
                task.exam_date ||
                task.class_date ||
                task.assign_date;

            if (!dateValue || isNaN(new Date(dateValue))) {
                return false; // Skip if no valid date field is found
            }

            const taskDateTime = new Date(dateValue);
            const taskDate = format(taskDateTime, "yyyy-MM-dd");
            const taskHour = taskDateTime.getHours();
            const [slotHour] = timeSlot.split(":").map(Number);

            return taskHour === slotHour && taskDate === formattedDate;
        });
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
                <h2 className="text-lg font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
            </div>

            <div className="divide-y">
                {timeSlots.map((timeSlot, idx) => {
                    const tasksForSlot = getTasksForTimeSlot(timeSlot)
                    return (
                        <div
                            key={idx}
                            className="flex p-2 min-h-[80px] hover:bg-gray-50"
                            onDragOver={onDragOver}
                            onDrop={() => onDrop(timeSlot, selectedDate)}
                        >
                            <div className="w-16 flex-shrink-0 pt-1 text-muted-foreground">{timeSlot}</div>

                            <div className="flex-1">
                                {tasksForSlot.map((task, i) => (
                                    <div
                                        key={i}
                                        className="rounded-md p-2 mb-1 border"
                                        style={{ borderColor: task?.master_task_status?.color_code }}
                                    >
                                        <a target="_blank" href={`/tasks/task-events/view/${task.id}`} className="text-sm font-medium text-gray-900 ">
                                            <div className="font-medium">{task.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(
                                                    task.start_date_time ||
                                                    task.startTime ||
                                                    task.date ||
                                                    task.due_date ||
                                                    task.exam_date ||
                                                    task.class_date ||
                                                    task.assign_date
                                                ).toLocaleDateString("en-US",
                                                    { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} - {new Date(
                                                        task.end_date_time ||
                                                        task.endTime ||
                                                        task.due_date ||
                                                        task.exam_date ||
                                                        task.assign_date
                                                    ).toLocaleDateString("en-US",
                                                        { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
