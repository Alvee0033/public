"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppSelector } from "@/redux/hooks"
import { GraduationCap, Users, Clock, Star } from "lucide-react"

export default function TutorsPlanBundlePage() {
    const isAuthenticated = useAppSelector((state) => state?.auth?.isAuthenticated)
    const href = isAuthenticated ? "/" : "/register"
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge variant="secondary" className="mb-4">
                        ScholarPASS Partnership
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ScholarPASS Unlimited Tutoring Bundle with ScholarPASS
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
                        ScholarPASS, a ScholarPASS subsidiary, delivers the Unlimited Live Tutoring Bundle — offering personalized
                        K–12 academic support, test preparation, coding, and robotics training, with a primary focus on U.S.-based
                        K–12 students through ScholarPASS scholarships.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <CardTitle>K-12 Academic Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Comprehensive tutoring across all K-12 subjects with personalized learning plans and progress
                                    tracking.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-secondary-foreground" />
                                </div>
                                <CardTitle>Expert Tutors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Access to qualified tutors specializing in various subjects, test prep, coding, and robotics training.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-accent-foreground" />
                                </div>
                                <CardTitle>Unlimited Sessions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    No limits on tutoring sessions - learn at your own pace with as much support as you need.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle>Scholarship Integration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Seamlessly integrated with ScholarPASS scholarships to make tutoring affordable for all students.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Start button: links to home if authenticated, otherwise to register */}
                    <div className="text-center mt-12">
                        <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white">
                            <Link href={href}>Get Started with ScholarPASS</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
