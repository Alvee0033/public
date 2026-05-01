import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, Star, ArrowRight, Code, Clock, User, Beaker, MapPin, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import axios from "@/lib/axios"
import { Button } from "../ui/button"


const Labs = () => {
    return (

        <div className="py-16 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-heading mb-4">Learn & Innovate from Local STEM & Robotic Labs</h2>
                    <p className="text-muted-foreground">Hands-on learning experiences in your selected hub area</p>
                    <Badge variant="outline" className="mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        Brooklyn, NY Hub Selected
                    </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Beaker className="w-6 h-6 text-white" />
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">Starting Jan 20</Badge>
                            </div>
                            <CardTitle className="text-xl">AI & Machine Learning Lab</CardTitle>
                            <CardDescription>Build real AI projects with Python and TensorFlow</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span>Brooklyn Tech Center - 0.8 miles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span>6/12 enrolled</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>With Scholarship:</span>
                                    <span className="text-green-600">$199</span>
                                </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Enroll Now</Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-purple-200 bg-purple-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <Badge className="bg-purple-100 text-purple-800">Starting Jan 25</Badge>
                            </div>
                            <CardTitle className="text-xl">Robotics Engineering</CardTitle>
                            <CardDescription>Design and program autonomous robots</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    <span>STEM Academy Brooklyn - 1.2 miles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span>4/10 enrolled</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>With Scholarship:</span>
                                    <span className="text-green-600">$299</span>
                                </div>
                            </div>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">Enroll Now</Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-orange-200 bg-orange-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <Badge className="bg-orange-100 text-orange-800">Starting Feb 1</Badge>
                            </div>
                            <CardTitle className="text-xl">3D Design & Printing</CardTitle>
                            <CardDescription>Create and prototype with cutting-edge 3D technology</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-600" />
                                    <span>Maker Space Brooklyn - 0.5 miles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-orange-600" />
                                    <span>8/15 enrolled</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>With Scholarship:</span>
                                    <span className="text-green-600">$149</span>
                                </div>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">Enroll Now</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        View All Labs in Brooklyn, NY
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default Labs;
