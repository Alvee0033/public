"use client";
import CartProduct from "@/components/shared/cart/CartProduct";
import { useCartContext } from "@/contexts/CartContext";
import useSweetAlert from "@/hooks/useSweetAlert";
import addItemsToLocalstorage from "@/libs/addItemsToLocalstorage";
import countTotalPrice from "@/libs/countTotalPrice";
import Link from "next/link";
import { useEffect, useState } from "react";

const CartPrimary = () => {
  const { cartProducts: currentProducts, setCartProducts } = useCartContext();
  const creteAlert = useSweetAlert();
  const cartProducts = currentProducts;
  const totalPrice = countTotalPrice(cartProducts);
  const isCartProduct = cartProducts?.length || false;

  // Add state for cart note and address
  const [cartNote, setCartNote] = useState("");
  const [address, setAddress] = useState({
    street_address: "",
    city: "",
    zip_code: "",
    country: "",
  });

  // Load stored values on component mount
  useEffect(() => {
    const savedNote = localStorage.getItem("cart_note");
    const savedAddress = localStorage.getItem("shipping_address");

    if (savedNote) setCartNote(savedNote);
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
  }, []);

  // update cart
  const handleUpdateCart = () => {
    // Save cart note and address to localStorage
    localStorage.setItem("cart_note", cartNote);
    localStorage.setItem("shipping_address", JSON.stringify(address));

    creteAlert("success", "Success! Cart updated.");
  };

  // Handle address field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value,
    };

    setAddress(updatedAddress);

    // Save to localStorage immediately when any address field changes
    localStorage.setItem("shipping_address", JSON.stringify(updatedAddress));
  };

  // Also update the cart note handler to save immediately
  const handleCartNoteChange = (e) => {
    const value = e.target.value;
    setCartNote(value);
    localStorage.setItem("cart_note", value);
  };

  // clear cart
  const handleClearCart = () => {
    addItemsToLocalstorage("cart", []);
    setCartProducts([]);
    // Clear cart note and address as well
    localStorage.removeItem("cart_note");
    localStorage.removeItem("shipping_address");
    setCartNote("");
    setAddress({
      street_address: "",
      city: "",
      zip_code: "",
      country: "",
    });
    creteAlert("success", "Success! Cart cleared.");
  };
  return (
    <section>
      <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
        {/* cart table */}
        <div className="text-contentColor  text-size-10 md:text-base overflow-auto">
          <table className="table-fixed md:table-auto leading-1.8 text-center w-150 md:w-full overflow-auto border border-borderColor  box-content md:box-border">
            <thead>
              <tr className="md:text-sm text-blackColor  uppercase font-medium border-b border-borderColor ">
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Image
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Product
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Price
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Quantity
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Total
                </th>
                <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {!isCartProduct ? (
                <tr className="relative">
                  <td className="p-5 md:p-10 ">
                    <p className="absolute left-0 top-0 w-full h-full flex items-center justify-center  md:text-xl font-bold capitalize opacity-70 ">
                      empty
                    </p>
                  </td>
                </tr>
              ) : (
                cartProducts?.map((product, idx) => (
                  <CartProduct key={idx} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* cart action buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px pt-22px pb-9 md:pt-30px md:pb-55px">
          <div>
            <Link
              href={"/store"}
              className="text-size-13 text-whiteColor -dark  leading-1 px-5 py-18px md:px-10 bg-blackColor  hover:bg-primaryColor "
            >
              CONTINUE SHOPPING
            </Link>
          </div>
          {isCartProduct && (
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px">
              <button
                onClick={handleUpdateCart}
                className="text-size-13 text-whiteColor -dark  leading-1 px-5 py-18px md:px-10 bg-blackColor  hover:bg-primaryColor "
              >
                UPDATE CART
              </button>
              <button
                onClick={handleClearCart}
                className="text-size-13 text-whiteColor -dark  leading-1 px-5 py-18px md:px-10 bg-blackColor  hover:bg-primaryColor "
              >
                CLEAR CART
              </button>
            </div>
          )}
        </div>

        {/* cart input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px">
          <div>
            {/* Address Information Section */}
            <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor rounded-5px mb-30px">
              {/* heading */}
              <div className="flex gap-x-4">
                <h3 className="text-lg whitespace-nowrap font-medium text-blackColor">
                  <span className="leading-1.2">Shipping Address</span>
                </h3>
              </div>
              <p className="text-xs mb-3 text-gray-600">
                Enter your delivery address details
              </p>
              {/* form */}
              <form>
                <div className="mb-4">
                  <label className="text-xs mb-1 block text-gray-600">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    value={address.street_address}
                    onChange={handleAddressChange}
                    className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs mb-1 block text-gray-600">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block text-gray-600">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={address.zip_code}
                      onChange={handleAddressChange}
                      className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2"
                      placeholder="12345"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="text-xs mb-1 block text-gray-600">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2"
                    placeholder="Country"
                  />
                </div>
              </form>
            </div>

            {/* Cart Note Section */}
            <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor rounded-5px">
              {/* heading */}
              <div className="flex gap-x-4">
                <h3 className="text-lg whitespace-nowrap font-medium text-blackColor">
                  <span className="leading-1.2">Cart Note</span>
                </h3>
              </div>
              <p className="text-xs mb-3 text-gray-600">
                Special instructions for seller
              </p>
              {/* form */}
              <form>
                <div className="mb-5">
                  <textarea
                    className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2"
                    value={cartNote}
                    onChange={handleCartNoteChange}
                    rows="4"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          <div>
            <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor rounded-5px">
              {/* heading */}
              <div className="flex gap-x-4">
                <h3 className="text-lg whitespace-nowrap font-medium text-blackColor  mb-9">
                  <span className="leading-1.2">Cart Total</span>
                </h3>
                <div className="h-1px w-full bg-borderColor2  mt-2"></div>
              </div>
              <h4 className="text-sm font-bold text-blackColor  mb-5 flex justify-between items-center">
                <span className="leading-1.2">Cart Totals</span>
                <span className="leading-1.2 text-lg font-medium">
                  ${totalPrice ? totalPrice?.toFixed(2) : 0.0}
                </span>
              </h4>
              <div>
                <Link
                  href="/cart-checkout"
                  className={`text-size-13 text-whiteColor -dark  leading-1 w-full px-10px py-18px bg-blackColor  hover:bg-primaryColor  : text-center  ${
                    totalPrice ? "" : "pointer-events-none opacity-85"
                  }`}
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPrimary;
