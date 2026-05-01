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
            <h4 className="text-sm">{task?.name}</h4>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{task?.estimated_time_in_hours || "30 min"}</span>
            </div>
        </div>
    )
}
