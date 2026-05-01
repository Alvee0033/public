"use client";
import { useCartContext } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QuantityInput from "../inputs/QuantityInput";

const ProductDetails = ({ product, isModal = false }) => {
  const { addProductToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);

  const {
    id,
    name: title,
    sale_price: price,
    primary_image: image,
    regular_price: previousPrice,
    stock_quantity: stockQuantity,
  } = product || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-12 bg-white rounded-lg  container mb-10">
      {/* Image Section */}
      <div className="relative flex justify-center">
        <div className="md:sticky top-[100px] max-w-md">
          <Image src={image || "https://placehold.co/300"} width={300} height={300} alt={title} />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
          {isModal ? (
            <Link
              href={`/ecommerce/products/${id}`}
              className="text-gray-900 hover:text-primaryColor transition-all duration-300"
            >
              {title}
            </Link>
          ) : (
            <span className="text-gray-900">{title}</span>
          )}
        </h4>

        {/* Pricing Section */}
        <div className="flex items-center space-x-4">
          <p className="text-xl text-red-500 font-semibold">
            <del>${previousPrice?.toFixed(2)}</del>
          </p>
          <p className="text-2xl text-green-600 font-bold">
            ${price?.toFixed(2)}
          </p>
        </div>

        {/* Stock Section */}
        <p className="text-lg text-blue-600">{stockQuantity} items in stock</p>

        {/* Quantity Section */}
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <p className="text-gray-700">Quantity</p>
            <div className="flex items-center space-x-4">
              <QuantityInput quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={() => {
                  addProductToCart({
                    id,
                    title,
                    price,
                    quantity,
                    image,
                  });
                  setQuantity(1);
                }}
                className="px-6 py-3 bg-primaryColor text-white rounded-full hover:bg-primaryColorDark shadow-lg transition-all duration-300"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Optional Countdown or Extra Info */}
        {/* <Countdown endDate="2025-12-31T23:59:59" /> */}
      </div>
    </div>
  );
};

export default ProductDetails;
