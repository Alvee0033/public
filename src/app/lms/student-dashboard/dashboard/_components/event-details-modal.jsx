"use client"

import { useState } from "react"
import { Calendar, Clock, Users, MapPin, BookOpen, Star, MessageCircle, Video, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const eventTypeLabels = {
  tutoring: "1-on-1 Tutoring",
  group: "Group Class",
  lesson: "Self Learning",
  assessment: "Assessment",
  exam: "Exam",
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-orange-100 text-orange-800",
}

export function EventDetailsModal({ event, isOpen, onClose }) {
  const [notes, setNotes] = useState("")

  if (!event) return null

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTutorInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const canJoin = event.status === "scheduled" && new Date() >= new Date(event.date.getTime() - 15 * 60 * 1000)
  const isUpcoming = event.status === "scheduled" && event.date > new Date()
  const isPast = event.date < new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{event.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Badge variant="outline">{eventTypeLabels[event.type]}</Badge>
                <Badge className={statusColors[event.status]}>{event.status}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium">{formatDate(event.date)}</div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {event.startTime} - {event.endTime} ({event.duration} minutes)
              </div>
            </div>
          </div>

          {/* Tutor Information */}
          {event.tutor && (
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${getTutorInitials(event.tutor)}`} />
                <AvatarFallback>{getTutorInitials(event.tutor)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{event.tutor}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  4.9 • 127 sessions
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          )}

          {/* Subject and Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Subject:</span>
              <span>{event.subject}</span>
            </div>

            {event.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Location:</span>
                <span>{event.location}</span>
              </div>
            )}

            {event.participants && event.maxParticipants && (
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Participants:</span>
                <span>
                  {event.participants}/{event.maxParticipants} students
                </span>
                <Badge variant="secondary">{event.maxParticipants - event.participants} spots left</Badge>
              </div>
            )}

            {event.description && (
              <div>
                <span className="font-medium block mb-2">Description:</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{event.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {canJoin && (
              <div className="flex space-x-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            )}

            {isUpcoming && !canJoin && (
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Reschedule
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            )}

            {event.type === "assessment" && event.status === "pending" && (
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Start Assessment</Button>
            )}

            {event.type === "lesson" && (
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Continue Lesson</Button>
            )}
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <label className="font-medium">Session Notes:</label>
            <Textarea
              placeholder="Add your notes about this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <Button variant="outline" size="sm">
              Save Notes
            </Button>
          </div>

          {/* Past Session - Show Results */}
          {isPast && event.status === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Session Completed</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Duration: {event.duration} minutes</div>
                <div>• Topics covered: {event.description}</div>
                {event.type === "assessment" && <div>• Score: 85/100</div>}
                {event.type === "exam" && <div>• Grade: A-</div>}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
