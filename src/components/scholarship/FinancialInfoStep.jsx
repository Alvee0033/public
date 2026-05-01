"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FinancialInfoStep({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          This information helps us determine scholarship eligibility and amount. All information is kept confidential.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="householdIncome">Annual Household Income Range</Label>
            <Select
              value={formData.financialInfo?.householdIncome || ""}
              onValueChange={(value) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  householdIncome: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-25k">Under $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                <SelectItem value="150k-plus">Over $150,000</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="householdSize">Number of people in household</Label>
            <Input
              id="householdSize"
              type="number"
              min="1"
              max="20"
              value={formData.financialInfo?.householdSize || ""}
              onChange={(e) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  householdSize: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="numberOfStudents">Number of students in household</Label>
            <Input
              id="numberOfStudents"
              type="number"
              min="1"
              max="10"
              value={formData.financialInfo?.numberOfStudents || ""}
              onChange={(e) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  numberOfStudents: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="currentEducationExpenses">
              Current annual education expenses (tutoring, courses, etc.)
            </Label>
            <Input
              id="currentEducationExpenses"
              type="number"
              min="0"
              placeholder="Enter amount in USD"
              value={formData.financialInfo?.currentEducationExpenses || ""}
              onChange={(e) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  currentEducationExpenses: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="financialHardship">
              Are you experiencing any financial hardship that affects your ability to pay for educational services?
            </Label>
            <Select
              value={formData.financialInfo?.financialHardship || ""}
              onValueChange={(value) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  financialHardship: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="somewhat">Somewhat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="financialDetails">
              Please provide additional details about your financial situation (optional)
            </Label>
            <Textarea
              id="financialDetails"
              placeholder="Any additional information that would help us understand your financial need..."
              value={formData.financialInfo?.financialDetails || ""}
              onChange={(e) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  financialDetails: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="otherScholarships">
              Are you receiving or have you applied for other scholarships or financial aid?
            </Label>
            <Textarea
              id="otherScholarships"
              placeholder="Please list any other scholarships or financial aid you're receiving or have applied for..."
              value={formData.financialInfo?.otherScholarships || ""}
              onChange={(e) =>
                updateFormData("financialInfo", {
                  ...formData.financialInfo,
                  otherScholarships: e.target.value,
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