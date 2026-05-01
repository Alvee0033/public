"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";
import React from "react";


export default function SubjectExpertise({ form = {}, onChange, error, saving, subjects = [] }) {
    // defensive defaults: form may contain subjects, qualifications, teaching_approach
    const subjectsList = Array.isArray(subjects) ? subjects : [];

    // Local state fallback when parent doesn't provide an onChange handler
    const [localForm, setLocalForm] = React.useState(form || {});

    React.useEffect(() => {
        // Merge parent form into local state so local user edits (like selected subjects)
        // are not immediately lost if the parent doesn't echo them back.
        setLocalForm(prev => ({ ...(prev || {}), ...(form || {}) }));
    }, [form]);

    // Use localForm as the source of truth for display so selections update immediately.
    const profileSubjects = Array.isArray(localForm.subjects) ? localForm.subjects : [];

    // Only allow one subject to be selected at a time
    const availableSubjects = subjectsList.filter(subject => !profileSubjects.includes(subject));
    const selectedSubject = profileSubjects[0] || "";

    const updateField = (field, value) => {
        // always update local state so UI reflects changes immediately
        setLocalForm(prev => ({ ...(prev || {}), [field]: value }));
        // also notify parent if handler exists
        if (typeof onChange === "function") {
            onChange(field, value);
        }
    };

    const handleAdd = (subject) => {
        if (!subject) return;
        // Replace the current subject with the new one
        updateField('subjects', [subject]);
    };

    const handleRemove = (subject) => {
        if (!subject) return;
        updateField('subjects', []);
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                    <BookOpen className="w-5 h-5" />
                    Subject Expertise
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Current Subject</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSubject && (
                            <Badge key={selectedSubject} variant="secondary" className="cursor-pointer hover:bg-red-100" onClick={() => handleRemove(selectedSubject)}>
                                {selectedSubject} ×
                            </Badge>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mr-2">Add Course</Label>
                    <Combobox
                        options={availableSubjects}
                        value={selectedSubject}
                        onChange={handleAdd}
                        placeholder="Add Course"
                    />
                </div>
                <div>
                    <Label htmlFor="qualifications">Qualifications & Certifications</Label>
                    <Textarea id="qualifications" placeholder="List your degrees, certifications, and relevant qualifications..." rows={4} value={localForm.qualifications || ''} onChange={(e) => updateField('qualifications', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="approach">Teaching Approach</Label>
                    <Textarea id="approach" placeholder="Describe your teaching methodology and approach..." rows={3} value={localForm.teaching_approach || ''} onChange={(e) => updateField('teaching_approach', e.target.value)} />
                </div>
            </CardContent>
        </Card>
    );
}
