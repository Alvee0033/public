'use client';
import { useEffect, useState } from 'react';

export default function ExamTimer({ timeRemaining, onTimeUp }) {
    const [time, setTime] = useState(timeRemaining);

    useEffect(() => {
        if (time <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onTimeUp]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500 mb-1">Time Remaining</div>
            <div className="text-2xl font-bold text-gray-900">
                {formatTime(time)}
            </div>
        </div>
    );
} 