"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, User } from "lucide-react";
import { useRef, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { handleProfileMediaUpload } from "./ProfileMediaUpload";

export default function ProfileInfoForm({ profileData, onChange, tutorId }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState(profileData.profile_picture_url || profileData.profile_picture || "");

    // Update local state if parent changes (for hot reloads or prop updates)
    // Optionally, useEffect can be added to sync profilePicUrl with profileData

    const handleProfilePicClick = () => {
        if (!uploading) fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !tutorId) return;
        setUploading(true);
        try {
            const url = await handleProfileMediaUpload({ tutorId, file, type: "image" });
            setProfilePicUrl(url);
        } catch { }
        setUploading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                    <User className="w-5 h-5" />
                    Profile Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                    <div
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative"
                        onClick={handleProfilePicClick}
                        title={uploading ? "Uploading..." : "Click to upload profile picture"}
                        style={{ opacity: uploading ? 0.6 : 1 }}
                    >
                        {profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Upload</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                <span className="text-xs text-gray-500">Uploading...</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={profileData.firstName} onChange={e => onChange("firstName", e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={profileData.lastName} onChange={e => onChange("lastName", e.target.value)} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profileData.username} disabled />
                    <p className="text-sm text-gray-500 mt-1">This is your public display name.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profileData.email} disabled />
                        <p className="text-sm text-gray-500 mt-1">Your email address will not be shared publicly.</p>
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <PhoneInput
                            country={'us'}
                            value={profileData.phone}
                            onChange={value => onChange("phone", value)}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: false,
                            }}
                            inputStyle={{ width: '100%' }}
                        />
                        <p className="text-sm text-gray-500 mt-1">Your phone number for account verification.</p>
                    </div>
                </div>
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell students about yourself, your teaching experience, and approach..." value={profileData.bio} onChange={e => onChange("bio", e.target.value)} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input id="experience" type="number" value={profileData.experience} onChange={e => onChange("experience", e.target.value)} />
                    </div>
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button> */}
            </CardContent>
        </Card>
    );
}
