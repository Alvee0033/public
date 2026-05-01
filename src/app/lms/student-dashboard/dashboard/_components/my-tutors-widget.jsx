"use client"

import { Star, MessageCircle, Video, Calendar, Heart, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const tutors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    subject: "Mathematics",
    rating: 4.9,
    sessions: 127,
    status: "online",
    nextSession: "Today 3:00 PM",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    subject: "Physics",
    rating: 4.8,
    sessions: 89,
    status: "online",
    nextSession: "Tomorrow 2:00 PM",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    subject: "Chemistry",
    rating: 4.9,
    sessions: 156,
    status: "busy",
    nextSession: "Wed 10:00 AM",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
    isFavorite: false,
  },
]

export function MyTutorsWidget() {
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-blue-800 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            My Favorite Tutors
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-white bg-primaryColor">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-blue-600 ml-12">Your top learning champions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                    {tutor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(tutor.status)} rounded-full border-2 border-white`}
                ></div>
                {tutor.isFavorite && (
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Heart className="w-1.5 h-1.5 text-white fill-current" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">{tutor.name}</h4>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span className="text-blue-600 font-medium">{tutor.subject}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span>{tutor.rating}</span>
                  </div>
                </div>
                {tutor.nextSession && (
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{tutor.nextSession}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {tutor.status === "online" && (
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Video className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
