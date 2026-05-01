/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function Communication() {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    setMessage("")
  }

  return (
    (<div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>Communicate with tutors and administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]" />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendMessage}>Send Message</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Your latest communications</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>From Mr. Smith: "Great progress in today's Math session!"</li>
            <li>From Admin: "Reminder: Parent-Teacher meeting next week."</li>
            <li>To Ms. Johnson: "Can we reschedule Friday's Science session?"</li>
          </ul>
        </CardContent>
      </Card>
    </div>)
  );
}

