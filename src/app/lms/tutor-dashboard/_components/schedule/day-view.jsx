import { format } from "date-fns";

export function DayView({ selectedDate, scheduledTasks, onDragOver, onDrop }) {
    // Generate time slots for 24 hours (00:00 to 23:00)
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        return `${i.toString().padStart(2, '0')}:00`;
    });
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    // Function to generate a random color
    const getRandomColor = () => {
        const colors = ["border-red-400", "border-green-400", "border-blue-400", "border-yellow-400", "border-purple-400"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // Only show approved sessions/tasks (is_requested === false)
    const approvedTasks = Array.isArray(scheduledTasks)
        ? scheduledTasks.filter(task => task.is_requested === false)
        : [];

    // Find sessions/tasks for the current time slot and date, supporting class_start_time
    const getTasksForTimeSlot = (timeSlot) => {
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
                start.getFullYear() === selectedDate.getFullYear() &&
                start.getMonth() === selectedDate.getMonth() &&
                start.getDate() === selectedDate.getDate() &&
                start.getHours() === slotHour
            );
        });
    }

    return (
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)', minHeight: '600px' }}>
            <div className="p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
            </div>
            <div className="divide-y pb-16" style={{ minHeight: '1920px' }}>
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
                                {tasksForSlot.map((task, i) => {
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
                                            key={i}
                                            className="rounded-md p-2 mb-1 border"
                                            style={{ borderColor: task?.master_task_status?.color_code || '#22c55e' }}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("task", JSON.stringify(task));
                                            }}
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
                                            <div className="font-medium">{name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {start && end && !isNaN(start) && !isNaN(end) && (
                                                    <>
                                                        {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                        {" - "}
                                                        {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
