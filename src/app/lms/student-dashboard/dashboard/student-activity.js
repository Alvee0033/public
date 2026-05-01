import { Award, Bell, CheckCircle, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";

const activities = [
  {
    section: "TODAY",
    items: [
      {
        icon: "reminder",
        title: "Reminder:",
        description: "Attending Physics Group Meeting.",
        time: "1:00 PM",
      },
      {
        icon: "reminder",
        title: "Reminder:",
        description: "Art Supplies Collection.",
        time: "10:30 AM",
      },
      {
        icon: "award",
        title: "You got",
        description: "Award for 1st place student",
        time: "10:30 AM",
      },
    ],
  },
  {
    section: "YESTERDAY",
    items: [
      {
        icon: "schedule",
        title: "Biology with Ms. Carter Quiz",
        description: "Scheduled",
        time: "4:00 PM",
      },
      {
        icon: "feedback",
        title: "Received",
        description: "Feedback on English Essay.",
        time: "9:15 AM",
      },
      {
        icon: "submit",
        title: "Submitted",
        description: "Mathematics Assignment.",
        time: "2:45 PM",
      },
      {
        icon: "submit",
        title: "Submit",
        description: "The Regional Robotics Champion.",
        time: "2:45 PM",
      },
    ],
  },
];

function getIcon(type) {
  switch (type) {
    case "reminder":
      return <Bell className="h-4 w-4 text-blue-500" />;
    case "award":
      return <Award className="h-4 w-4 text-purple-500" />;
    case "schedule":
      return <Bell className="h-4 w-4 text-blue-500" />;
    case "feedback":
      return <ThumbsUp className="h-4 w-4 text-yellow-500" />;
    case "submit":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
}

export function StudentActivity() {
  return (
    <div className="rounded-xl bg-white p-6 col-span-full md:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Anabia&apos;s Activity</h2>
        <Button variant="ghost" className="text-sm text-gray-500 bg-primaryColor">
          View All
        </Button>
      </div>
      <div className="space-y-6">
        {activities.map((section) => (
          <div key={section.section}>
            <div className="mb-4 text-sm font-medium text-gray-400">
              {section.section}
            </div>
            <div className="space-y-4 text-sm">
              {section.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1 rounded-full bg-gray-50 p-2">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium">{item.title}</span>{" "}
                        <span className="text-gray-600">
                          {item.description}
                        </span>
                      </div>
                      <div className="text-gray-400 whitespace-nowrap">{item.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
