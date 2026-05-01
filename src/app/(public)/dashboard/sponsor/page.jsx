import { DollarSign, Users, Award, TrendingUp, Target, Eye, Calendar, CheckCircle, BarChart3, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SponsorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/images/placeholder-logo.png" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">Microsoft CSR</h1>
                <p className="text-muted-foreground">LaunchPad Partner since 2020</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Award className="h-4 w-4 mr-2" />
              Launch New Campaign
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Platinum Sponsor</Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$2.4M</div>
              <p className="text-xs text-muted-foreground mt-1">Across all programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Students Impacted</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">8,456</div>
              <p className="text-xs text-muted-foreground mt-1">+1,234 this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Across 3 programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Impact Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">92%</div>
              <p className="text-xs text-muted-foreground mt-1">Above industry average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Campaign List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Future Scholarship Program</CardTitle>
                    <CardDescription>Supporting students in Computer Science and Engineering</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-xl font-bold text-green-600">$500,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-xl font-bold text-blue-600">234</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-bold text-purple-600">2,345</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Budget Utilization</span>
                        <span className="text-sm font-semibold">78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Women in Tech Initiative</CardTitle>
                    <CardDescription>Empowering female students in STEM fields</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-xl font-bold text-green-600">$750,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-xl font-bold text-blue-600">156</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-bold text-purple-600">1,890</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Budget Utilization</span>
                        <span className="text-sm font-semibold">62%</span>
                      </div>
                      <Progress value={62} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Career Bootcamp Sponsorship</CardTitle>
                    <CardDescription>Full scholarships for career changers in AI/Data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-xl font-bold text-green-600">$1,200,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-xl font-bold text-blue-600">89</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-bold text-purple-600">3,456</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Budget Utilization</span>
                        <span className="text-sm font-semibold">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Campaign Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Impact 10K students</span>
                        <span className="text-sm font-semibold">8.5K</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Deploy $5M budget</span>
                        <span className="text-sm font-semibold">$2.4M</span>
                      </div>
                      <Progress value={48} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Launch 15 campaigns</span>
                        <span className="text-sm font-semibold">12</span>
                      </div>
                      <Progress value={80} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">78 scholarships awarded</p>
                        <p className="text-xs text-muted-foreground">Tech Future Program</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">234 new applications</p>
                        <p className="text-xs text-muted-foreground">Women in Tech Initiative</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2d ago</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Campaign reached 1M views</p>
                        <p className="text-xs text-muted-foreground">Career Bootcamp Sponsorship</p>
                      </div>
                      <span className="text-xs text-muted-foreground">5d ago</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <p className="text-sm">85% employment rate for bootcamp grads</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                      <Award className="h-5 w-5 text-blue-600" />
                      <p className="text-sm">4.9★ average program rating</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact">
            <Card>
              <CardHeader>
                <CardTitle>Impact Analytics</CardTitle>
                <CardDescription>Measure the real-world impact of your sponsorship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4">
                      <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold">8,456</p>
                      <p className="text-sm text-muted-foreground">Students Helped</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <Target className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <Award className="h-8 w-8 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold">479</p>
                      <p className="text-sm text-muted-foreground">Scholarships Awarded</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                      <p className="text-2xl font-bold">$2.4M</p>
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                    </div>
                  </div>
                  <div className="text-center py-12 text-muted-foreground border rounded-lg">
                    Impact visualization charts would go here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipients">
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Recipients</CardTitle>
                <CardDescription>Track the progress of students you&apos;re supporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Recipient dashboard with student profiles and progress tracking would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sponsorship Programs</CardTitle>
                    <CardDescription>Choose how you want to make an impact</CardDescription>
                  </div>
                  <Button>Create Custom Program</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">SP1000</CardTitle>
                      <CardDescription>Fund 1,000 students per campaign</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">$1M+</p>
                      <Button className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">CSR LaunchPad</CardTitle>
                      <CardDescription>Enterprise CSR campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">Custom</p>
                      <Button className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Gift Forward</CardTitle>
                      <CardDescription>Philanthropic giving programs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-4">Flexible</p>
                      <Button className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
