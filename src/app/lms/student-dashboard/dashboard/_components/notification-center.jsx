"use client"

import { useState, useEffect } from "react"
import { Bell, X, Clock, User, BookOpen, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationCenter({ events }) {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Generate notifications based on upcoming events
    const now = new Date()
    const upcomingEvents = events.filter(
      (event) =>
        event.status === "scheduled" && event.date > now && event.date <= new Date(now.getTime() + 24 * 60 * 60 * 1000),
    )

    const newNotifications = [
      {
        id: "1",
        type: "reminder",
        title: "Session Starting Soon",
        message: "Your Math Algebra session with Dr. Sarah Johnson starts in 15 minutes",
        time: new Date(now.getTime() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: "2",
        type: "message",
        title: "New Message from Tutor",
        message: "Prof. Michael Chen sent you study materials for tomorrow's Physics session",
        time: new Date(now.getTime() - 30 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        type: "update",
        title: "Assignment Graded",
        message: "Your Chemistry assignment has been graded. Score: 92/100",
        time: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "4",
        type: "alert",
        title: "Session Rescheduled",
        message: "Your Biology group class has been moved to 3:00 PM tomorrow",
        time: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        read: false,
      },
      ...upcomingEvents.slice(0, 3).map((event, index) => ({
        id: `event-${event.id}`,
        type: "reminder",
        title: "Upcoming Session",
        message: `${event.title} is scheduled for ${event.date.toLocaleDateString()} at ${event.startTime}`,
        time: new Date(now.getTime() - (index + 1) * 60 * 60 * 1000),
        read: Math.random() > 0.5,
        event,
      })),
    ]

    setNotifications(newNotifications)
  }, [events])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "message":
        return <User className="w-4 h-4 text-green-500" />
      case "update":
        return <BookOpen className="w-4 h-4 text-purple-500" />
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTime = (time) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium truncate ${!notification.read ? "text-blue-900" : ""}`}>
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(notification.time)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
