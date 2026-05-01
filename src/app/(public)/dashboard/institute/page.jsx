import { Search, Filter, Clock, Users, Star, BookOpen, Video, Award, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const courses = [
  {
    id: 1,
    title: "Python for Beginners",
    instructor: "Dr. Sarah Johnson",
    institute: "TechAcademy Institute",
    price: 49.99,
    originalPrice: 99.99,
    rating: 4.8,
    students: 12453,
    duration: "8 weeks",
    level: "Beginner",
    category: "Programming",
    image: "/images/python-code.png",
    featured: true
  },
  {
    id: 2,
    title: "Advanced Machine Learning",
    instructor: "Prof. Michael Chen",
    institute: "AI Learning Hub",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.9,
    students: 8234,
    duration: "12 weeks",
    level: "Advanced",
    category: "AI/ML",
    image: "/images/machine-learning-ai-neural-network.jpg"
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    instructor: "Emily Rodriguez",
    institute: "CodeCraft Academy",
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.7,
    students: 15678,
    duration: "16 weeks",
    level: "Intermediate",
    category: "Web Dev",
    image: "/images/web-development-coding.png"
  },
  {
    id: 4,
    title: "Data Science Fundamentals",
    instructor: "Dr. Rajesh Sharma",
    institute: "DataVision Institute",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.6,
    students: 9876,
    duration: "10 weeks",
    level: "Beginner",
    category: "Data Science",
    image: "/images/data-science-analytics.jpg"
  },
  {
    id: 5,
    title: "Cybersecurity Essentials",
    instructor: "James Williams",
    institute: "SecureNet Academy",
    price: 99.99,
    originalPrice: 179.99,
    rating: 4.8,
    students: 6543,
    duration: "8 weeks",
    level: "Intermediate",
    category: "Cybersecurity",
    image: "/images/cybersecurity-network-security.jpg"
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    instructor: "Linda Martinez",
    institute: "CloudTech Institute",
    price: 119.99,
    originalPrice: 199.99,
    rating: 4.9,
    students: 7890,
    duration: "12 weeks",
    level: "Advanced",
    category: "Cloud",
    image: "/images/aws-cloud-computing.jpg"
  }
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <Badge variant="secondary" className="text-sm">10,000+ Courses Available</Badge>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">Learn Anything, Anywhere</h1>
          <p className="text-xl text-muted-foreground max-w-3xl text-pretty">
            Access courses from 2,000+ institutes worldwide. Use SP Wallet credits and get 10% off with ScholarPASS Plus.
          </p>
        </div>
      </section>

      {/* ScholarPASS Plus Promo */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">Get 10% off all courses with ScholarPASS Plus</h3>
                <p className="text-sm text-white/90">Plus $500 SP Wallet credits toward any course</p>
              </div>
            </div>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90 shrink-0">
              Upgrade Now
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="k12">K-12 Tutoring</TabsTrigger>
              <TabsTrigger value="bootcamps">Career Bootcamps</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses by topic, instructor, or institute..." 
                className="pl-10 h-12"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="cyber">Cybersecurity</SelectItem>
                <SelectItem value="cloud">Cloud Computing</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] h-12">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Course Listings */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground">Hand-picked by our education experts</p>
            </div>
            <Select defaultValue="popular">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img src={course.image || "/images/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
                  {course.featured && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>
                  )}
                  <Badge className="absolute top-2 right-2 bg-blue-600">{course.level}</Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.institute}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} students enrolled</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">${course.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">Details</Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Programming", icon: BookOpen, count: 2340 },
              { name: "AI/ML", icon: Award, count: 1567 },
              { name: "Web Dev", icon: Video, count: 1890 },
              { name: "Data Science", icon: TrendingUp, count: 1234 },
              { name: "Cybersecurity", icon: Award, count: 987 },
              { name: "Cloud", icon: Video, count: 876 }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <category.icon className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} courses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
