"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { AlertCircle, Clock, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export default function ProfileApproval({ filteredTutor, profileData }) {
    const [showProfileChecklist, setShowProfileChecklist] = useState(false);
    const [approvalMessage, setApprovalMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [coursesMap, setCoursesMap] = useState({});
    const fetchedCourses = useRef(false);

    // Fetch all courses and map by name for lookup
    useEffect(() => {
        if (fetchedCourses.current) return;
        fetchedCourses.current = true;
        axios.get("/courses").then(res => {
            if (Array.isArray(res.data?.data)) {
                // Map by name for lookup, store id and category
                const map = {};
                res.data.data.forEach(course => {
                    map[course.name] = {
                        id: course.id,
                        course_category: course.course_category?.id || course.course_category_id || course.category_id || null
                    };
                });
                setCoursesMap(map);
            }
        });
    }, []);

    // Get editable values from ProfileInfoForm local state if available
    // We'll try to get them from window if ProfileInfoForm sets them globally, or you can lift state up if needed
    // For now, fallback to filteredTutor values if not editable

    // Prefer profileData values if available, fallback to filteredTutor
    const getField = (key, fallback) => {
        if (profileData && profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== "") {
            return profileData[key];
        }
        return fallback;
    };

    const handleSubmit = async () => {
        if (!filteredTutor) return;
        setSubmitting(true);
        setError("");
        setSuccess(false);
        try {
            // PATCH tutor profile as before
            await axios.patch(`/tutors/${filteredTutor.id}`, {
                first_name: getField("firstName", filteredTutor.first_name),
                last_name: getField("lastName", filteredTutor.last_name),
                mobile: getField("phone", filteredTutor.mobile) || "", // use 'phone' from profileData
                full_profile: getField("bio", filteredTutor.full_profile) || "",
                years_of_experience: getField("experience", filteredTutor.years_of_experience) || "",
                summary: approvalMessage,
                verified_tutor: false,
            });

            // POST to /tutor-course-expertise for each selected subject (course)
            const years_of_experience = getField("experience", filteredTutor.years_of_experience) || "";
            const tutorId = filteredTutor.id;
            const selectedSubjects = Array.isArray(profileData.subjects) ? profileData.subjects : [];
            // Only send if we have course mapping
            const postPromises = selectedSubjects.map(subjectName => {
                const courseInfo = coursesMap[subjectName];
                if (!courseInfo || !courseInfo.id) return null;
                return axios.post("/tutor-course-expertise", {
                    verified: false,
                    years_of_experience,
                    display_sequence: null,
                    rating_score: null,
                    tutor: tutorId,
                    course: courseInfo.id,
                    course_category: courseInfo.course_category,
                    rated_by_employee: null
                });
            }).filter(Boolean);
            if (postPromises.length > 0) {
                await Promise.all(postPromises);
            }

            setSuccess(true);
        } catch (e) {
            setError("Server under maintenance. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Clock className="w-5 h-5" />
                    Request for Profile Approval
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-medium mb-4">Submit Profile for Admin Approval</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="approvalMessage">Message to Admin (Optional)</Label>
                            <Textarea
                                id="approvalMessage"
                                placeholder="Add any additional information or notes for the admin review..."
                                rows={4}
                                value={approvalMessage}
                                onChange={e => setApprovalMessage(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800" onClick={() => setShowProfileChecklist(!showProfileChecklist)}>
                                <span>•••</span>
                                <span>Profile Review Checklist</span>
                            </button>
                            {showProfileChecklist && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                                    <h4 className="font-medium text-blue-900 mb-2">Profile Review Checklist:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>✓ Profile picture uploaded</li>
                                        <li>✓ Complete bio and teaching approach</li>
                                        <li>✓ Subject expertise defined</li>
                                        <li>✓ Qualifications and certifications listed</li>
                                        <li>✓ Introduction video uploaded</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={submitting || !filteredTutor}>
                            <Send className="w-4 h-4 mr-2" />
                            {submitting ? "Submitting..." : "Submit Profile for Approval"}
                        </Button>
                        {success && <div className="text-green-600 mt-2">Profile submitted for approval!</div>}
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-800">Approval Process</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Your profile will be reviewed by our admin team to ensure it meets our quality standards. You will
                                receive a notification once your profile is approved or if any changes are needed. Typical review
                                time is 24-48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
