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

export default function GuardianInfoStep({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guardian/Parent Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide any guardian information you'd like to share. All fields are optional.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guardianFirstName">Guardian First Name</Label>
              <Input
                id="guardianFirstName"
                value={formData.guardianInfo?.firstName || ""}
                onChange={(e) =>
                  updateFormData("guardianInfo", {
                    ...formData.guardianInfo,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="guardianLastName">Guardian Last Name</Label>
              <Input
                id="guardianLastName"
                value={formData.guardianInfo?.lastName || ""}
                onChange={(e) =>
                  updateFormData("guardianInfo", {
                    ...formData.guardianInfo,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="relationship">Relationship to Student</Label>
            <Select
              value={formData.guardianInfo?.relationship || ""}
              onValueChange={(value) =>
                updateFormData("guardianInfo", {
                  ...formData.guardianInfo,
                  relationship: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Legal Guardian</SelectItem>
                <SelectItem value="grandparent">Grandparent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="guardianEmail">Guardian Email</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianInfo?.email || ""}
              onChange={(e) =>
                updateFormData("guardianInfo", {
                  ...formData.guardianInfo,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              type="tel"
              value={formData.guardianInfo?.phone || ""}
              onChange={(e) =>
                updateFormData("guardianInfo", {
                  ...formData.guardianInfo,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={formData.guardianInfo?.occupation || ""}
              onChange={(e) =>
                updateFormData("guardianInfo", {
                  ...formData.guardianInfo,
                  occupation: e.target.value,
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