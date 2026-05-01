"use client";
import { useCartContext } from "@/contexts/CartContext";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuantityInput from "../inputs/QuantityInput";

const CartProduct = ({ product }) => {
  const { id, title, price, quantity: quantity1, image, isCourse } = product;
  const { deleteProductFromCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (quantity1 > 0) {
      setQuantity(quantity1);
    }
  }, [quantity1]);
  const totalPrice = quantity * price;
  return product ? (
    <tr className="border-b border-borderColor ">
      <td className="py-15px md:py-5  ">
        <Link
          href={`/${
            isCourse ? "learninghub/course-details" : "ecommerce/products"
          }/${id}`}
        >
          <Image
            loading="lazy"
            src={image || "https://placehold.co/300x300.png"}
            alt="product-1"
            className="max-w-20 w-full"
            width={500}
            height={500}
          />
        </Link>
      </td>
      <td className="py-15px md:py-5   w-300px">
        <Link
          className="hover:text-primaryColor"
          href={`/${
            isCourse ? "learninghub/course-details" : "ecommerce/products"
          }/${id}`}
        >
          {title?.length > 30 ? title?.slice(0, 30) : title}
        </Link>
      </td>
      <td className="py-15px md:py-5  ">
        <span className="amount">${price?.toFixed(2)}</span>
      </td>
      <td className="py-15px md:py-5   w-300px">
        <QuantityInput
          quantity={quantity}
          setQuantity={setQuantity}
          type={"box"}
          product={product}
        />
      </td>
      <td className="py-15px md:py-5  ">
        ${totalPrice <= 0 ? "0.00" : totalPrice.toFixed(2)}
      </td>
      <td className="py-15px md:py-5">
        <button
          onClick={() => deleteProductFromCart(id, title)}
          className="hover:text-primaryColor"
        >
          <Trash />
        </button>
      </td>
    </tr>
  ) : (
    <p></p>
  );
};

export default CartProduct;
