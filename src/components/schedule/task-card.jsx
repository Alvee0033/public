"use client"

import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export default function TaskCard({ task, onDragStart }) {
    return (
        <div
            className={cn(
                "border rounded p-2 cursor-grab",
                !task?.master_task_status?.color_code && "bg-white"
            )}
            style={
                task?.master_task_status?.color_code
                    ? { borderColor: task.master_task_status.color_code }
                    : undefined
            }
            draggable
            onDragStart={onDragStart}
        >
            <h4 className="text-sm">{task?.title}</h4>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(task?.class_date || task?.assign_date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }) || "30 mins"}</span>
            </div>
        </div>
    )
}
