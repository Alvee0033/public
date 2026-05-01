"use client"

import { Gamepad2, Trophy, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const teamMembers = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "student",
    level: "11th Grade",
    points: 2450,
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40&text=AT",
    nextActivity: "Math Quiz - 2:00 PM",
  },
  {
    id: "2",
    name: "Maya Patel",
    role: "student",
    level: "11th Grade",
    points: 2890,
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40&text=MP",
    nextActivity: "Physics Challenge - 3:30 PM",
  },
  {
    id: "3",
    name: "Coach Lisa Wang",
    role: "tutor",
    subject: "Math Games",
    level: "Learning Coach",
    points: 5670,
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40&text=LW",
    nextActivity: "Group Session - 4:00 PM",
  },
]

export function LearningTeamWidget() {
  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700"
      case "tutor":
        return "bg-green-100 text-green-700"
      case "mentor":
        return "bg-purple-100 text-purple-700"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "student":
        return "👨‍🎓"
      case "tutor":
        return "👩‍🏫"
      case "mentor":
        return "🏆"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-green-800 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Gamepad2 className="w-5 h-5 text-green-600" />
            </div>
            My Learning Squad
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-white bg-primaryColor">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-green-600 ml-12">Group tutoring & learning games</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-green-100 text-green-600 text-sm font-semibold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${member.status === "online" ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm text-gray-900">{member.name}</h4>
                  <span className="text-sm">{getRoleIcon(member.role)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Badge variant="outline" className={`text-xs ${getRoleColor(member.role)}`}>
                    {member.role === "student" ? member.level : member.subject || member.level}
                  </Badge>
                  <div className="flex items-center">
                    <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                    <span>{member.points} pts</span>
                  </div>
                </div>
                {member.nextActivity && (
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{member.nextActivity}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {member.status === "online" && <Badge className="bg-green-500 text-white text-xs">Online</Badge>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
