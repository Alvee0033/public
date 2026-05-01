"use client";

import { useState, useEffect } from 'react';

const USER_KEY = 'user';

/**
 * Custom hook for managing user data with localStorage persistence
 * @returns {Object} - { user, setLocalUser }
 */
function useUser() {
    const [user, setUser] = useState(() => {
        // Check if we're on the client side (SSR compatibility)
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const storedUser = localStorage.getItem(USER_KEY);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.warn('Failed to parse user data from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem(USER_KEY);
            return null;
        }
    });

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        function handleStorageChange(event) {
            // Only handle changes to our specific key
            if (event.key !== USER_KEY) return;

            try {
                const storedUser = event.newValue;
                setUser(storedUser ? JSON.parse(storedUser) : null);
            } catch (error) {
                console.warn('Failed to parse user data from storage event:', error);
                setUser(null);
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const setLocalUser = (userData) => {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
            console.warn('localStorage is not available on the server side');
            return;
        }

        try {
            if (userData) {
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                setUser(userData);
            } else {
                localStorage.removeItem(USER_KEY);
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to update user data in localStorage:', error);
            // Still update the state even if localStorage fails
            setUser(userData);
        }
    };

    return { user, setLocalUser };
}

export default useUser;