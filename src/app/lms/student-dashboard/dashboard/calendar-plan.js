"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const events = [
  {
    date: "Monday - March 24, 2030",
    title: "Homeroom & Announcement",
    subject: "Mathematics",
    color: "bg-blue-400",
  },
  {
    date: "Wednesday - April 26, 2024",
    title: "Science Fair Preparation",
    subject: "Science",
    color: "bg-purple-400",
  },
  {
    date: "Friday - April 28, 2024",
    title: "History Documentary Viewing",
    subject: "History",
    color: "bg-yellow-400",
  },
  {
    date: "Monday - April 31, 2024",
    title: "Art Champion Announcement",
    subject: "Art",
    color: "bg-pink-400",
  },
];

export function CalendarAndPlan() {
  const [date, setDate] = useState(new Date(2030, 2, 19));

  return (
    <div className="rounded-xl bg-white p-6 col-span-full md:col-span-3">
      {/* <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">March 2030</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
      {/* <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full rounded-md"
        classNames={{
          head_cell: "text-muted-foreground font-normal text-[0.8rem]",
          cell: cn(
            "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"
          ),
          day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
          day_selected:
            "bg-[#E5F6FF] text-black hover:bg-[#E5F6FF] hover:text-black focus:bg-[#E5F6FF] focus:text-black",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_hidden: "invisible",
        }}
      /> */}
      <Calendar />
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">LearningART Plan</h3>
          {/* <Button variant="ghost" className="text-sm text-gray-500">
            View All
          </Button> */}
        </div>
        <div className="space-y-4 text-sm">
          {events.map((event, index) => (
            <div key={index}>
              <div className="mb-1 text-sm text-gray-400">{event.date}</div>
              <div className="flex gap-3">
                <div
                  className={cn("w-1 self-stretch rounded-full", event.color)}
                />
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">{event.subject}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
