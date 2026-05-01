"use client"

import { TrendingUp, TrendingDown, Target, Award, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ProgressAnalytics({ events, yearlyStats }) {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  // Calculate monthly stats
  const thisMonthEvents = events.filter(
    (event) => event.date.getMonth() === thisMonth && event.date.getFullYear() === thisYear,
  )

  const completedThisMonth = thisMonthEvents.filter((event) => event.status === "completed").length
  const scheduledThisMonth = thisMonthEvents.filter((event) => event.status === "scheduled").length

  // Calculate completion rate
  const totalSessions = completedThisMonth + scheduledThisMonth
  const completionRate = totalSessions > 0 ? (completedThisMonth / totalSessions) * 100 : 0

  // Calculate study hours
  const studyHours =
    events.filter((event) => event.status === "completed").reduce((total, event) => total + event.duration, 0) / 60

  // Subject performance
  const subjectStats = events
    .filter((event) => event.status === "completed")
    .reduce((acc, event) => {
      acc[event.subject] = (acc[event.subject] || 0) + 1
      return acc
    }, {})

  const topSubjects = Object.entries(subjectStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Weekly activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const weeklyActivity = last7Days.map((date) => {
    const dayEvents = events.filter(
      (event) => event.date.toDateString() === date.toDateString() && event.status === "completed",
    )
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      sessions: dayEvents.length,
      hours: dayEvents.reduce((total, event) => total + event.duration, 0) / 60,
    }
  })

  // Goals and achievements
  const monthlyGoal = 20 // sessions per month
  const goalProgress = (completedThisMonth / monthlyGoal) * 100

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyStats.tutoring + yearlyStats.group}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(studyHours)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -3% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearlyStats.assessments + yearlyStats.exams}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Goal Progress</CardTitle>
          <CardDescription>Complete {monthlyGoal} sessions this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {completedThisMonth}/{monthlyGoal} sessions
              </span>
            </div>
            <Progress value={goalProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{Math.round(goalProgress)}% complete</span>
              <span>{monthlyGoal - completedThisMonth} sessions remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject Performance</CardTitle>
          <CardDescription>Your most active subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSubjects.map(([subject, count], index) => (
              <div key={subject} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{count} sessions</Badge>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / Math.max(...topSubjects.map(([, c]) => c))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
          <CardDescription>Your learning activity over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyActivity.map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.date}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min((day.sessions / 5) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{day.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{day.hours.toFixed(1)}h</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
