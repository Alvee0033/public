"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import axios from '@/lib/axios'

export default function StoreFeaturedClient() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [limited, setLimited] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchStores = async () => {
            setLoading(true)
            try {
                const res = await axios.get('/stores')
                const payload = res?.data?.data ?? res?.data ?? []
                if (mounted) setStores(Array.isArray(payload) ? payload : [])
            } catch (err) {
                if (mounted) setStores([])
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchStores()
        return () => { mounted = false }
    }, [])

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse bg-slate-100 h-64" />
                ))}
            </div>
        )
    }

    if (!stores || stores.length === 0) {
        return <p className="text-center text-muted-foreground">No featured stores available</p>
    }

    const displayed = limited ? stores.slice(0, 4) : stores

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayed.map((store, index) => (
                    <Card key={store.id ?? index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                            <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                {store.logo ? (
                                    <Image src={store.logo} alt={store.name || 'Store'} fill className="object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mb-2">
                                            <ShoppingCart className="w-8 h-8 text-blue-600" />
                                        </div>
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2 bg-red-500">STORE</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <Badge variant="outline" className="mb-2">{store.master_store_type || 'Store'}</Badge>
                            <CardTitle className="text-lg mb-2">{store.name}</CardTitle>
                            <CardDescription className="mb-4">{store.description || store.full_address || store.city || ''}</CardDescription>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-2xl font-bold text-cyan-500">{store.city || store.year_of_establishment || ''}</span>
                                    <span className="text-sm text-muted-foreground ml-2">{store.phone || store.mobile || ''}</span>
                                </div>
                            </div>
                            {(store.store_public_url || store.website) ? (
                                <a href={store.store_public_url || store.website} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-cyan-500 text-white py-2 rounded">Add to Cart</a>
                            ) : (
                                <span className="block w-full text-center bg-slate-100 text-slate-700 py-2 rounded">No Link</span>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {stores.length > 4 && (
                <div className="text-center mt-10">
                    <Button
                        size="md"
                        variant="outline"
                        onClick={() => setLimited(!limited)}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
                    >
                        <span className="font-medium">{limited ? 'Show all' : 'Show less'}</span>
                        {limited ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </Button>
                </div>
            )}
        </>
    )
}
