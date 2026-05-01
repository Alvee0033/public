import { MoreHorizontal, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarSidebar() {
  return (
    <div className="w-full md:w-80 bg-white p-4 overflow-y-auto">
      <div className="mb-4 shadow rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Learning Plan</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <div className="space-y-3 text-sm p-3">
          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-md">
            <div className="w-1 h-5 bg-purple-400 rounded-full" />
            <span>Big Day and Celebration Day</span>
          </div>
          <div className="flex items-center space-x-2 bg-pink-50 px-3 py-2 rounded-md">
            <div className="w-1 h-5 bg-pink-400 rounded-full" />
            <span>Subject Presentation & Exam</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-md">
            <div className="w-1 h-5 bg-blue-400 rounded-full" />
            <span>Fair, Exhibition & Performance</span>
          </div>
          <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-md">
            <div className="w-1 h-5 bg-yellow-200 rounded-full" />
            <span>Official Meeting</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>May 8, 2030</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <div className="space-y-3 text-sm p-3">
          <div className="bg-blue-50 p-3 rounded-md space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Science Fair Setup</span>
              </div>
              <span className="text-sm text-gray-400">08:00 am</span>
            </div>
            <div className="text-sm text-gray-400">Science Club</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Teacher Meeting</span>
              </div>
              <span className="text-sm text-gray-400">11:00 am</span>
            </div>
            <div className="text-sm text-gray-400">All Teacher</div>
          </div>
          <div className="bg-pink-50 p-3 rounded-md space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Varsity Track Meet</span>
              </div>
              <span className="text-sm text-gray-400">01:00 pm</span>
            </div>
            <div className="text-sm text-gray-400">Track Team</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Parents Meeting</span>
              </div>
              <span className="text-sm text-gray-400">03:00 pm</span>
            </div>
            <div className="text-sm text-gray-400">All Teacher and Parents</div>
          </div>
        </div>
      </div>
    </div>
  );
}
