"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"

export function TaskAssignmentDialog({
    isOpen,
    onClose,
    onSave,
    selectedDay,
    selectedTime,
    employeeName,
    taskColors,
}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [endTime, setEndTime] = useState("")
    const [selectedColor, setSelectedColor] = useState(taskColors[0].name)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedDay || !selectedTime) return

        onSave({
            title,
            description,
            date: selectedDay,
            startTime: selectedTime,
            endTime: endTime || incrementTime(selectedTime),
            color: selectedColor,
        })

        // Reset form
        setTitle("")
        setDescription("")
        setEndTime("")
        setSelectedColor(taskColors[0].name)
    }

    // Helper to increment time by 1 hour for default end time
    const incrementTime = (time) => {
        const [hours, minutes] = time.split(":").map(Number)
        const newHours = (hours + 1) % 24
        return `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">Assign Task</DialogTitle>
                    <DialogDescription>
                        {selectedDay && (
                            <div className="mt-2 text-sm">
                                Assigning task to <span className="font-medium">{employeeName}</span> on{" "}
                                <span className="font-medium">{format(selectedDay, "EEEE, MMMM d")}</span> at{" "}
                                <span className="font-medium">{selectedTime}</span>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title"
                                className="border-input/50 focus-visible:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter task description"
                                className="border-input/50 focus-visible:ring-purple-500"
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder={selectedTime ? incrementTime(selectedTime) : ""}
                                className="border-input/50 focus-visible:ring-purple-500"
                            />
                            <p className="text-xs text-muted-foreground">Leave empty for default 1-hour duration</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Task Color</Label>
                            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                                {taskColors.map((color) => (
                                    <div key={color.name} className="flex items-center space-x-2">
                                        <RadioGroupItem value={color.name} id={`color-${color.name}`} className="sr-only peer" />
                                        <Label
                                            htmlFor={`color-${color.name}`}
                                            className={cn(
                                                "h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 transition-all",
                                                color.bg,
                                                "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-offset-2",
                                                `peer-data-[state=checked]:ring-${color.name}-500`,
                                            )}
                                        />
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            Save Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
