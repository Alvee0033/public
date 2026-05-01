"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from '@/lib/axios';
import ProfileInfoForm from "./ProfileInfoForm";

export default function ProfileEditModal({ open, onClose, profileData, tutorId, onSave }) {
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    
    // use a native confirm to avoid nested Dialog z-index/visibility issues

    useEffect(() => {
        setForm({
            firstName: profileData?.first_name ?? profileData?.firstName ?? "",
            lastName: profileData?.last_name ?? profileData?.lastName ?? "",
            phone: profileData?.mobile ?? profileData?.phone ?? "",
            bio: profileData?.full_profile ?? profileData?.bio ?? "",
            experience: profileData?.years_of_experience ?? profileData?.experience ?? "",
            profile_picture_url: profileData?.profile_picture ?? profileData?.profile_picture_url ?? "",
        });
    }, [profileData]);

    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
    };

    const handleSubmit = async () => {
        setError("");
        if (!tutorId) {
            setError("Missing tutor id");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                first_name: form.firstName,
                last_name: form.lastName,
                mobile: form.phone,
                full_profile: form.bio,
                years_of_experience: form.experience,
                profile_picture: form.profile_picture_url,
            };
            const res = await axios.patch(`/tutors/${tutorId}`, payload);
            onSave && onSave(res.data?.data || res.data);
            onClose && onClose();
        } catch (e) {
            console.error(e);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const confirmAndSubmit = async () => {
        // open our confirmation modal instead of using native confirm
        setConfirmOpen(true);
    };

    const onConfirmSave = async () => {
        // close confirmation modal and proceed
        setConfirmOpen(false);
        await handleSubmit();
    };

    if (!open) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogHeader>
                    <DialogTitle>Edit Profile Information</DialogTitle>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <ProfileInfoForm profileData={form} onChange={handleChange} tutorId={tutorId} />
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    {/* Inline action row so Save is visible inside the modal content as well */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={confirmAndSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={confirmAndSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </DialogFooter>
            </Dialog>
            {/* Confirmation modal shown when user clicks Save */}
            <Dialog open={confirmOpen} onOpenChange={(val) => setConfirmOpen(val)}>
                <DialogHeader>
                    <DialogTitle>Confirm Save</DialogTitle>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <p>Are you sure you want to save changes to your profile?</p>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    {/* Inline actions in content to ensure buttons are visible on small screens */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={onConfirmSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Confirm'}</Button>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={saving}>Cancel</Button>
                    <Button onClick={onConfirmSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Confirm'}</Button>
                </DialogFooter>
            </Dialog>
            {/* confirmation handled via in-app Dialog (not native confirm) */}
        </>
    );
}
