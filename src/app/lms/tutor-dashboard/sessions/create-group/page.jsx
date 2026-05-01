/**
 * File: create-group/page.jsx
 * Author: GitHub Copilot
 *
 * Purpose:
 * This file defines the GroupSessionCreatePage component for the TutorsPlan LMS tutor dashboard.
 * It provides a user interface for tutors to create new group tutoring sessions.
 * The page allows tutors to set up group sessions with multiple participants.
 *
 * Usage:
 * - Displays a form for group session creation within a styled card layout.
 * - Intended for use by tutors within the dashboard to streamline group session management.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupSessionForm } from "./_components/GroupSessionForm"

export default function GroupSessionCreatePage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Group Session</CardTitle>
            <CardDescription>
              Set up a group tutoring session with multiple students. Fill in the session details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GroupSessionForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}