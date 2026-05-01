"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExamTimer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        const newTime = prev - 1;
        setProgress((newTime / (duration * 60)) * 100);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm mb-6">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-100 rounded-t-lg">
        <div
          className="h-full transition-all duration-1000 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer Display */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <div className="font-mono text-lg font-medium text-gray-700">
            {hours > 0 && `${String(hours).padStart(2, "0")}:`}
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
        <div className="text-sm text-gray-500">Time Remaining</div>
      </div>
    </div>
  );
}
