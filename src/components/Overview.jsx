"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"

const data = [
  { subject: "Math", score: 80 },
  { subject: "Science", score: 75 },
  { subject: "English", score: 90 },
  { subject: "History", score: 85 },
]

export function Overview() {
  return (
    (<div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sessions</CardTitle>
            <CardDescription>Number of tutoring sessions this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
            <CardDescription>Across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">82.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Scheduled for next week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unread Messages</CardTitle>
            <CardDescription>From tutors and administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores across subjects</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage students and payments</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button>Add Student</Button>
            <Button>View List of Students</Button>
            <Button>Refer Students</Button>
            <Button>Create Student Groups</Button>
            <Button>Pay Tuition Fees</Button>
            <Button>View Recommended Courses</Button>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

