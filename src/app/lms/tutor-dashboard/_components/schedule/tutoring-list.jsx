"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import { Clock, User } from "lucide-react"

export function TutoringList({ tutoringSessions, getColorClasses, isLoading }) {
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
                <CardTitle className="text-xl">Tutoring Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {tutoringSessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No unassigned tutoring sessions available</div>
                ) : (
                    tutoringSessions.map((session) => (
                        <DraggableTutoringSession key={session.id} session={session} getColorClasses={getColorClasses} />
                    ))
                )}
            </CardContent>
        </Card>
    )
}



function DraggableTutoringSession({ session, getColorClasses }) {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: session.id,
    })

    const { bg, border, text } = getColorClasses(session.color)

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
                    <div className={cn("font-medium", text)}>{session.subject}</div>
                    <div className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Student: {session.studentName}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Duration: {session.duration} min</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
