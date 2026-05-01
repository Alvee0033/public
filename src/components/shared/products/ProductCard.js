"use client";
import { useCartContext } from "@/contexts/CartContext";
/* import { useWishlistContext } from "@/contexts/WishlistContext"; */
import modal from "@/libs/modal";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Reviews5Star from "../others/Reviews5Star";
let idx = -1;
const ProductCard = ({ product, handleCurrentProduct }) => {
  const {
    id,
    name,
    primary_image,
    sale_price,
    regular_price,
    discount_percentage,
    rating_score,
    product_category,
  } = product;

  const { addProductToCart } = useCartContext();
 /*  const { addProductToWishlist } = useWishlistContext(); */
  const depBgs = [
    "bg-secondaryColor",
    "bg-blue",
    "bg-greencolor2",
    "bg-yellow",
  ];

  idx = (idx + 1) % depBgs.length;
  useEffect(() => {
    modal();
  }, []);

  return (
    <div className="group">
      <div className="sm:px-15px mb-30px">
        <div className="p-15px bg-whiteColor">
          {/* card image  */}
          <div className="relative">
            <Link
              href={`/store/products/${id}`}
              className="w-full overflow-hidden"
            >
              <Image
                src={primary_image || "https://placehold.co/300"}
                alt={name}
                width={300} // a default width
                height={300} //a default height
                className="w-full h-[300px] object-cover transition-all duration-300 group-hover:scale-110"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                {discount_percentage > 0 && (
                  <p className="text-xs text-whiteColor px-4 py-[3px] rounded font-semibold bg-[#FF3B3B]">
                    -{discount_percentage}%
                  </p>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:bottom-5">
              <ul className="flex gap-[6px] justify-center items-center">
                <li className="h-46px tooltip" data-tip="Add to Cart">
                  <button
                    onClick={() =>
                      addProductToCart({
                        id: product?.id,
                        title: product?.name,
                        price: product?.sale_price || product?.regular_price,
                        quantity: 1,
                        image: product?.primary_image,
                        isCourse: true,
                      })
                    }
                    className="text-sm h-full leading-46px px-4 box-content text-contentColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor transition-all duration-300 rounded"
                  >
                    Add to cart
                  </button>
                </li>
                <li className="h-46px">
                  <button
                    data-tip="Quick View"
                    className="tooltip modal-open"
                    onMouseEnter={() => handleCurrentProduct(id)}
                  >
                    <svg
                      className="ionicon w-18px h-18px py-14px px-4 box-content text-contentColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor transition-all duration-300 rounded"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></path>
                      <circle
                        cx="256"
                        cy="256"
                        r="80"
                        fill="none"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                        strokeWidth="32"
                      ></circle>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* card content  */}
          <div>
            <Link
              href={`/store/products/${id}`}
              className="text-xl md:text-size-22 font-medium text-blackColor mb-10px mt-5 font-hind hover:text-primaryColor capitalize"
            >
              {name}
            </Link>
            {/* price  */}
            <div className="text-2xl font-semibold text-primaryColor font-inter mb-4">
              ${sale_price ? sale_price.toFixed(2) : "0.00"}
              <del className="text-base text-lightGrey4 font-semibold">
                / ${regular_price ? regular_price.toFixed(2) : "0.00"}
              </del>
            </div>
            {/* rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
              <div>
                <Link
                  href={`/shop?category=${product_category?.name?.toLowerCase()}`}
                  className="text-base text-contentColor hover:text-primaryColor"
                >
                  {product_category?.name}
                </Link>
              </div>
              <Reviews5Star reviews={rating_score} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
