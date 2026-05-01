import { Award, BookOpen, DollarSign, TrendingUp, Calendar, CheckCircle, Clock, Zap, Target, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LearnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
              <p className="text-muted-foreground">Here&apos;s your learning progress</p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src="/images/placeholder-user.jpg" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">ScholarPASS Plus Member</Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">SP Wallet Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$487</div>
              <p className="text-xs text-muted-foreground mt-1">Available credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Scholarship Apps</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Learning Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">15</div>
              <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Courses</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Python for Beginners</h3>
                      <p className="text-sm text-muted-foreground">TechAcademy Institute</p>
                    </div>
                    <Badge>65% Complete</Badge>
                  </div>
                  <Progress value={65} className="mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next: Module 7</span>
                    <Button size="sm">Continue Learning</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Web Development Bootcamp</h3>
                      <p className="text-sm text-muted-foreground">CodeCraft Academy</p>
                    </div>
                    <Badge>42% Complete</Badge>
                  </div>
                  <Progress value={42} className="mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next: React Basics</span>
                    <Button size="sm">Continue Learning</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Data Science Fundamentals</h3>
                      <p className="text-sm text-muted-foreground">DataVision Institute</p>
                    </div>
                    <Badge>18% Complete</Badge>
                  </div>
                  <Progress value={18} className="mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next: Statistics 101</span>
                    <Button size="sm">Continue Learning</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scholarship Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scholarship Applications</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <CardDescription>Track your application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-sm">Tech Future Scholarship</p>
                      <p className="text-xs text-muted-foreground">Microsoft</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Submitted</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-sm">Women in Engineering Award</p>
                      <p className="text-xs text-muted-foreground">Google.org</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">Data Science Excellence Award</p>
                      <p className="text-xs text-muted-foreground">IBM</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Shortlisted</Badge>
                </div>

                <Button className="w-full" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Apply to 15 More
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold">Today, 3:00 PM</span>
                  </div>
                  <p className="text-sm font-medium mb-1">Math Tutoring</p>
                  <p className="text-xs text-muted-foreground">with Dr. Emily Chen</p>
                  <Button size="sm" className="w-full mt-2">Join Session</Button>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold">Tomorrow, 5:00 PM</span>
                  </div>
                  <p className="text-sm font-medium mb-1">Physics Tutoring</p>
                  <p className="text-xs text-muted-foreground">with Prof. Michael Johnson</p>
                  <Button size="sm" variant="outline" className="w-full mt-2">Reschedule</Button>
                </div>

                <Button variant="ghost" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book New Session
                </Button>
              </CardContent>
            </Card>

            {/* AI Learning Buddy */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  AI Learning Buddy
                </CardTitle>
                <CardDescription>Get instant help 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Ask me anything about your homework, tests, or courses!</p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Complete 5 modules</span>
                    <span className="text-sm font-semibold">3/5</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Study 10 hours</span>
                    <span className="text-sm font-semibold">7/10</span>
                  </div>
                  <Progress value={70} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Practice 3 subjects</span>
                    <span className="text-sm font-semibold">3/3</span>
                  </div>
                  <Progress value={100} className="[&>div]:bg-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold">15-Day Streak!</p>
                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                  <Award className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold">Module Master</p>
                    <p className="text-xs text-muted-foreground">Completed 50 modules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
