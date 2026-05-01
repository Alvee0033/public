import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const TutorsWidget = ({ data = [] }) => {
  const tutors = Array.isArray(data) ? data : []

  return (
    <Card className="w-full bg-gradient-to-tr from-white to-red-200 h-full">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">Tutors</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-2 sm:space-y-4">
          <div className="border rounded-md p-2 sm:p-3 max-h-40 sm:max-h-48 md:max-h-64 overflow-auto">
            {tutors.length === 0 ? (
              <div className="text-xs sm:text-sm text-muted-foreground px-2">No tutors found</div>
            ) : (
              <ul className="divide-y space-y-1 sm:space-y-0">
                {tutors.map((t) => (
                  <li key={t._id || t.id} className="px-2 py-1.5 sm:py-2">
                    <div className="font-medium text-xs sm:text-sm truncate">
                      {t.full_name || `${t.first_name || ''} ${t.last_name || ''}`.trim() || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {t.personal_email || t.user?.email || '—'}
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

export default TutorsWidget