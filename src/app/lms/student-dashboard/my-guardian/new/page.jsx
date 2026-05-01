"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks"; // Add this import
import { Loader2, RefreshCw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Add useEffect
import { toast } from "sonner";
import useSWR from "swr";

const AddGuardianPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get user from Redux store
    // Get user data from Redux state
    const effectiveUser = useAppSelector((state) => state.auth.user);

    // Simple form state with only the required fields
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: ""
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Basic form validation
    const isFormValid = () => {
        return (
            formData.username &&
            formData.password &&
            formData.first_name &&
            formData.email
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!effectiveUser?.id) {
            toast.error("Unable to determine student relationship. Please try again later.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create the API request body with the required fields
            const requestData = {
                // Form fields
                username: formData.username,
                password_hash: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name || "",
                email: formData.email,
                phone_number: formData.phone_number || "",

                // Default values for required API fields
                active_or_archive: true,
                email_confirmed: true,
                account_lock: true, // match your example (was false before)
                phone_number_confirmed: true, // match your example (was false before)
                two_factor_enabled: true, // match your example (was false before)
                lockout_enabled: true,
                access_failed_count: 0,
                lockout_end: null, // or a date string if you want to set a lockout end
                security_stamp: "auto-generated",
                profile_picture: "",
                profile_picture_url: "",
                profile_picture_thumbnail_url: "",
                whatsapp_subscribed: true, // match your example (was false before)
                email_subscribed: true,
                sms_subscribed: true, // match your example (was false before)
                master_country: 0,
                zone: 0,

                // Get student ID from the user data
                student: effectiveUser.id,
                tutor: 0,
                institute: 0,
                employee: 0,

                // Guardian role
                roles: ["5"], // as string, not number
                primary_role: 5,
                access_level: "Primary"
            };

            // First API call: Add Guardian User
            const response = await axios.post("/app-users/add-user", requestData);

            // Extract needed values from the response
            const guardianId = response.data?.data?.id;
            const studentId = response.data?.data?.student?.id;
            const guardianName = `${response.data?.data?.first_name || ""} ${response.data?.data?.last_name || ""}`.trim();
            const guardianEmail = response.data?.data?.email || "";
            const guardianPhone = response.data?.data?.phone_number || "";
            const studentName = effectiveUser.first_name
                ? `${effectiveUser.first_name} ${effectiveUser.last_name || ""}`.trim()
                : "";

            // Prepare second request body
            const accessRequest = {
                access_level: response.data?.data?.access_level || "Primary",
                access_date: new Date().toISOString(),
                active: true,
                student: studentId,
                guardian_user: guardianId,
                student_name: studentName,
                contact_id: 0,
                guardian_name: guardianName,
                guardian_email: guardianEmail,
                guardian_phone: guardianPhone,
                guardian_job_title: ""
            };

            // Second API call: Link Guardian to Student
            await axios.post("/student-guardian-accesses", accessRequest);

            toast.success("Guardian added successfully!");
            router.push("/lms/student-dashboard/my-guardian");
        } catch (error) {
            console.error("Error adding guardian:", error);
            toast.error(error.response?.data?.message || "Failed to add guardian");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show error if user data is not available
    if (!effectiveUser) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] max-w-md mx-auto text-center">
                <div className="bg-red-50 p-6 rounded-lg">
                    <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load user data</h3>
                    <p className="text-red-600 mb-4">
                        We couldn't retrieve your user information. This is needed to link the guardian to your account.
                    </p>
                    <Button
                        onClick={() => {
                            setRetryCount(prev => prev + 1);
                            refetchUserData();
                        }}
                        className="flex items-center justify-center gap-2"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                        If the problem persists, try refreshing the page or signing out and back in.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Add New Guardian</h1>
                        <p className="text-muted-foreground">
                            Complete the form to add a new guardian to your account.
                        </p>
                    </div>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Details Section */}
                        <div className="space-y-4 pt-4 border-t">
                            <h2 className="text-xl font-semibold">Account Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4 pt-4 border-t">
                            <h2 className="text-xl font-semibold">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/lms/student-dashboard/my-guardian")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={!isFormValid() || isSubmitting}
                                className="bg-gradient-to-r from-[#5f2ded] to-[#f2277e] text-white hover:opacity-90"
                            >
                                {isSubmitting ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Add Guardian
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AddGuardianPage;
