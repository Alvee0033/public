"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from '@/lib/axios';
import SubjectExpertise from "./SubjectExpertise";

export default function SubjectExpertiseEdit({ open, onClose, expertiseData, tutorId, onSave }) {
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        setForm({
            //subjects: expertiseData?.subjects || [],
            qualifications: expertiseData?.qualifications || "",
            teaching_approach: expertiseData?.teaching_approach || "",
        });
    }, [expertiseData]);

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
                //subjects: form.subjects,
                qualifications: form.qualifications,
                teaching_approach: form.teaching_approach,
    };
            const res = await axios.patch(`/tutors/${tutorId}`, payload);
            onSave && onSave(res.data?.data || res.data);
            onClose && onClose();
        } catch (error) {
            setError("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <SubjectExpertise
                    form={form}
                    onChange={handleChange}
                    error={error}
                    saving={saving}
                />
                <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                    Save Changes
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};