"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export function DateTimePicker({ label, value, onChange, showTime = false }) {
  // Helper to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Default to current date/time if no value
  const now = new Date();
  const selectedDate = value || (showTime ? now : new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();
  const selectedDay = selectedDate.getDate();
  const selectedHour = selectedDate.getHours();
  const selectedMinute = selectedDate.getMinutes();

  // Years range (customize as needed)
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 10 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Handle changes
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const daysInMonth = getDaysInMonth(newYear, selectedMonth);
    const newDay = Math.min(selectedDay, daysInMonth);
    const newDate = new Date(newYear, selectedMonth, newDay);
    if (showTime && value) {
      newDate.setHours(selectedHour, selectedMinute);
    }
    onChange(newDate);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const daysInMonth = getDaysInMonth(selectedYear, newMonth);
    const newDay = Math.min(selectedDay, daysInMonth);
    const newDate = new Date(selectedYear, newMonth, newDay);
    if (showTime && value) {
      newDate.setHours(selectedHour, selectedMinute);
    }
    onChange(newDate);
  };

  const handleDayChange = (e) => {
    const newDay = parseInt(e.target.value);
    const newDate = new Date(selectedYear, selectedMonth, newDay);
    if (showTime && value) {
      newDate.setHours(selectedHour, selectedMinute);
    }
    onChange(newDate);
  };

  // Time handlers
  const handleHourChange = (e) => {
    const newHour = parseInt(e.target.value);
    const newDate = new Date(selectedDate);
    newDate.setHours(newHour, selectedMinute);
    onChange(newDate);
  };

  const handleMinuteChange = (e) => {
    const newMinute = parseInt(e.target.value);
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour, newMinute);
    onChange(newDate);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        <select 
          value={selectedDay} 
          onChange={handleDayChange} 
          className="border rounded px-3 py-2 min-w-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange} 
          className="border rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {months.map((month, idx) => (
            <option key={month} value={idx}>{month}</option>
          ))}
        </select>
        
        <select 
          value={selectedYear} 
          onChange={handleYearChange} 
          className="border rounded px-3 py-2 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      {showTime && (
        <div className="flex gap-2 mt-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Hour:</Label>
            <select 
              value={selectedHour} 
              onChange={handleHourChange}
              className="border rounded px-3 py-2 min-w-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm">Minute:</Label>
            <select 
              value={selectedMinute} 
              onChange={handleMinuteChange}
              className="border rounded px-3 py-2 min-w-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {minutes.filter(minute => minute % 5 === 0).map((minute) => (
                <option key={minute} value={minute}>
                  {minute.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Display selected date/time for clarity */}
      {value && (
        <div className="text-sm text-gray-600 mt-2">
          Selected: {showTime ? format(value, "PPP 'at' p") : format(value, "PPP")}
        </div>
      )}
    </div>
  );
}

