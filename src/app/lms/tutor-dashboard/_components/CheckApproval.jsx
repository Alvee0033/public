"use client";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

const CheckApproval = ({ onCheckComplete }) => {
    const [checking, setChecking] = useState(true);
    const [filteredTutor, setFilteredTutor] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        bio: "",
        subjects: [],
        experience: "",
    });

    // Get user data from Redux store
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        async function fetchUserAndTutor() {
            try {
                // Get tutor ID from Redux state
                const tutorId = user?.tutor_id;
                if (tutorId) {
                    const tutorsRes = await axios.get("/tutors?limit=1000");
                    const foundTutor = Array.isArray(tutorsRes.data.data)
                        ? tutorsRes.data.data.find(t => t.id === tutorId)
                        : null;
                    if (foundTutor && foundTutor.verified_tutor === false && foundTutor.summary !== null) {
                        if (typeof window !== "undefined") {
                            window.location.href = "/lms/tutor-dashboard/tutors-profile/approval-pending";
                        }
                        return;
                    }

                    setFilteredTutor(foundTutor || null);
                    if (foundTutor) {
                        setProfileData({
                            firstName: foundTutor.first_name || "",
                            lastName: foundTutor.last_name || "",
                            username: foundTutor.personal_email || foundTutor.email || "",
                            email: foundTutor.personal_email || foundTutor.email || "",
                            phone: foundTutor.mobile || "",
                            bio: foundTutor.full_profile || "",
                            subjects: foundTutor.subjects || [],
                            experience: foundTutor.years_of_experience ? String(foundTutor.years_of_experience) : "",
                        });
                    }
                }
            } catch (err) {
            }
            setChecking(false);
            if (onCheckComplete) {
                onCheckComplete({ filteredTutor, profileData });
            }
        }
        if (user) {
            fetchUserAndTutor();
        } else {
            setChecking(false);
        }

    }, [user, onCheckComplete]);

    if (checking) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <div className="text-lg font-semibold text-gray-700 mt-2">Checking for approval...</div>
                </div>
            </div>
        );
    }
    // Optionally, render nothing or children after check is complete
    return null;
};

export default CheckApproval;