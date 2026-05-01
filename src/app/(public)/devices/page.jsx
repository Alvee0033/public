"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, CheckCircle } from "lucide-react"
import { instance } from "@/lib/axios"
import useSWR from "swr"

export default function DevicesPage() {
  const getStores = async () => {
    try {
      const res = await instance.get('https://api.tutorsplan.com/stores');
      if (!res?.data?.data || !Array.isArray(res?.data?.data)) {
        return [];
      }
      return res.data.data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      return [];
    }
  };

  const { data: stores = [] } = useSWR("stores", getStores, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const transformStoreToProduct = (store, index) => ({
    id: store.id || index,
    badge: index < 3 ? (index === 0 ? "Featured" : index === 1 ? "New" : "Bestseller") : null,
    badgeColor: index < 3 ? (index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-purple-500") : null,
    name: store.name || "Store Name",
    description: store.description || "Store description",
    regularPrice: 0, // Not available in store data
    memberPrice: 0, // Not available
    rentPrice: 0, // Not available
    category: "Store",
    rating: store.rating_score ? (store.rating_score / 10).toFixed(1) : 4.5,
    reviews: 0, // Not available
    stock: "Available",
    image: store.logo || "/placeholder.svg",
  });

  const featuredProducts = stores.slice(0, 3).map((store, index) => transformStoreToProduct(store, index));
  const products = stores.slice(3, 9).map((store, index) => transformStoreToProduct(store, index + 3));

  const categories = [
    "Robotics",
    "STEM Kits",
    "School Supplies",
    "Electronics",
    "Books",
    "Art Supplies",
    "Clothing & Uniforms",
    "Math Tools",
    "Backpacks & Bags",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h1 className="text-3xl font-bold mb-3">ScholarPASS Learning Devices for Students & STEM Labs</h1>

          <p className="text-base text-gray-700 mb-6">
            Quality educational resources for students, teachers, and schools
          </p>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Buy It</Button>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              Lease It
            </Button>
            <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent">
              Learn Yourself
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
              Teach Others
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/devices/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors text-sm font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/devices/featured" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {product.badge && (
                  <div className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1 inline-block`}>
                    {product.badge}
                  </div>
                )}

                <div className="relative w-full h-48 bg-gray-100">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Regular Price:</span>
                      <span className="font-semibold">${product.regularPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">ScholarPASS+ Member:</span>
                      <span className="font-bold text-green-600">${product.memberPrice}</span>
                    </div>
                    <div className="text-xs text-green-600 text-right">10% OFF</div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">Rent 2 weeks:</span>
                      <span className="font-semibold">${product.rentPrice}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">40% of cost</div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ScholarPASS Info */}
      <section className="border-b bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">ScholarPASS Devices & STEM Kits</h2>
            <p className="text-lg text-gray-700 mb-6">
              ScholarPASS Devices & STEM Kits deliver affordable, AI-powered learning tools built for every student.
              Preloaded tablets, laptops, and robotics kits bring coding, STEM, and AI education directly to classrooms
              and communities. Supported by scholarships and CSR funding, schools can launch full STEM programs at a
              fraction of the cost. Empower your students with the tools to learn, build, and innovate.
            </p>
            <Link href="/devices/stem-labs">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Learn More About ScholarPASS</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {product.badge && (
                  <div className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1 inline-block`}>
                    {product.badge}
                  </div>
                )}

                <div className="relative w-full h-48 bg-gray-100">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>

                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Regular Price:</span>
                      <span className="font-semibold">${product.regularPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">ScholarPASS+ Member:</span>
                      <span className="font-bold text-green-600">${product.memberPrice}</span>
                    </div>
                    <div className="text-xs text-green-600 text-right">
                      Save ${(product.regularPrice - product.memberPrice).toFixed(2)} (10% Off)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm">
                    {product.stock === "In Stock" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">{product.stock}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-orange-600 font-medium">⚠ {product.stock}</span>
                      </>
                    )}
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">Showing 6 of 24 products</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              Load More Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
