"use client";

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Instagram, 
  Star, 
  CalendarDays,
  CheckCircle2,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/store/products/${product.id}`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image Section - Clickable */}
      <div 
        className="aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={handleProductClick}
      >
        <img 
          src={product.primary_image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>

      <CardContent className="p-4 flex-grow">
        {/* Title - Clickable */}
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>
          {product.rating_score && (
            <div className="flex items-center text-amber-500 text-sm">
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-0.5" />
              <span>{product.rating_score}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.short_description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.sale_price || product.regular_price}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.regular_price}
              </span>
            )}
          </div>
          
          {product.discount_percentage > 0 && (
            <Badge className="bg-red-100 text-red-700 border-0">
              {product.discount_percentage}% Off
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-gray-100 mt-auto gap-2">
        {/* Two buttons side by side */}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleProductClick}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button 
          className="flex-1" 
          size="sm"
          onClick={() => router.push(`/store/products/${product.id}?action=buy`)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
};

const StorePage = ({ params }) => {
  const { storeId } = params;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch store details
        const storeResponse = await axios.get(`/stores/${storeId}`);
        setStore(storeResponse.data.data);
        
        // Fetch products filtered by store_id
        const productsResponse = await axios.get('/products', {
          params: { store_id: storeId }
        });
        
        setProducts(productsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("Failed to load store details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreDetails();
    }
  }, [storeId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Store Header Skeleton */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="flex gap-4 mb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          
          {/* Products Grid Skeleton */}
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Store Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the store you're looking for.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Store Header (Compact Version) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            {store.logo && (
              <img 
                src={store.logo} 
                alt={store.name} 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Store Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{store.name}</h1>
                {store.verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* Rating */}
              {store.rating_score && (
                <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-semibold">{store.rating_score}/5</span>
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex items-center gap-3 text-gray-600">
                {store.facebook && (
                  <a
                    href={store.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {store.instagram && (
                  <a
                    href={store.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-600 transition"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="hover:text-green-600 transition"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                {store.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="hover:text-blue-600 transition"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
              
              {/* Location Badge */}
              {store.address && (
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{store.city || store.address.split(',').pop() || 'Location'}</span>
                </div>
              )}
            </div>
            
            {/* Store Description (Collapsed) */}
            <div className="mt-4">
              <p className="text-gray-600 text-sm line-clamp-2">{store.description}</p>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Store Products</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">This store hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        
        {/* Store Details (Full) - Optional Toggle */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About {store.name}</h2>
            <p className="text-gray-600 whitespace-pre-line mb-6">{store.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {store.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <a href={`tel:${store.phone}`} className="text-gray-600 hover:text-blue-600">
                        {store.phone}
                      </a>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <a href={`mailto:${store.email}`} className="text-gray-600 hover:text-blue-600">
                        {store.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Map Location */}
              {(store.latitude && store.longitude) && (
                <div>
                  <div className="bg-gray-200 h-40 rounded flex items-center justify-center text-gray-500">
                    Map Preview
                    {/* In a real implementation, you would add a Google Maps or other map component here */}
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-blue-600 hover:underline flex justify-center"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;