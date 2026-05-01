"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Star,
  ShoppingCart,
  Cpu,
  Zap,
  Rocket,
  Eye,
  Gamepad2,
  Wrench,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function STEMLabsPage() {
  const labStats = {
    totalLabs: 156,
    cities: 45,
    countries: 12,
    activeStudents: 8420,
    completedProjects: 2340,
    partnerSchools: 89,
  };

  const labCategories = [
    {
      id: "robotics",
      name: "Robotics & AI",
      icon: Cpu,
      color: "bg-blue-500",
      labs: 42,
      description: "Build and program robots, learn AI fundamentals",
      avgDuration: "3-4 hours",
      difficulty: "Beginner to Advanced",
    },
    {
      id: "vr-ar",
      name: "VR/AR Development",
      icon: Eye,
      color: "bg-purple-500",
      labs: 28,
      description: "Create immersive virtual and augmented reality experiences",
      avgDuration: "2-3 hours",
      difficulty: "Intermediate",
    },
    {
      id: "drones",
      name: "Drone Technology",
      icon: Rocket,
      color: "bg-orange-500",
      labs: 18,
      description: "Build, program, and fly autonomous drones",
      avgDuration: "2-4 hours",
      difficulty: "Beginner to Advanced",
    },
    {
      id: "iot",
      name: "IoT & Electronics",
      icon: Zap,
      color: "bg-green-500",
      labs: 35,
      description: "Internet of Things projects and circuit design",
      avgDuration: "2-3 hours",
      difficulty: "Beginner to Intermediate",
    },
    {
      id: "3d-printing",
      name: "3D Printing & Design",
      icon: Wrench,
      color: "bg-teal-500",
      labs: 22,
      description: "Design and print custom objects and prototypes",
      avgDuration: "3-5 hours",
      difficulty: "Beginner to Advanced",
    },
    {
      id: "gaming",
      name: "Game Development",
      icon: Gamepad2,
      color: "bg-pink-500",
      labs: 11,
      description: "Create games using modern engines and tools",
      avgDuration: "4-6 hours",
      difficulty: "Intermediate to Advanced",
    },
  ];

  const featuredLabs = [
    {
      id: 1,
      name: "TechHub Innovation Center",
      location: "San Francisco, CA",
      rating: 4.9,
      students: 245,
      image: "/stem-lab-san-francisco.png",
      specialties: ["Robotics", "AI", "VR/AR"],
      nextAvailable: "Today 2:00 PM",
      scholarshipCovered: true,
      partnerSchool: "Stanford University",
      description:
        "State-of-the-art facility with cutting-edge robotics and AI equipment",
    },
    {
      id: 2,
      name: "Future Makers Lab",
      location: "Austin, TX",
      rating: 4.8,
      students: 189,
      image: "/stem-lab-austin.png",
      specialties: ["Drones", "IoT", "3D Printing"],
      nextAvailable: "Tomorrow 10:00 AM",
      scholarshipCovered: true,
      partnerSchool: "UT Austin",
      description:
        "Hands-on learning with drones, IoT devices, and rapid prototyping",
    },
    {
      id: 3,
      name: "Innovation Academy",
      location: "Boston, MA",
      rating: 4.9,
      students: 312,
      image: "/stem-lab-boston.png",
      specialties: ["Game Dev", "VR/AR", "Electronics"],
      nextAvailable: "Dec 5, 3:00 PM",
      scholarshipCovered: true,
      partnerSchool: "MIT",
      description:
        "Collaborative space for game development and immersive technologies",
    },
  ];

  const popularProducts = [
    {
      id: 1,
      name: "Arduino Starter Kit Pro",
      price: 89.99,
      originalPrice: 129.99,
      discount: 31,
      rating: 4.8,
      reviews: 1247,
      image: "/arduino-starter-kit.png",
      category: "Electronics",
      inStock: true,
      scholarshipEligible: true,
    },
    {
      id: 2,
      name: "Robotics Building Set Advanced",
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      rating: 4.9,
      reviews: 892,
      image: "/robotics-building-set.png",
      category: "Robotics",
      inStock: true,
      scholarshipEligible: true,
    },
    {
      id: 3,
      name: "VR Development Headset",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      rating: 4.7,
      reviews: 634,
      image: "/vr-development-headset.png",
      category: "VR/AR",
      inStock: false,
      scholarshipEligible: true,
    },
    {
      id: 4,
      name: "Drone Programming Kit",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      rating: 4.6,
      reviews: 445,
      image: "/drone-programming-kit.png",
      category: "Drones",
      inStock: true,
      scholarshipEligible: true,
    },
  ];

  const upcomingWorkshops = [
    {
      id: 1,
      title: "Build Your First Robot",
      date: "Dec 8, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "TechHub Innovation Center",
      instructor: "Dr. Sarah Chen",
      spots: 8,
      totalSpots: 12,
      level: "Beginner",
      price: "Free with Scholarship",
    },
    {
      id: 2,
      title: "VR Game Development Workshop",
      date: "Dec 10, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Innovation Academy",
      instructor: "Prof. Michael Rodriguez",
      spots: 3,
      totalSpots: 15,
      level: "Intermediate",
      price: "Free with Scholarship",
    },
    {
      id: 3,
      title: "Drone Racing & Programming",
      date: "Dec 12, 2024",
      time: "1:00 PM - 6:00 PM",
      location: "Future Makers Lab",
      instructor: "Eng. Lisa Park",
      spots: 6,
      totalSpots: 10,
      level: "Advanced",
      price: "Free with Scholarship",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-pink-50 to-rose-50">
      {/* Header */}
      {/* <header className="border-b bg-white/60 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-auto relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scholarpass-logo-l6NrJlhx2kR3cyYm1XdHTds1uB3cyYm1XdHTds1uB3IzK.png"
                  alt="ScholarPASS Logo"
                  fill
                  sizes="(max-width: 768px) 80px, 160px"
                  className="object-contain"
                />
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="/scholarships"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Scholarships
              </a>
              <a
                href="/learning"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Learning
              </a>
              <a href="/labs" className="text-teal-500 font-medium">
                STEM Labs
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="rounded-full px-4 py-2 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Store
              </Button>
              <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-1.5 rounded-full shadow-md text-sm font-semibold">
                Book Lab
              </Button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge
              variant="secondary"
              className="mb-6 bg-white/60 text-teal-600 border-teal-200 text-lg px-6 py-2 rounded-lg"
            >
              🏫 Select Your City or School District
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 via-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                LearningHub
              </span>
              <br />
              <span className="text-foreground">STEM Labs & Institutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose from multiple STEM labs and institutes in your city or
              school district. Access cutting-edge robotics, VR, drone
              technology, and innovation centers near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 bg-gradient-to-r from-teal-400 to-purple-500 text-white rounded-full shadow-md"
              >
                Select Your LearningHub
                <MapPin className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-teal-200 hover:bg-teal-50 bg-white/60 rounded-full"
              >
                Browse Store
                <ShoppingCart className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-teal-500">
                  {labStats.totalLabs}
                </div>
                <p className="text-sm text-gray-500">STEM Labs</p>
              </CardContent>
            </Card>
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-purple-500">
                  {labStats.cities}
                </div>
                <p className="text-sm text-gray-500">Cities</p>
              </CardContent>
            </Card>
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-orange-400">
                  {labStats.countries}
                </div>
                <p className="text-sm text-gray-500">Countries</p>
              </CardContent>
            </Card>
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-green-600">
                  {labStats.activeStudents.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Active Students</p>
              </CardContent>
            </Card>
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-orange-500">
                  {labStats.completedProjects.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Projects Built</p>
              </CardContent>
            </Card>
            <Card className="text-center rounded-xl bg-white/60 border border-primary/10 shadow-md">
              <CardContent className="py-8">
                <div className="text-2xl font-bold text-violet-600">
                  {labStats.partnerSchools}
                </div>
                <p className="text-sm text-gray-500">Partner Schools</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lab Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              Lab Categories
            </Badge>
            <h2 className="text-3xl font-bold font-heading mb-4">
              Explore STEM Technologies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hands-on learning experiences across cutting-edge technologies and
              innovation areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="hover:shadow-lg transition-all cursor-pointer group rounded-xl bg-white/80 border border-gray-100"
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Available Labs:</span>
                        <span className="font-medium">{category.labs}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">
                          {category.avgDuration}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Level:</span>
                        <Badge variant="outline" className="text-xs">
                          {category.difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                      >
                        Explore Labs
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Labs */}
      <section className="py-16 px-4 bg-white/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              Featured Labs
            </Badge>
            <h2 className="text-3xl font-bold font-heading mb-4">
              Top-Rated STEM Labs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium facilities with cutting-edge equipment and expert
              instructors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLabs.map((lab) => (
              <Card
                key={lab.id}
                className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl bg-white/80 border border-gray-100"
              >
                <div className="aspect-video relative rounded-t-xl overflow-hidden bg-gradient-to-r from-white to-white/80">
                  <Image
                    src={lab.image || "/placeholder.svg"}
                    alt={lab.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {lab.scholarshipCovered && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Scholarship Covered
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="font-heading text-lg">
                        {lab.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{lab.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{lab.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {lab.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {lab.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-block bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {lab.students} students
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{lab.nextAvailable}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      Partner:{" "}
                      <span className="font-medium text-gray-800">
                        {lab.partnerSchool}
                      </span>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
                      <span className="font-medium">Book Lab Session</span>
                      <Calendar className="w-5 h-5 opacity-90" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Store */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-cyan-500 text-cyan-500"
            >
              Educational Store
            </Badge>
            <h2 className="text-3xl font-bold font-heading mb-4">
              STEM Learning Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Affordable, high-quality educational resources, robotics kits, and
              innovation tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl bg-white/80 border border-gray-100"
              >
                <div className="aspect-square relative rounded-t-xl overflow-hidden bg-white">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        -{product.discount}%
                      </Badge>
                    </div>
                  )}
                  {product.scholarshipEligible && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        Scholarship
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-base">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {product.inStock ? (
                      <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
                        <span className="font-medium">Add to Cart</span>
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-purple-300 text-white py-3 rounded-lg"
                        disabled
                      >
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-cyan-500 text-cyan-500 hover:bg-primary/5 bg-transparent"
            >
              Browse Full Store
              <Search className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-cyan-500 text-cyan-500"
            >
              Upcoming Workshops
            </Badge>
            <h2 className="text-3xl font-bold font-heading mb-4">
              Hands-on Learning Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join expert-led workshops and build real projects with fellow
              students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {upcomingWorkshops.map((workshop) => (
              <Card key={workshop.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        workshop.level === "Beginner"
                          ? "default"
                          : workshop.level === "Intermediate"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {workshop.level}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {workshop.spots} spots left
                      </div>
                      <div className="text-xs text-muted-foreground">
                        of {workshop.totalSpots}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {workshop.title}
                  </CardTitle>
                  <CardDescription>by {workshop.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{workshop.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{workshop.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{workshop.location}</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {workshop.price}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
                      <span className="font-medium">Register Now</span>
                      <ArrowRight className="w-4 h-4 opacity-90" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
