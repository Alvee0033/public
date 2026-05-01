"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 92 },
  { month: "Apr", score: 88 },
  { month: "May", score: 95 },
  { month: "Jun", score: 90 },
];

const coursePerformance = [
  {
    course: "Full Stack Development",
    progress: 75,
    grade: "A",
    assignments: 12,
    quizzes: 8,
  },
  {
    course: "UI/UX Design Principles",
    progress: 60,
    grade: "B+",
    assignments: 10,
    quizzes: 6,
  },
  {
    course: "Cloud Computing Basics",
    progress: 40,
    grade: "B",
    assignments: 8,
    quizzes: 4,
  },
];

const achievements = [
  {
    title: "Perfect Attendance",
    description: "Attended all classes for 3 consecutive months",
    progress: 100,
  },
  {
    title: "Quiz Master",
    description: "Scored above 90% in 5 consecutive quizzes",
    progress: 80,
  },
  {
    title: "Assignment Ace",
    description: "Completed all assignments before deadline",
    progress: 65,
  },
];

export default function Performance() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Performance & Analytics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {coursePerformance.map((course) => (
                <div key={course.course} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{course.course}</span>
                    <span className="text-sm">Grade: {course.grade}</span>
                  </div>
                  <Progress value={course.progress} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{course.assignments} assignments</span>
                    <span>{course.quizzes} quizzes</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className="space-y-2 p-4 rounded-lg bg-muted/50"
                >
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <Progress value={achievement.progress} />
                  <p className="text-sm text-right">{achievement.progress}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}