'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Building2, Heart, BookOpen, ArrowRight } from 'lucide-react'

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-balance mb-4">
                Get Started with ScholarPASS
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Choose your path to begin your journey
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer flex flex-col">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>I'm a Learner</CardTitle>
                  <CardDescription>
                    Find scholarships, tutoring, and career training
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/signup/learner">
                      Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors cursor-pointer flex flex-col">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>I'm a Teacher</CardTitle>
                  <CardDescription>
                    Join our global network of 20,000+ educators
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/signup/teacher">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors cursor-pointer flex flex-col">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle>I'm an Institute</CardTitle>
                  <CardDescription>
                    Partner with us to reach global students
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/signup/institute">
                      Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors cursor-pointer flex flex-col">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <CardTitle>I'm a Sponsor</CardTitle>
                  <CardDescription>
                    Fund education and create lasting impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/signup/sponsor">
                      Start Funding <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Already have an account?
              </p>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
