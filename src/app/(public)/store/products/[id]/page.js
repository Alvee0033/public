"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Minus, Plus } from "lucide-react";
import QuantityInput from "@/components/shared/inputs/QuantityInput";

const Product_Details = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart } = useCartContext();

  const {
    data: product,
    error,
    isLoading,
  } = useSWR(["product", id], async () => {
    const response = await axios.get(`/products/${id}`);
    return response.data.data;
  });

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addProductToCart({
        id: product.id,
        title: product.name,
        price: product.sale_price || product.regular_price,
        quantity: quantity,
        image: product.primary_image,
        isCourse: false,
        type: "product"
      });
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart-checkout");
  };

  if (error) return <div className="container mx-auto py-10">Failed to load product</div>;
  
  if (isLoading) return <div className="container mx-auto py-10">Loading product...</div>;

  return (
    <div className="container mx-auto py-10">
      {/* Product details rendering */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="md:w-1/2">
          <Image
            src={product.primary_image || "/placeholder.svg"}
            alt={product.name}
            width={900}
            height={600}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        
        {/* Product info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
          
          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-blue-600">
              ${product.sale_price || product.regular_price}
            </span>
            
            {product.sale_price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.regular_price}
              </span>
            )}
            
            {product.discount_percentage > 0 && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                {product.discount_percentage}% Off
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">{product.short_description}</p>
          
          {/* Quantity input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-2 w-32">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center border rounded p-2"
                min="1"
              />
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to cart and buy now buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleAddToCart} 
              variant="outline" 
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button 
              onClick={handleBuyNow} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
      
      {/* Additional product details */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
};

export default Product_Details;
