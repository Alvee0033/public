import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

const EmployeeStats = ({ count = 0 }) => {
  return (
    <Card className="w-full h-full text-center">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">Total Employees</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Number of registered employees</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{count}</span>
      </CardContent>
    </Card>
  )
}

export default EmployeeStats