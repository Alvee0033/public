"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export function DateTimePicker({ value, onChange, placeholder = "Select date and time", label }) {
  const [dateTimeValue, setDateTimeValue] = useState("")

  useEffect(() => {
    if (value) {
      // Format the date for datetime-local input (YYYY-MM-DDTHH:mm)
      const date = new Date(value)
      const formattedDateTime = format(date, "yyyy-MM-dd'T'HH:mm")
      setDateTimeValue(formattedDateTime)
    }
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setDateTimeValue(newValue)
    
    if (newValue) {
      // Convert to Date object and call onChange
      const dateObject = new Date(newValue)
      onChange(dateObject)
    } else {
      onChange(null)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Input
        type="datetime-local"
        value={dateTimeValue}
        onChange={handleChange}
        placeholder={placeholder}
        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")} // Prevent past dates
        className="w-full"
      />
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected: {format(new Date(value), "PPP 'at' p")}
        </p>
      )}
    </div>
  )
}
