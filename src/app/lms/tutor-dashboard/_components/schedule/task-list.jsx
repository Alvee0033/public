"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import { Clock } from "lucide-react"



export function TaskList({ tasks, getColorClasses, isLoading }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-32" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-md bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl">Available Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No unassigned tasks available</div>
                ) : (
                    tasks.map((task) => <DraggableTask key={task.id} task={task} getColorClasses={getColorClasses} />)
                )}
            </CardContent>
        </Card>
    )
}



function DraggableTask({ task, getColorClasses }) {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: task.id,
    })

    const { bg, border, text } = getColorClasses(task.color)

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            zIndex: 999,
            position: "relative",
            opacity: isDragging ? 0.8 : 1,
        }
        : undefined
    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={cn("cursor-grab active:cursor-grabbing transition-all", isDragging && "opacity-50")}
        >
            <Card className={cn("border overflow-hidden transition-all", bg, border, isDragging && "shadow-lg scale-105")}>
                <CardContent className="p-3">
                    <div className={cn("font-medium", text)}>{task.title}</div>
                    <div className="text-muted-foreground text-xs mt-1 truncate">{task.description}</div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Duration: {task.estimated_time_in_hours} min</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
