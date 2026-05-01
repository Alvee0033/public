
"use client";

import { Search, Calendar, Clock, Star, Video, MessageSquare, Award, Users, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Spanish",
  "French", "History", "Computer Science", "Coding", "SAT Prep", "ACT Prep"
]

export default function TutoringPage() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true)
        const response = await axios.get('/tutors')
        const tutorsData = response.data?.data || []

        // Transform API data to match UI structure
        const transformedTutors = tutorsData.map((tutor) => ({
          id: tutor.id || tutor.tutor_user,
          name: tutor.name || `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'Tutor',
          avatar: tutor.profile_picture,
          subjects: ["General Tutoring"], // Default subject since API doesn't provide specific subjects
          rating: tutor.rating_score || 0,
          reviews: tutor.tutoring_sessions || 0,
          hourlyRate: 45, // Default rate since API doesn't provide pricing
          experience: tutor.years_of_experience || "Experience not specified",
          students: tutor.teach_students || 0,
          availability: "Check availability", // Default since API doesn't provide real-time availability
          languages: ["English"], // Default since API doesn't provide languages
          featured: tutor.verified_tutor || false
        }))

        setTutors(transformedTutors)
      } catch (err) {
        console.error('Error fetching tutors:', err)
        setError('Failed to load tutors')
        setTutors([])
      } finally {
        setLoading(false)
      }
    }

    fetchTutors()
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/images/modern-classroom-collaboration.png"
            alt="Modern classroom collaboration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-blue-600" />
                <Badge variant="secondary" className="text-sm">1-on-1 Expert Tutoring</Badge>
              </div>
              <h1 className="text-5xl font-bold mb-4 text-balance">K-12 Tutoring with Live Experts</h1>
              <p className="text-xl text-muted-foreground mb-6 text-pretty">
                Book live sessions with certified tutors across 100+ subjects. Get AI Learning Buddy support 24/7 between sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Find Your Tutor
                </Button>
                <Button size="lg" variant="outline">
                  Try AI Learning Buddy
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Tutors</span>
                  <span className="text-2xl font-bold text-blue-600">2,340+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subjects Covered</span>
                  <span className="text-2xl font-bold text-purple-600">100+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="text-2xl font-bold text-green-600">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sessions Completed</span>
                  <span className="text-2xl font-bold text-orange-600">450K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Learning Buddy Promo */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">Get 24/7 AI Learning Buddy with ScholarPASS Plus</h3>
                <p className="text-sm text-white/90">Instant homework help, test prep, and personalized learning support</p>
              </div>
            </div>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90 shrink-0">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject, tutor name, or expertise..."
                className="pl-10 h-12"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="now">Available Now</SelectItem>
                <SelectItem value="today">Available Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under $30/hr</SelectItem>
                <SelectItem value="mid">$30-$50/hr</SelectItem>
                <SelectItem value="premium">$50+/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Tutors</h2>
              <p className="text-muted-foreground">Top-rated experts available for booking</p>
            </div>
            <Select defaultValue="rating">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  </CardFooter>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <div className="text-red-600 mb-4">
                  <Award className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Failed to load tutors</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : tutors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">No tutors available</p>
                  <p className="text-sm text-muted-foreground">Please check back later</p>
                </div>
              </div>
            ) : (
              tutors.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
                        <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{tutor.name}</CardTitle>
                          {tutor.featured && (
                            <Badge className="bg-orange-500">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({tutor.reviews} reviews)</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tutor.availability}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects.map((subject) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Experience</span>
                        <div className="font-semibold">{tutor.experience}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Students</span>
                        <div className="font-semibold">{tutor.students}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Languages: </span>
                      <span className="text-sm">{tutor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-2 border-t">
                      <span className="text-2xl font-bold text-blue-600">${tutor.hourlyRate}</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Tutors
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 relative">
        <div className="absolute inset-0 opacity-5">
          <img
            src="/images/diverse-students-collaborating-on-digital-devices-.jpg"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">1. Find Your Tutor</h3>
              <p className="text-sm text-muted-foreground">Browse by subject, availability, and price</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">2. Schedule Session</h3>
              <p className="text-sm text-muted-foreground">Pick a time that works for you</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">3. Meet Online</h3>
              <p className="text-sm text-muted-foreground">Join from any device with video</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">4. Track Progress</h3>
              <p className="text-sm text-muted-foreground">See improvements over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16 bg-gray-50 relative">
        <div className="absolute inset-0 opacity-5">
          <img
            src="/images/tutorsplan-online-tutoring.png"
            alt="Online tutoring"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <Card key={subject} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">{subject}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
