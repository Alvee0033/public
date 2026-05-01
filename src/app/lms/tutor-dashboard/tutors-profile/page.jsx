
"use client";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import ProfileApproval from "./_components/ProfileApproval";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileInfoForm from "./_components/ProfileInfoForm";
import SubjectExpertise from "./_components/SubjectExpertise";
import VideoProfile from "./_components/VideoProfile";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export default function TutorProfile() {
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
    const [filteredTutor, setFilteredTutor] = useState(null);
    const [checking, setChecking] = useState(true);

    // Get user data from Redux store
    const user = useAppSelector((state) => state.auth.user);

    // Fetch filtered tutor on mount and redirect if not verified
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
                        // Redirect to approval-pending page
                        if (typeof window !== "undefined") {
                            window.location.href = "/lms/tutor-dashboard/tutors-profile/approval-pending";
                        }
                        return;
                    }
                    else if (foundTutor && foundTutor.verified_tutor === true && foundTutor.summary !== null) {
                        // Redirect to profile approval page
                        if (typeof window !== "undefined") {
                            window.location.href = "/lms/tutor-dashboard/tutors-profile/approval";
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
                // ignore error for now
            }
            setChecking(false);
        }
        
        if (user) {
            fetchUserAndTutor();
        } else {
            setChecking(false);
        }
    }, [user]);

    const [subjects, setSubjects] = useState([]);

    // Fetch subjects from /courses API
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const res = await axios.get("/courses");
                // Assuming each course has a 'name' property
                const courseSubjects = Array.isArray(res.data.data)
                    ? res.data.data.map(course => course.name)
                    : [];
                setSubjects(courseSubjects);
            } catch (err) {
                setSubjects([]);
            }
        }
        fetchSubjects();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubjectAdd = subject => {
        if (!profileData.subjects.includes(subject)) {
            setProfileData(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));
        }
    };

    const handleSubjectRemove = subject => {
        setProfileData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== subject) }));
    };

    if (checking) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4">
                    {/* <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg> */}
                     {/* <span className="animate-spin h-5 w-5 inline-block">⏳</span> */}
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                    <div className="text-lg font-semibold text-gray-700 mt-2">Checking for approval...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader name={profileData.firstName + " " + profileData.lastName} />
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <ProfileInfoForm profileData={profileData} onChange={handleInputChange} tutorId={filteredTutor?.id} />
                <div className="grid grid-cols-2 gap-6">
                    <SubjectExpertise profileData={profileData} subjects={subjects} onAdd={handleSubjectAdd} onRemove={handleSubjectRemove} />
                    <VideoProfile tutorId={filteredTutor?.id} />
                </div>
                <ProfileApproval filteredTutor={filteredTutor} profileData={profileData} />
            </div>
        </div>
    );
}