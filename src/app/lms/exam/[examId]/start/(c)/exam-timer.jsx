"use client";

import { useEffect, useState } from "react";

export default function ExamTimer({ timeRemaining, onTimeUp }) {
    const [remainingTime, setRemainingTime] = useState(timeRemaining * 60); // Convert to seconds

    useEffect(() => {
        if (!remainingTime) {
            onTimeUp?.();
            return;
        }

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime, onTimeUp]);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time Remaining:</span>
            <span className="text-sm font-medium text-purple-600">
                {hours > 0 ? `${hours}h ` : ""}
                {minutes.toString().padStart(2, "0")}m{" "}
                {seconds.toString().padStart(2, "0")}s
            </span>
        </div>
    );
} 