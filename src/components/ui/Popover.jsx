'use client';
import React, { useState, useRef, useEffect } from 'react';

const Popover = ({ trigger, children }) => {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={popoverRef}>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {trigger}
            </div>
            {open && (
                <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 p-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Popover;
