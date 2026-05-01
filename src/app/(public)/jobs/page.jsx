"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import PublicJobList from "./_components/public-job-list"
import useUser from "@/hooks/useUser"
import Link from "next/link";

export default function JobsPage() {
    const { user } = useUser();
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-start justify-center pt-40">
                <div className="text-center p-8">
                    <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to view and apply for job listings.</p>
                    <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Sign In to Continue
                    </Button>
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-8 px-4 bg-gray-50">
                <div className="container mx-auto text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
                        Find Your Dream Job
                    </h1>
                    <p className="text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                        Discover exciting career opportunities and apply to jobs that match your skills. Browse openings from top companies or refer qualified candidates.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                        Browse All Jobs
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </section>
            <section>
                <PublicJobList />
            </section>
        </div>
    )
}
