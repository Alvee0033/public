"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const performanceData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 75 },
  { subject: "English", score: 90 },
  { subject: "History", score: 80 },
]

const subjects = [
  { name: "Math", progress: 85, color: "bg-pink-500" },
  { name: "Science", progress: 75, color: "bg-purple-500" },
  { name: "English", progress: 90, color: "bg-blue-500" },
  { name: "History", progress: 80, color: "bg-green-500" },
]

const tutors = [
  { id: 1, name: "John Doe", subjects: ["Math", "Physics"], avatar: "/avatars/john-doe.png" },
  { id: 2, name: "Jane Smith", subjects: ["English", "Literature"], avatar: "/avatars/jane-smith.png" },
  { id: 3, name: "Alice Johnson", subjects: ["Chemistry", "Biology"], avatar: "/avatars/alice-johnson.png" },
]

export function ColorfulDashboard() {
  return (
    (<div
      className="container mx-auto p-8 bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Guardian Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Overview Widget */}
        <Card className="col-span-full bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">82.5%</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">5</p>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-sm text-gray-600">Unread Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card
          className="col-span-full md:col-span-2 bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="subject" />
                <YAxis />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardTitle>Progress Tracker</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className={`h-2 ${subject.color}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Calendar mode="single" selected={new Date()} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Communication */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <CardTitle>Communication</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/40?img=${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">User {i}</p>
                    <p className="text-xs text-gray-500">Latest message...</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">Open Chat</Button>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Advanced Math Course</span>
                <Badge>New</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Science Fair Prep</span>
                <Badge variant="secondary">Upcoming</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>English Writing Workshop</span>
                <Badge variant="outline">Recommended</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tutor Connect */}
        <Card className="col-span-full bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <CardTitle>Tutor Connect</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex flex-col items-center p-4 border rounded-lg">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback>{tutor.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{tutor.name}</h3>
                  <div className="flex flex-wrap gap-1 my-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

