"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowRight, Code, GraduationCap, ShoppingCart, Target } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import axios from '@/lib/axios';
import Link from 'next/link';

const Store = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/stores')
        // API may return { data: [...] } or an array directly
        const payload = res?.data?.data ?? res?.data ?? []
        setStores(Array.isArray(payload) ? payload : [])
      } catch (err) {
        setStores([])
      } finally {
        setLoading(false)
      }
    }
    fetchStores()
  }, [])

  // Helper to render a card for a store
  const renderStoreCard = (store, idx) => {
    return (
      <Card key={store.id ?? idx} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {store.logo ? (
              // optimized Next.js Image
              <Image src={store.logo} alt={store.name || 'store logo'} width={300} height={300} className="object-cover w-full h-full" />
            ) : (
              <ShoppingCart className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-lg">{store.name || 'Store'}</CardTitle>
          <CardDescription>{store.description || store.full_address || store.city || ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm">Address:</span>
              <span className="text-sm text-muted-foreground">{store.full_address || store.address || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Contact:</span>
              <span className="font-semibold text-green-600">{store.phone || store.mobile || store.email || '-'}</span>
            </div>
          </div>
          <Button className="w-full bg-cyan-500" size="sm">
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Buy from Store</h2>
          <p className="text-muted-foreground">
            Essential educational supplies and tech gear for your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* render dynamic stores when available; otherwise show the original static cards to preserve design */}
          {Array.isArray(stores) && stores.length > 0 ? (
            stores.slice(0, 4).map((s, idx) => renderStoreCard(s, idx))
          ) : (
            // original static cards as fallback
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Arduino Starter Kit</CardTitle>
                  <CardDescription>Complete robotics learning kit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Price:</span>
                      <span className="text-sm line-through text-muted-foreground">$89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Student Price:</span>
                      <span className="font-semibold text-green-600">$59</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-3 flex items-center justify-center">
                    <Code className="w-12 h-12 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Coding Textbook Bundle</CardTitle>
                  <CardDescription>Python, JavaScript, and more</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Price:</span>
                      <span className="text-sm line-through text-muted-foreground">$149</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Student Price:</span>
                      <span className="font-semibold text-green-600">$99</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-3 flex items-center justify-center">
                    <Target className="w-12 h-12 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Scientific Calculator</CardTitle>
                  <CardDescription>Advanced graphing calculator</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Price:</span>
                      <span className="text-sm line-through text-muted-foreground">$129</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Student Price:</span>
                      <span className="font-semibold text-green-600">$89</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-3 flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Study Essentials Pack</CardTitle>
                  <CardDescription>Notebooks, pens, and supplies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Regular Price:</span>
                      <span className="text-sm line-through text-muted-foreground">$39</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Student Price:</span>
                      <span className="font-semibold text-green-600">$25</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/store">
            <Button variant="outline" size="lg">
              Browse All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Store;
