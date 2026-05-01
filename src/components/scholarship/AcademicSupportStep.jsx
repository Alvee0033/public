"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AcademicSupportStep({ formData, updateFormData, onNext, onPrev }) {
  const supportNeeds = [
    "Homework help and study strategies",
    "Test preparation and study skills",
    "Time management and organization",
    "Reading comprehension and writing skills",
    "Math problem-solving techniques",
    "Science lab support and experiments",
    "Research and project guidance",
    "College preparation and planning"
  ];

  const accommodations = [
    "Extended time for assignments",
    "Visual learning materials",
    "Audio/verbal instruction",
    "Hands-on learning activities",
    "Frequent breaks during sessions",
    "One-on-one attention",
    "Assistive technology support",
    "Modified curriculum pace"
  ];

  const handleSupportChange = (support, checked) => {
    const currentSupport = formData.academicSupport?.supportNeeds || [];
    let updatedSupport;
    
    if (checked) {
      updatedSupport = [...currentSupport, support];
    } else {
      updatedSupport = currentSupport.filter(s => s !== support);
    }
    
    updateFormData("academicSupport", {
      ...formData.academicSupport,
      supportNeeds: updatedSupport
    });
  };

  const handleAccommodationChange = (accommodation, checked) => {
    const currentAccommodations = formData.academicSupport?.accommodations || [];
    let updatedAccommodations;
    
    if (checked) {
      updatedAccommodations = [...currentAccommodations, accommodation];
    } else {
      updatedAccommodations = currentAccommodations.filter(a => a !== accommodation);
    }
    
    updateFormData("academicSupport", {
      ...formData.academicSupport,
      accommodations: updatedAccommodations
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Support Needs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Help us understand what type of academic support would be beneficial for you. All fields are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">
              What type of academic support do you need? (Optional - select any that apply)
            </Label>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportNeeds.map((support) => (
                <div key={support} className="flex items-center space-x-2">
                  <Checkbox
                    id={support}
                    checked={(formData.academicSupport?.supportNeeds || []).includes(support)}
                    onCheckedChange={(checked) => handleSupportChange(support, checked)}
                  />
                  <Label htmlFor={support} className="text-sm">{support}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">
              Do you have any learning differences or need special accommodations? (Optional)
            </Label>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {accommodations.map((accommodation) => (
                <div key={accommodation} className="flex items-center space-x-2">
                  <Checkbox
                    id={accommodation}
                    checked={(formData.academicSupport?.accommodations || []).includes(accommodation)}
                    onCheckedChange={(checked) => handleAccommodationChange(accommodation, checked)}
                  />
                  <Label htmlFor={accommodation} className="text-sm">{accommodation}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="currentGrades">Current academic performance/grades</Label>
            <Textarea
              id="currentGrades"
              placeholder="Please describe your current grades and academic standing..."
              value={formData.academicSupport?.currentGrades || ""}
              onChange={(e) =>
                updateFormData("academicSupport", {
                  ...formData.academicSupport,
                  currentGrades: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="previousTutoring">Previous tutoring or academic support experience</Label>
            <Textarea
              id="previousTutoring"
              placeholder="Have you received tutoring or academic support before? What worked well or didn't work?"
              value={formData.academicSupport?.previousTutoring || ""}
              onChange={(e) =>
                updateFormData("academicSupport", {
                  ...formData.academicSupport,
                  previousTutoring: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="learningChallenges">Specific learning challenges or areas of difficulty</Label>
            <Textarea
              id="learningChallenges"
              placeholder="Describe any specific subjects or skills you find challenging..."
              value={formData.academicSupport?.learningChallenges || ""}
              onChange={(e) =>
                updateFormData("academicSupport", {
                  ...formData.academicSupport,
                  learningChallenges: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="supportGoals">Academic goals for this scholarship program</Label>
            <Textarea
              id="supportGoals"
              placeholder="What do you hope to achieve through our academic support program?"
              value={formData.academicSupport?.supportGoals || ""}
              onChange={(e) =>
                updateFormData("academicSupport", {
                  ...formData.academicSupport,
                  supportGoals: e.target.value,
                })
              }
            />
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