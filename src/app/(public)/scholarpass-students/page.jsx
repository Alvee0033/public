"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"

export default function ScholarPASSStudentsPage() {
    const [scholarships, setScholarships] = useState([])
    const [loading, setLoading] = useState(true)

    const stripHtml = (html) => {
        if (!html) return " ";
        return html.replace(/<[^>]*>/g, "");
    };

    const cardColors = [
        'border-cyan-200 bg-cyan-50/50',
        'border-purple-200 bg-purple-50/50',
        'border-orange-200 bg-orange-50/50',
        'border-teal-200 bg-teal-50/50',
        'border-green-200 bg-green-50/50',
        'border-blue-200 bg-blue-50/50',
        'border-pink-200 bg-pink-50/50',
        'border-indigo-200 bg-indigo-50/50',
        'border-yellow-200 bg-yellow-50/50',
        'border-red-200 bg-red-50/50'
    ]

    const SkeletonCard = () => (
        <Card className="hover:shadow-lg transition-shadow animate-pulse">
            <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </CardHeader>
            <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-2">
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const response = await axios.get('/scholarships')
                setScholarships(response.data.data || [])
            } catch (error) {
                console.error('Error fetching scholarships:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchScholarships()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge variant="secondary" className="mb-4">
                        For Students
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ScholarPASS for Students
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
                        Six transformative benefits that make learning unlimited for every student
                    </p>
                </div>
            </section>

            {/* Available Scholarships */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Available Scholarships</h2>
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scholarships.map((scholarship, index) => (
                                <Card key={scholarship.id || index} className={`hover:shadow-lg transition-shadow ${cardColors[index % cardColors.length]}`}>
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">{scholarship.name}</CardTitle>
                                        <Badge variant="secondary" className="w-fit">
                                            ${scholarship.amount}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">
                                            {stripHtml(scholarship.short_description)}
                                        </p>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <strong>Eligibility:</strong> {stripHtml(scholarship.eligibility_criteria)}
                                            </p>
                                            <p className="text-sm">
                                                <strong>Deadline:</strong> {new Date(scholarship.application_deadline).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                {scholarship.for_tuition_fee_or_cash_scholarship && (
                                                    <Badge variant="outline" className="text-xs">Tuition/Cash</Badge>
                                                )}
                                                {scholarship.renewable_scholarship && (
                                                    <Badge variant="outline" className="text-xs">Renewable</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Join ScholarPASS CTA */}
                    <div className="text-center mt-12">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-secondary text-white">
                            <Link href="/scholarship-application">Appy for ScholarPASS</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
