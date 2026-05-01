'use client';
import { useEffect } from 'react';

export default function ExamLayout({ children }) {
    useEffect(() => {
        // Prevent right-click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Prevent keyboard shortcuts
        const handleKeyDown = (e) => {
            // Prevent Alt+Tab (note: can't truly prevent Alt+Tab due to OS-level)
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
            }
            // Prevent Ctrl+P (Print)
            if (e.ctrlKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
            }
            // Prevent other common shortcuts
            if (e.ctrlKey || e.altKey) {
                e.preventDefault();
            }
        };

        // Handle visibility change (tab switching)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.warn('Tab switching detected');
            }
        };

        // Request fullscreen
        const requestFullscreen = () => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.error('Failed to enter fullscreen:', err);
                });
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        };

        // Trigger fullscreen on first interaction (keydown or mousemove)
        const triggerFullscreen = () => {
            requestFullscreen();
            document.removeEventListener('keydown', triggerFullscreen);
            document.removeEventListener('mousemove', triggerFullscreen);
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', triggerFullscreen);
        document.addEventListener('mousemove', triggerFullscreen);

        return () => {
            // Cleanup
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', triggerFullscreen);
            document.removeEventListener('mousemove', triggerFullscreen);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}
