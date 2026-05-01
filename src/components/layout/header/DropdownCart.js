"use client";
import { useCartContext } from "@/contexts/CartContext";
import countTotalPrice from "@/libs/countTotalPrice";
import Link from "next/link";
const DropdownCart = ({ isHeaderTop }) => {
  const { cartProducts, deleteProductFromCart } = useCartContext();
  const totalProduct = cartProducts?.length;

  // calculate total price
  const totalPrice = countTotalPrice(cartProducts);

  return (
    <>
      <Link
        href="/cart"
        className={`mr-2 relative ${isHeaderTop ? "block" : "block"}`}
      >
        <i className="icofont-cart-alt text-2xl text-blackColor group-hover:text-brand transition-all duration-300 "></i>
        <span
          className={`${
            totalProduct < 10 ? "px-1 py-[2px]" : "px-3px pb-1 pt-3px"
          } absolute -top-1 2xl:-top-[5px] -right-[10px] lg:right-3/4 2xl:-right-[10px] text-[10px] font-medium text-white -dark bg-brand leading-1 rounded-full z-50 block`}
        >
          {totalProduct}
        </span>
      </Link>
    </>
  );
};

export default DropdownCart;
