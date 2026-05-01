"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock } from 'lucide-react';

const learningPaths = [
    {
        title: "Web Development",
        progress: 45,
        courses: 12,
        hours: 36,
        skills: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
        title: "Data Science",
        progress: 25,
        courses: 8,
        hours: 24,
        skills: ["Python", "Statistics", "Machine Learning"]
    },
    {
        title: "Mobile Development",
        progress: 15,
        courses: 6,
        hours: 18,
        skills: ["React Native", "Flutter", "iOS"]
    }
];

export default function SelfLearningPage() {
    return (
        <main className="">
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Self Learning</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>My Learning Paths</CardTitle>
                        <CardDescription>Track your progress across different domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {learningPaths.map((path, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{path.title}</CardTitle>
                                        <Progress value={path.progress} className="mt-2" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{path.courses} Courses</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{path.hours} Hours</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {path.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}