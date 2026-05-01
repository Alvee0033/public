"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";

export default function CourseSelectionStep({ formData, updateFormData, onNext, onPrev }) {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axios.get("/scholarships", {
          params: { limit: 50 }
        });
        setScholarships(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const courseCategories = {
    "K-12 Tutoring": [
      "Mathematics (Elementary to AP Calculus)",
      "Science (Biology, Chemistry, Physics)",
      "English Language Arts",
      "Social Studies/History",
      "Foreign Languages",
      "Test Preparation (SAT, ACT, AP)"
    ],
    "Coding & Programming": [
      "Python Programming",
      "JavaScript & Web Development",
      "Java Programming",
      "C++ Programming",
      "Mobile App Development",
      "Game Development"
    ],
    "Robotics & STEM": [
      "Arduino Programming",
      "Raspberry Pi Projects",
      "3D Design & Printing",
      "Engineering Fundamentals",
      "Electronics & Circuits",
      "AI & Machine Learning Basics"
    ],
    "Creative & Career Skills": [
      "Digital Art & Design",
      "Music Production",
      "Video Editing",
      "Business & Entrepreneurship",
      "Public Speaking",
      "Creative Writing"
    ]
  };

  const handleCourseChange = (course, checked) => {
    const currentCourses = formData.courseSelection?.selectedCourses || [];
    let updatedCourses;
    
    if (checked) {
      updatedCourses = [...currentCourses, course];
    } else {
      updatedCourses = currentCourses.filter(c => c !== course);
    }
    
    updateFormData("courseSelection", {
      ...formData.courseSelection,
      selectedCourses: updatedCourses
    });
  };

  const handleScholarshipChange = (scholarshipId, checked) => {
    const currentScholarships = formData.courseSelection?.selectedScholarships || [];
    let updatedScholarships;
    
    if (checked) {
      updatedScholarships = [...currentScholarships, scholarshipId];
    } else {
      updatedScholarships = currentScholarships.filter(s => s !== scholarshipId);
    }
    
    updateFormData("courseSelection", {
      ...formData.courseSelection,
      selectedScholarships: updatedScholarships
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Selection & Scholarships</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select any courses and scholarships you're interested in. All selections are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Scholarships */}
          {scholarships.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-purple-600">Available Scholarships</h3>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading scholarships...</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 pl-4">
                  {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="flex items-start gap-2 p-3 border rounded-lg">
                      <Checkbox
                        id={`scholarship-${scholarship.id}`}
                        checked={(formData.courseSelection?.selectedScholarships || []).includes(scholarship.id)}
                        onCheckedChange={(checked) => handleScholarshipChange(scholarship.id, checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`scholarship-${scholarship.id}`} className="text-sm font-medium">
                          {scholarship.name}
                        </Label>
                        {scholarship.amount && (
                          <p className="text-sm text-green-600 font-semibold">${scholarship.amount}</p>
                        )}
                        {scholarship.short_description && (
                          <p className="text-xs text-muted-foreground mt-1">{scholarship.short_description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Course Categories */}
          {Object.entries(courseCategories).map(([category, courses]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg text-primary">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                {courses.map((course) => (
                  <div key={course} className="flex items-center space-x-2">
                    <Checkbox
                      id={course}
                      checked={(formData.courseSelection?.selectedCourses || []).includes(course)}
                      onCheckedChange={(checked) => handleCourseChange(course, checked)}
                    />
                    <Label htmlFor={course} className="text-sm">{course}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <Label htmlFor="additionalRequests">Additional course requests or specific topics</Label>
            <Textarea
              id="additionalRequests"
              placeholder="Any specific topics or courses not listed above?"
              value={formData.courseSelection?.additionalRequests || ""}
              onChange={(e) =>
                updateFormData("courseSelection", {
                  ...formData.courseSelection,
                  additionalRequests: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="learningPreference">Learning preference</Label>
            <div className="mt-2 space-y-2">
              {["One-on-one tutoring", "Small group sessions", "Self-paced online courses", "Hands-on lab sessions"].map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference}
                    checked={(formData.courseSelection?.learningPreferences || []).includes(preference)}
                    onCheckedChange={(checked) => {
                      const currentPrefs = formData.courseSelection?.learningPreferences || [];
                      let updatedPrefs;
                      
                      if (checked) {
                        updatedPrefs = [...currentPrefs, preference];
                      } else {
                        updatedPrefs = currentPrefs.filter(p => p !== preference);
                      }
                      
                      updateFormData("courseSelection", {
                        ...formData.courseSelection,
                        learningPreferences: updatedPrefs
                      });
                    }}
                  />
                  <Label htmlFor={preference} className="text-sm">{preference}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>
            <Button type="submit" className="text-white">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}