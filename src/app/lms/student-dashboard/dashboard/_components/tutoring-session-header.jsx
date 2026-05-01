"use client"

import { Clock, CheckCircle, AlertCircle, Bot } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function TutoringSessionHeader() {
  const totalSessions = 60
  const usedSessions = 34
  const remainingSessions = 23
  const usagePercentage = (usedSessions / totalSessions) * 100

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
              <img src="/images/sophie-profile.jpg" alt="Sophie Faisal" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">1:1 Tutoring Sessions</h3>
              <p className="text-sm text-gray-600">Personal tutoring package for Sophie Faisal</p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white px-3 py-1">Active Package</Badge>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gray-100 rounded-full">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">{usedSessions}</div>
            <div className="text-sm text-gray-600">Sessions Used</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600">{remainingSessions}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Package Progress</span>
            <span className="font-medium text-gray-800">
              {usedSessions} of {totalSessions} sessions ({Math.round(usagePercentage)}%)
            </span>
          </div>
          <Progress value={usagePercentage} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Started: Sept 2024</span>
            <span>Expires: June 2025</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Request Instant Session</Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Bot className="w-4 h-4 mr-2" />
            Ask AI Agent
          </Button>
        </div>

        {remainingSessions <= 10 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Low Session Alert: Only {remainingSessions} sessions remaining
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Consider purchasing additional sessions to continue your learning journey.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
