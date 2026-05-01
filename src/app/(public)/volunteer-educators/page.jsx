import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, BookOpen, Award, ArrowRight, CheckCircle } from "lucide-react"

export default function VolunteerEducatorsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
                            <Heart className="w-5 h-5 mr-2" />
                            Make a Difference
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Join as Volunteer Educators
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            Share your knowledge, inspire students, and help bridge the education gap. Become part of our global
                            community of volunteer educators making learning accessible for all.
                        </p>

                        <Button
                            size="lg"
                            className="text-lg px-12 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
                        >
                            Apply to Volunteer
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Volunteer Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-heading mb-4">Why Volunteer with ScholarPASS?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of educators making a real impact in students`&apos; lives while gaining valuable experience and
                            building your professional network.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Global Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Reach students worldwide and make education accessible regardless of location or background.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-secondary" />
                                </div>
                                <CardTitle className="text-lg">Flexible Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Teach on your own schedule with flexible hours that fit your lifestyle and commitments.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-accent" />
                                </div>
                                <CardTitle className="text-lg">Professional Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Develop teaching skills, gain experience, and build your professional portfolio.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle className="text-lg">Meaningful Work</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Experience the joy of helping students achieve their educational goals and dreams.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold font-heading mb-8 text-center">Volunteer Requirements</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        Basic Requirements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-sm">Bachelor`&apos;s degree or equivalent experience</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-sm">Passion for education and helping students</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-sm">Reliable internet connection</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span className="text-sm">Minimum 5 hours per week availability</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        Preferred Qualifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-sm">Teaching or tutoring experience</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-sm">Subject matter expertise</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-sm">Multilingual abilities</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <span className="text-sm">Technology proficiency</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold font-heading mb-4 text-primary-foreground">Ready to Make a Difference?</h2>
                    <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                        Join our community of volunteer educators and help us make quality education accessible to every student,
                        everywhere.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-12 py-4 bg-white text-primary hover:bg-white/90 font-semibold"
                        >
                            Apply Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
