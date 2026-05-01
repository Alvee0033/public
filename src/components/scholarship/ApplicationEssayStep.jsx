"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ApplicationEssayStep({ formData, updateFormData, onNext, onPrev }) {
  const essayPrompts = [
    {
      id: "motivation",
      question: "Why are you applying for this scholarship and how will it help you achieve your goals?",
      placeholder: "Describe your motivation and how this scholarship aligns with your educational and career aspirations..."
    },
    {
      id: "challenges",
      question: "Describe a challenge you've overcome and what you learned from the experience.",
      placeholder: "Share a personal challenge and how overcoming it has shaped who you are today..."
    },
    {
      id: "contribution",
      question: "How do you plan to use your education to make a positive impact in your community?",
      placeholder: "Explain how you want to give back to your community with the knowledge and skills you'll gain..."
    },
    {
      id: "unique",
      question: "What makes you unique and why should you be selected for this scholarship?",
      placeholder: "Highlight your unique qualities, experiences, or perspectives that set you apart..."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Essay</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please share any thoughts on the following questions. All responses are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {essayPrompts.map((prompt, index) => (
            <div key={prompt.id} className="space-y-2">
              <Label htmlFor={prompt.id} className="text-base font-medium">
                {index + 1}. {prompt.question}
              </Label>
              <Textarea
                id={prompt.id}
                placeholder={prompt.placeholder}
                value={formData.applicationEssay?.[prompt.id] || ""}
                onChange={(e) =>
                  updateFormData("applicationEssay", {
                    ...formData.applicationEssay,
                    [prompt.id]: e.target.value,
                  })
                }
                className="min-h-[120px]"
              />
              <div className="text-xs text-muted-foreground">
                Optional: 150-300 words
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-base font-medium">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Is there anything else you'd like us to know about you or your application?"
              value={formData.applicationEssay?.additionalInfo || ""}
              onChange={(e) =>
                updateFormData("applicationEssay", {
                  ...formData.applicationEssay,
                  additionalInfo: e.target.value,
                })
              }
              className="min-h-[100px]"
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