
/**
 * File: session-create/page.jsx
 * Author: Samin Yasar
 * GitHub: saminTutorsplan
 *
 * Purpose:
 * This file defines the SessionCreatePage component for the TutorsPlan LMS tutor dashboard.
 * It provides a user interface for tutors to create new tutoring sessions, including all relevant details.
 * The page utilizes mock data for students, courses, modules, lessons, tutors, master lessons, and schedules.
 *
 * Usage:
 * - Displays a form for session creation within a styled card layout.
 * - All fields in the form are optional, allowing flexible session setup.
 * - Intended for use by tutors within the dashboard to streamline session management.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SessionForm } from "./_components/SessionForm"
import {
  mockStudents,
  mockCourses,
  mockModules,
  mockLessons,
  mockTutors,
  mockMasterLessons,
  mockSchedules,
} from "./_components/mockData"

export default function SessionCreatePage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Session</CardTitle>
            <CardDescription>
              Fill in the details to create a new tutoring session. All fields are optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionForm
              mockStudents={mockStudents}
              mockCourses={mockCourses}
              mockModules={mockModules}
              mockLessons={mockLessons}
              mockTutors={mockTutors}
              mockMasterLessons={mockMasterLessons}
              mockSchedules={mockSchedules}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
