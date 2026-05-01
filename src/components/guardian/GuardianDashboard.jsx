"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Overview } from "../Overview";
import { Communication } from "./Communication";
import { ProgressTracker } from "./ProgressTracker";
import { Recommendations } from "./Recommendations";
import { Schedule } from "./Schedule";

export default function GuardianDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    (<div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Guardian Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressTracker />
        </TabsContent>
        <TabsContent value="schedule">
          <Schedule />
        </TabsContent>
        <TabsContent value="communication">
          <Communication />
        </TabsContent>
        <TabsContent value="recommendations">
          <Recommendations />
        </TabsContent>
      </Tabs>
    </div>)
  );
}

