import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Search, Wallet, BookOpen, Briefcase, Globe, CheckCircle, Award, Sparkles } from 'lucide-react'

export default function ForLearnersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-2 h-3 w-3" />
              Built for Learners
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
              Your Complete Education Journey in One Platform
            </h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              From K-12 tutoring to career bootcamps, scholarships to global opportunities. ScholarPASS gives you everything you need to succeed academically and professionally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/get-started">Create Free Profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#benefits">See What's Possible</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Join 50,000+ learners • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Journey Stages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-4">
              Support at Every Stage of Your Journey
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Whatever your age or goal, we have the right solution
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>K-12 Students</CardTitle>
                <CardDescription>
                  Build strong foundations with personalized tutoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Math, Science, Language Arts tutoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Test prep for SAT, ACT, AP exams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>STEM enrichment & coding classes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Language learning in 50+ languages</span>
                  </li>
                </ul>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/k12-tutoring">Explore K-12 Tutoring</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>College Students</CardTitle>
                <CardDescription>
                  Get funded and access global education opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>AI scholarship matching & auto-apply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>SP Wallet credits for education costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Admissions counseling & essay help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Study abroad & exchange programs</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/scholarpass-plus">Get ScholarPASS Plus</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Career Changers</CardTitle>
                <CardDescription>
                  Learn new skills and land your dream job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tech bootcamps in AI, coding, data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>85% job placement rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Portfolio building & career services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Flexible financing & ISAs available</span>
                  </li>
                </ul>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/career-bootcamps">Browse Bootcamps</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="benefits" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              ScholarPASS combines AI technology, global networks, and smart funding
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Our scholarship agent scans 10,000+ opportunities and matches them to your profile automatically
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">SP Wallet Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Universal education currency works across tutoring, bootcamps, courses, and devices
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Global Network</h3>
                <p className="text-sm text-muted-foreground">
                  Access 5,000+ LearningHubs, 20,000+ teachers, and opportunities across 50+ countries
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
                <p className="text-sm text-muted-foreground">
                  1-on-1 tutoring and small group classes tailored to your pace and learning style
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Certifications & Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  Earn recognized certificates and credentials that employers and universities value
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Career Support</h3>
                <p className="text-sm text-muted-foreground">
                  Resume building, interview prep, and direct connections to 500+ hiring partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Free Profile</h3>
                <p className="text-muted-foreground">
                  Tell us about your academic background, interests, goals, and what you need help with. Takes just 5 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your profile and recommends scholarships, tutors, courses, and opportunities that match your needs.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Learning & Get Funded</h3>
                <p className="text-muted-foreground">
                  Book tutoring sessions, apply to scholarships, enroll in bootcamps. Use SP Wallet credits to pay for everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-4">
              Real Success Stories
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Join thousands of learners who've achieved their goals with ScholarPASS
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "ScholarPASS helped me find $15,000 in scholarships I never knew existed. The auto-apply feature saved me countless hours."
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-muted-foreground">College Sophomore, California</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "My daughter's math grades improved from C to A in just 3 months with their tutoring program. The teachers are amazing!"
                </p>
                <div className="font-semibold">James P.</div>
                <div className="text-sm text-muted-foreground">Parent, Texas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "Completed the AI bootcamp and landed a $95K job at a tech startup. Best investment I've ever made in myself."
                </p>
                <div className="font-semibold">Priya K.</div>
                <div className="text-sm text-muted-foreground">Software Engineer, India</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight text-balance mb-4">
              Start Your Learning Journey Today
            </h2>
            <p className="text-lg text-blue-50 text-pretty max-w-2xl mx-auto mb-8">
              Create your free profile and get personalized recommendations in minutes
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/get-started">Create Free Profile</Link>
            </Button>
            <p className="text-sm text-blue-100 mt-4">
              No credit card required • Join 50,000+ learners
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
