"use client";

import StripePaymentForm from "@/components/payment/StripePaymentForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartContext } from "@/contexts/CartContext";
import axios from "@/lib/axios";
import { checkCourseEnrollment } from "@/lib/enrollment";
import countTotalPrice from "@/libs/countTotalPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

function CheckoutSteps({ phase }) {
  const steps = [
    { key: "review", label: "Review" },
    { key: "payment", label: "Payment" },
    { key: "done", label: "Confirmation" },
  ];
  const idx = phase === "payment" ? 1 : phase === "done" ? 2 : 0;
  return (
    <nav
      className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="Checkout progress"
    >
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
        {steps.map((s, i) => {
          const active = i === idx;
          const complete = i < idx;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  complete
                    ? "bg-emerald-600 text-white"
                    : active
                      ? "bg-blue-600 text-white ring-2 ring-blue-200"
                      : "bg-slate-100 text-slate-500"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`text-sm font-semibold ${
                  active ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 ? (
                <span className="hidden text-slate-300 sm:inline" aria-hidden>
                  —
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-xs text-slate-500">
        {phase === "review" && "Confirm your items and shipping details."}
        {phase === "payment" && "Complete payment securely — your enrollment is finalized after success."}
        {phase === "done" && "You’re all set. Redirecting to your orders…"}
      </p>
    </nav>
  );
}

function CartCheckoutPage() {
  const router = useRouter();
  const { cartProducts, setCartProducts } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [cartNote, setCartNote] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    street_address: "",
    city: "",
    zip_code: "",
    country: "",
  });

  const subtotal = countTotalPrice(cartProducts);
  const totalPrice = subtotal ? subtotal : 0;

  // Use all cart products instead of filtering by isCourse
  const courseItems = cartProducts;
  const courseIds = courseItems.map((item) => item.id);

  useEffect(() => {
    // Debug cart products
    console.log("Cart products in checkout:", cartProducts);

    if (!cartProducts?.length) {
      router.push("/cart");
      return;
    }

    // Load cart note and shipping address from localStorage
    const savedNote = localStorage.getItem("cart_note");
    const savedAddress = localStorage.getItem("shipping_address");

    console.log("Saved address from localStorage:", savedAddress);

    if (savedNote) setCartNote(savedNote);
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        console.log("Parsed address:", parsedAddress);
        setShippingAddress(parsedAddress);
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }

    setLoading(false);
  }, [cartProducts, router]);

  async function handlePaymentSuccess() {
    try {
      setPaymentSuccess(true);

      // Log the cart items to debug
      console.log("Processing payment success for items:", courseItems);

      // Better detection of product items with more robust filtering
      const courseOnlyItems = courseItems.filter(
        (item) =>
          item.type === "course" || !item.type || item.type === undefined
      );

      const productOnlyItems = courseItems.filter(
        (item) => item.type && item.type !== "course"
      );

      // Log the split items for debugging
      console.log("Course items:", courseOnlyItems);
      console.log("Product items:", productOnlyItems);

      // Get user information for order updates
      let userId = 0;
      let user = {};
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          user = JSON.parse(userString);
          userId = user.id || 0;
        }
      } catch (error) {
        console.error("Error retrieving user data from localStorage:", error);
      }

      // 1. Handle course items with EduMarket enrollment confirmation (matches dev API).
      const enrollmentFailures = [];
      if (courseOnlyItems.length > 0) {
        await Promise.all(
          courseOnlyItems.map(async (item) => {
            try {
              const { enrolled } = await checkCourseEnrollment(item.id);
              if (enrolled) return;

              await axios.post("/edumarket/enrollments/confirm", {
                course_id: parseInt(item.id),
                payment_reference: `cart-checkout:${Date.now()}`,
              });
            } catch (err) {
              console.error(`Error enrolling in course ${item.id}:`, err);
              enrollmentFailures.push(item.title || `Course #${item.id}`);
            }
          })
        );
        if (enrollmentFailures.length > 0) {
          setEnrollmentError(
            `Could not enroll: ${enrollmentFailures.join(", ")}. Payment was received; contact support or try again from your dashboard.`
          );
        }
      }

      // 2. Handle product items with /orders
      if (productOnlyItems.length > 0) {
        try {
          console.log(
            "Processing products order with items:",
            productOnlyItems
          );

          // Create order object for products
          const orderInfo = {
            order_number: `ORD-${Date.now()}`,
            order_date: new Date().toISOString(),
            service_or_product: true, // This is a product order
            delivery_or_pickup: true,
            payment_completed: true, // Mark as paid immediately
            full_name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : "",
            street_address: shippingAddress.street_address || "",
            city: shippingAddress.city || "",
            zip_code: shippingAddress.zip_code || "",
            email: user.email || "",
            phone: "",
            customer_notes: cartNote || "",
            total_discount_amount: 0,
            service_charge: 0,
            number_of_items: productOnlyItems.length,
            sub_total_excluded_tax: productOnlyItems.reduce(
              (total, item) => total + item.price * (item.quantity || 1),
              0
            ),
            total_tax_amount: 0,
            discount_code: 0,
            country: shippingAddress.country || "",
            master_order_status_type: 0,
            master_order_channel_type: 0,
            user: userId,
            order_items: productOnlyItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity || 1,
              price: item.price,
              name: item.title || "Product",
            })),
          };

          console.log("Sending order to /orders endpoint:", orderInfo);

          // Send to /orders endpoint for products
          const response = await axios.post("/orders", orderInfo);
          console.log("Product order created successfully:", response.data);
        } catch (err) {
          console.error("Error processing product items with /orders:", err);
          if (err.response) {
            console.error("Response error data:", err.response.data);
            console.error("Response status:", err.response.status);
          }
        }
      } else {
        console.log("No product items to process");
      }

      // Clear cart and shipping info after successful order
      localStorage.removeItem("shipping_address");
      localStorage.removeItem("cart_note");
      setEnrollmentSuccess(true);
      setCartProducts([]);
      localStorage.setItem("cart", JSON.stringify([]));

      // Redirect to orders page
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentError(
        (prev) =>
          prev ||
          "Something went wrong while finalizing your order. Check orders or contact support."
      );
    }
  }

  if (loading)
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-full max-w-md rounded bg-slate-100" />
          <div className="grid gap-4 md:grid-cols-3 pt-4">
            <div className="h-40 rounded-xl bg-slate-100 md:col-span-2" />
            <div className="h-40 rounded-xl bg-slate-100" />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Loading checkout…
        </p>
      </div>
    );

  if (paymentSuccess)
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <CheckoutSteps phase="done" />
        <Card className="max-w-4xl mx-auto border-emerald-200 bg-emerald-50/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Payment successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-emerald-900">
              {enrollmentSuccess
                ? "Your order is complete. We’re taking you to your orders page."
                : "Payment received. Finalizing your order…"}
            </p>
            {enrollmentError && (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                role="status"
              >
                <p className="font-semibold">Enrollment notice</p>
                <p className="mt-1">{enrollmentError}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => router.push("/orders")}
            >
              View My Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  function OrderSummaryCard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>
            Review your order before proceeding to payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Products Section - Enhanced */}
            <div className="border-b pb-3">
              <h3 className="font-medium text-gray-700 mb-3">
                Selected Products
              </h3>
              {courseItems.length > 0 ? (
                <div className="space-y-3">
                  {courseItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0"
                    >
                      {item.image && (
                        <div className="w-16 h-16 relative overflow-hidden rounded bg-gray-50 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600">
                            Quantity:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <div className="font-medium text-gray-900">
                            ${item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No items in cart</p>
              )}
            </div>

            {/* Shipping address section */}
            {shippingAddress &&
            (shippingAddress.street_address ||
              shippingAddress.city ||
              shippingAddress.zip_code ||
              shippingAddress.country) ? (
              <div className="pt-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primaryColor"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                  {shippingAddress.street_address && (
                    <p>{shippingAddress.street_address}</p>
                  )}
                  {(shippingAddress.city || shippingAddress.zip_code) && (
                    <p>
                      {shippingAddress.city} {shippingAddress.zip_code}
                    </p>
                  )}
                  {shippingAddress.country && <p>{shippingAddress.country}</p>}
                </div>
              </div>
            ) : (
              <div className="pt-3">
                <h4 className="font-medium text-yellow-600 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  No Shipping Address
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Please add a shipping address in the cart page.
                </p>
              </div>
            )}

            {/* Cart note section */}
            {cartNote && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-700">
                  Special Instructions
                </h4>
                <p className="text-sm text-gray-600 mt-1">{cartNote}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/cart")}
          >
            Back to Cart
          </Button>
        </CardFooter>
      </Card>
    );
  }

  function PriceSummary({ subtotal, totalPrice }) {
    return (
      <div className="">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t mt-2 pt-2">
          <span>Total:</span>
          <span>${totalPrice?.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  function OrderDetailsCard() {
    // Determine if all items are courses
    const allItemsAreCourses = courseItems.every(
      (item) => item.type === "course" || !item.type || item.type === undefined
    );

    // Add state to track order creation
    const [orderCreating, setOrderCreating] = useState(false);

    // Function to handle the Proceed to Payment button click
    const handleProceedToPayment = async () => {
      try {
        setOrderCreating(true);

        // Get user information for order creation
        let userId = 0;
        let user = {};
        try {
          const userString = localStorage.getItem("user");
          if (userString) {
            user = JSON.parse(userString);
            userId = user.id || 0;
            console.log("User ID for order:", userId);
          } else {
            console.warn("No user found in localStorage");
          }
        } catch (error) {
          console.error("Error retrieving user data from localStorage:", error);
        }

        // Debug cart items
        console.log("All cart items:", courseItems);
        console.log(
          "Item types:",
          courseItems.map((item) => item.type || "no-type")
        );

        // Always create order regardless of product type
        // This ensures the POST request is always sent
        if (courseItems.length > 0) {
          // Create order object for all items
          const orderInfo = {
            order_number: `ORD-${Date.now()}`,
            order_date: new Date().toISOString(),
            service_or_product: !allItemsAreCourses,
            delivery_or_pickup: true,
            payment_completed: false, // Will be updated to true after payment
            full_name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : "",
            street_address: shippingAddress.street_address || "",
            city: shippingAddress.city || "",
            zip_code: shippingAddress.zip_code || "",
            email: user.email || "",
            phone: "",
            customer_notes: cartNote || "",
            total_discount_amount: 0,
            service_charge: 0,
            number_of_items: courseItems.length,
            sub_total_excluded_tax: courseItems.reduce(
              (total, item) => total + item.price * (item.quantity || 1),
              0
            ),
            total_tax_amount: 0,
            discount_code: 0,
            country: 0, // Changed from shippingAddress.country || ""
            master_order_status_type: 0,
            master_order_channel_type: 0,
            user: userId,
            order_items: courseItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity || 1,
              price: item.price,
              name: item.title || "Product",
            })),
          };

          console.log(
            "SENDING ORDER to /orders endpoint (MANDATORY):",
            orderInfo
          );

          // IMPORTANT: Always send the POST request to /orders
          try {
            const response = await axios.post("/orders", orderInfo);
            console.log("Order created successfully:", response.data);

            // Store the order ID for reference after payment
            if (response.data && response.data.id) {
              localStorage.setItem("pending_order_id", response.data.id);
            }
          } catch (orderError) {
            console.error("Failed to create order:", orderError);
            if (orderError.response) {
              console.error(
                "Order creation failed:",
                orderError.response.status,
                orderError.response.data
              );
            }
            // Continue to payment form even if order creation fails
          }
        } else {
          console.warn("No items in cart to create order");
        }

        // Show payment form after order creation attempt
        console.log("Proceeding to payment form");
        setShowPaymentForm(true);
        setOrderCreating(false);
      } catch (error) {
        console.error("Error in payment preparation:", error);
        setOrderCreating(false);
        // Still show payment form even if there's an error
        setShowPaymentForm(true);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">
                Items in Cart: {courseItems.length}
              </h4>
              <p className="text-sm text-gray-500">
                You are about to purchase {courseItems.length}{" "}
                {allItemsAreCourses ? "course" : "item"}
                {courseItems.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Payment Summary - Only show here */}
            <div className="border-t pt-2">
              <PriceSummary subtotal={subtotal} totalPrice={totalPrice} />
            </div>

            {/* Course Benefits - Only show if items are courses */}
            {allItemsAreCourses && (
              <div className="border-t pt-2">
                <h4 className="font-semibold">Courses Include:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                  <li>Full lifetime access</li>
                  <li>Access on mobile and desktop</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          {!showPaymentForm ? (
            <Button
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={orderCreating}
            >
              {orderCreating ? "Creating Order..." : "Proceed to Payment"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPaymentForm(false)}
            >
              Back to Order Summary
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Checkout
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Review your cart, then pay securely. Course access is confirmed after
          payment.
        </p>

        <CheckoutSteps phase={showPaymentForm ? "payment" : "review"} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {showPaymentForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Complete your payment to enroll in these courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StripePaymentForm
                    courseId={courseIds[0]}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentForm(false)}
                    isMultiCourse={true}
                    totalAmount={totalPrice}
                  />
                </CardContent>
              </Card>
            ) : (
              <OrderSummaryCard />
            )}
          </div>

          <div className="md:col-span-1">
            <OrderDetailsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCheckoutPage;
