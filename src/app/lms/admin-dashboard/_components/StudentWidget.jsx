import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const StudentWidget = ({ data = [] }) => {
  const students = Array.isArray(data) ? data : []

  return (
    <Card className="w-full bg-gradient-to-tr from-white to-orange-200 h-full">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">Students</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-2 sm:space-y-4">
          <div className="border rounded-md p-2 sm:p-3 max-h-40 sm:max-h-48 md:max-h-64 overflow-auto">
            {students.length === 0 ? (
              <div className="text-xs sm:text-sm text-muted-foreground px-2">No students found</div>
            ) : (
              <ul className="divide-y space-y-1 sm:space-y-0">
                {students.map((s) => (
                  <li key={s._id || s.id} className="px-2 py-1.5 sm:py-2">
                    <div className="font-medium text-xs sm:text-sm truncate">
                      {s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {s.email_address || s.user?.email || '—'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentWidget