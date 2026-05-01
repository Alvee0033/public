import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Video } from "lucide-react";

const upcomingClasses = [
  {
    id: 1,
    subject: "Advanced JavaScript",
    time: "10:00 AM - 11:30 AM",
    date: "2024-03-20",
    instructor: "Dr. Sarah Wilson",
    participants: 24,
    status: "upcoming",
  },
  {
    id: 2,
    subject: "React Fundamentals",
    time: "2:00 PM - 3:30 PM",
    date: "2024-03-20",
    instructor: "Prof. Michael Chen",
    participants: 18,
    status: "upcoming",
  },
  {
    id: 3,
    subject: "Data Structures",
    time: "11:00 AM - 12:30 PM",
    date: "2024-03-21",
    instructor: "Dr. James Smith",
    participants: 30,
    status: "upcoming",
  },
];

const pastClasses = [
  {
    id: 4,
    subject: "Introduction to Python",
    time: "9:00 AM - 10:30 AM",
    date: "2024-03-19",
    instructor: "Dr. Emily Johnson",
    participants: 22,
    status: "completed",
    recording: "https://example.com/recording/python-intro",
  },
  {
    id: 5,
    subject: "Database Design",
    time: "3:00 PM - 4:30 PM",
    date: "2024-03-18",
    instructor: "Prof. David Lee",
    participants: 26,
    status: "completed",
    recording: "https://example.com/recording/database-design",
  },
];

export default function LiveClasses() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Live Classes</h1>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Classes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingClasses.map((class_) => (
              <Card key={class_.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{class_.subject}</CardTitle>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {class_.date}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        {class_.time}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4" />
                        {class_.participants} participants
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full">Join Class</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Classes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastClasses.map((class_) => (
              <Card key={class_.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{class_.subject}</CardTitle>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {class_.date}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        {class_.time}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4" />
                        {class_.participants} participants
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Watch Recording
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}