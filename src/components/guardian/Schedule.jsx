"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function Schedule() {
  const [date, setDate] = useState(new Date())

  return (
    (<div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tutoring Calendar</CardTitle>
          <CardDescription>Schedule and view upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your next 3 scheduled tutoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Math with Mr. Smith - Tomorrow at 4:00 PM</li>
            <li>Science with Ms. Johnson - Friday at 5:30 PM</li>
            <li>English with Mrs. Davis - Next Monday at 3:45 PM</li>
          </ul>
        </CardContent>
      </Card>
    </div>)
  );
}

