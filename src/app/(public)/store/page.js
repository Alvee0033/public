import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StoreFeaturedClient from '@/components/StoreFeaturedClient'

export const metadata = {
  title: "Shop | ScholarPASS - Education LMS Template",
  description: "Shop | ScholarPASS - Education LMS Template",
};

export default function StorePage() {
  const supplies = [
    { name: "Scientific Calculator", price: "$24.99", category: "Math" },
    { name: "Chemistry Lab Kit", price: "$89.99", category: "Science" },
    { name: "Coding Workbook Set", price: "$34.99", category: "Programming" },
    { name: "Art Supply Bundle", price: "$49.99", category: "Creative" },
    { name: "Engineering Design Kit", price: "$79.99", category: "STEM" },
    { name: "Language Learning Cards", price: "$19.99", category: "Languages" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-violet-600 text-white px-3 py-1 rounded-full inline-block">
            ScholarPASS Store
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
            Affordable Educational Resources
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get up to 50% off on school supplies, robotics kits, and learning materials through our ScholarPASS
            partnerships.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-emerald-400 to-violet-500 text-white px-6 py-3 rounded-lg shadow-md">
            Shop with Scholarship Discounts
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured STEM & Robotics Kits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hands-on learning tools at student-friendly prices
            </p>
          </div>

          <div className="">
            <StoreFeaturedClient />
          </div>
        </div>
      </section>

      {/* School Supplies */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">School Supplies & Learning Materials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Essential supplies for every student&apos;s success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplies.map((supply, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {supply.category}
                      </Badge>
                      <h3 className="font-semibold">{supply.name}</h3>
                      <p className="text-2xl font-bold text-cyan-500 mt-2">{supply.price}</p>
                    </div>
                    <Button size="sm" className="bg-cyan-500">Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Shop with ScholarPASS?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border border-gray-100 rounded-lg shadow-sm p-6">
              <CardHeader className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md ring-1 ring-white/10">
                  <span className="text-2xl">💰</span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Up to 50% Student Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Exclusive pricing for ScholarPASS students and families on all educational materials.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-100 rounded-lg shadow-sm p-6">
              <CardHeader className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md ring-1 ring-white/10">
                  <span className="text-2xl">📦</span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Free Shipping on Orders $50+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Fast, free delivery to your door on qualifying orders. No hidden fees.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-100 rounded-lg shadow-sm p-6">
              <CardHeader className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md ring-1 ring-white/10">
                  <span className="text-2xl">✅</span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  All products are tested and approved by our education experts for quality and safety.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
