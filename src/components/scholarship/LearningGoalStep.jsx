"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function LearningGoalStep({ formData, updateFormData, onNext, onPrev }) {
  const learningGoals = [
    "Improve grades in specific subjects",
    "Prepare for standardized tests",
    "Learn coding and programming",
    "Develop robotics skills",
    "College preparation",
    "Career exploration",
    "STEM enrichment",
    "Creative skills development"
  ];

  const handleGoalChange = (goal, checked) => {
    const currentGoals = formData.learningGoals?.goals || [];
    let updatedGoals;
    
    if (checked) {
      updatedGoals = [...currentGoals, goal];
    } else {
      updatedGoals = currentGoals.filter(g => g !== goal);
    }
    
    updateFormData("learningGoals", {
      ...formData.learningGoals,
      goals: updatedGoals
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Goals & Objectives</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your learning goals with us. All fields are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">What are your primary learning goals? (Optional - select any that apply)</Label>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {learningGoals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={(formData.learningGoals?.goals || []).includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked)}
                  />
                  <Label htmlFor={goal} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="specificSubjects">Specific subjects you want to focus on</Label>
            <Textarea
              id="specificSubjects"
              placeholder="e.g., Mathematics, Science, English, History..."
              value={formData.learningGoals?.specificSubjects || ""}
              onChange={(e) =>
                updateFormData("learningGoals", {
                  ...formData.learningGoals,
                  specificSubjects: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="currentChallenges">What are your current academic challenges?</Label>
            <Textarea
              id="currentChallenges"
              placeholder="Describe any specific areas where you need help..."
              value={formData.learningGoals?.currentChallenges || ""}
              onChange={(e) =>
                updateFormData("learningGoals", {
                  ...formData.learningGoals,
                  currentChallenges: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="futureGoals">Future educational/career goals</Label>
            <Textarea
              id="futureGoals"
              placeholder="What do you hope to achieve through this scholarship?"
              value={formData.learningGoals?.futureGoals || ""}
              onChange={(e) =>
                updateFormData("learningGoals", {
                  ...formData.learningGoals,
                  futureGoals: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="preferredLearningStyle">Preferred learning style</Label>
            <Textarea
              id="preferredLearningStyle"
              placeholder="Visual, auditory, hands-on, group work, one-on-one, etc."
              value={formData.learningGoals?.preferredLearningStyle || ""}
              onChange={(e) =>
                updateFormData("learningGoals", {
                  ...formData.learningGoals,
                  preferredLearningStyle: e.target.value,
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