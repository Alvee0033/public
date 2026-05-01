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

export default function StudentInfoStep({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide any information you'd like to share. All fields are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.studentInfo?.firstName || ""}
                onChange={(e) =>
                  updateFormData("studentInfo", {
                    ...formData.studentInfo,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.studentInfo?.lastName || ""}
                onChange={(e) =>
                  updateFormData("studentInfo", {
                    ...formData.studentInfo,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.studentInfo?.email || ""}
              onChange={(e) =>
                updateFormData("studentInfo", {
                  ...formData.studentInfo,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.studentInfo?.phone || ""}
              onChange={(e) =>
                updateFormData("studentInfo", {
                  ...formData.studentInfo,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.studentInfo?.dateOfBirth || ""}
              onChange={(e) =>
                updateFormData("studentInfo", {
                  ...formData.studentInfo,
                  dateOfBirth: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select
              value={formData.studentInfo?.gradeLevel || ""}
              onValueChange={(value) =>
                updateFormData("studentInfo", {
                  ...formData.studentInfo,
                  gradeLevel: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    Grade {i + 1}
                  </SelectItem>
                ))}
                <SelectItem value="college">College/University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.studentInfo?.address || ""}
              onChange={(e) =>
                updateFormData("studentInfo", {
                  ...formData.studentInfo,
                  address: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-between pt-4">
            {onPrev && (
              <Button type="button" variant="outline" onClick={onPrev}>
                Previous
              </Button>
            )}
            <Button type="submit" className="ml-auto text-white">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}