"use client";

import blogImage7 from "@/assets/images/blog/blog_7.png";
import CustomImage from "@/components/core/CustomImage";
import StripePaymentForm from "@/components/payment/StripePaymentForm";
import { useCartContext } from "@/contexts/CartContext";
import { checkCourseEnrollment } from "@/lib/enrollment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PopupVideo from "../popup/PopupVideo";

const COURSE_FEATURES = [
  {
    label: "Instructor",
    valueKey: "primary_tutor.name",
    defaultValue: "D. Willaim",
  },
  { label: "Start Date", valueKey: "start_date", defaultValue: "05 Dec 2024" },
  {
    label: "Total Duration",
    valueKey: "total_duration",
    defaultValue: "08Hrs 32Min",
  },
  { label: "Enrolled", valueKey: "enrolled_students", defaultValue: "100" },
  { label: "Lectures", defaultValue: "30" },
  { label: "Skill Level", defaultValue: "Basic" },
  { label: "Language", defaultValue: "Spanish" },
  { label: "Quiz", defaultValue: "Yes" },
  { label: "Certificate", defaultValue: "Yes" },
];

function CourseEnroll({ type, course }) {
  const { push } = useRouter();
  const { addProductToCart } = useCartContext();
  const { id, image, regular_price, name } = course || {};

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

  useEffect(() => {
    async function checkEnrollment() {
      if (!id) return;

      setIsCheckingEnrollment(true);
      try {
        const result = await checkCourseEnrollment(id);
        setIsEnrolled(!!result.enrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
      } finally {
        setIsCheckingEnrollment(false);
      }
    }

    checkEnrollment();
  }, [id]);

  function handleAddToCart() {
    addProductToCart({
      id,
      title: name,
      price: regular_price,
      quantity: 1,
      image,
      isCourse: true,
    });
  }

  function handleBuyNow() {
    push(`/direct-checkout/${id}`);
  }

  function handleGoToDashboard() {
    push(`/learninghub/course-dashboard/${id}`);
  }

  return (
    <div className="py-33px px-25px shadow-event mb-30px bg-whiteColor rounded-md">
      {type !== 3 && (
        <div className="overflow-hidden relative mb-5">
          <CustomImage
            src={course?.image || blogImage7}
            alt=""
            className="w-full aspect-video object-cover"
            width={500}
            height={500}
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <PopupVideo videoUrl="https://vimeo.com/243556536" />
          </div>
        </div>
      )}

      <div
        className={`flex justify-between ${
          type === 2 ? "mt-50px mb-5" : type === 3 ? "mb-50px" : "mb-5"
        }`}
      >
        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
          ${regular_price ? regular_price.toFixed(2) : "32.00"}
          <del className="text-sm text-lightGrey4 font-semibold">/ $67.00</del>
        </div>
        <div>
          <span className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1">
            68% Scholarship
          </span>
        </div>
      </div>

      <div className="mb-5">
        {isCheckingEnrollment ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryColor" />
            <span className="ml-2">Checking enrollment...</span>
          </div>
        ) : isEnrolled ? (
          <div className="w-full text-center bg-green-100 text-green-800 px-25px py-10px mb-10px leading-1.8 border border-green-200 rounded">
            <span className="font-semibold">✓ Enrolled</span>
            <p className="text-sm mt-1">
              You are already enrolled in this course
            </p>
            <button
              onClick={handleGoToDashboard}
              className="mt-2 text-size-15 text-whiteColor bg-green-600 px-25px py-10px leading-1.8 border border-green-600 hover:text-green-600 hover:bg-whiteColor inline-block rounded group"
            >
              Go to Course Dashboard
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              className="w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group"
            >
              Add To Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group"
            >
              Buy Now
            </button>
          </>
        )}

        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Complete Your Purchase</h3>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <StripePaymentForm
                courseId={id}
                onSuccess={() => {
                  setShowPaymentForm(false);
                  push(`/payment-result?courseId=${id}`);
                }}
                onCancel={() => setShowPaymentForm(false)}
              />
            </div>
          </div>
        )}

        <span className="text-size-13 text-contentColor leading-1.8">
          <i className="icofont-ui-rotation" /> 45-Days Money-Back Guarantee
        </span>
      </div>

      <ul>
        {COURSE_FEATURES.map(({ label, valueKey, defaultValue }) => (
          <li
            key={label}
            className="flex items-center justify-between py-10px border-b border-borderColor"
          >
            <p className="text-sm font-medium text-contentColor leading-1.8">
              {label}:
            </p>
            <p className="text-xs text-contentColor px-10px py-6px bg-borderColor rounded-full leading-13px">
              {valueKey ? course?.[valueKey] || defaultValue : defaultValue}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <p className="text-sm text-contentColor leading-1.8 text-center mb-5px">
          More inquiry about course
        </p>
        <button
          type="submit"
          className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group"
        >
          <i className="icofont-phone" /> +47 333 78 901
        </button>
      </div>
    </div>
  );
}

export default CourseEnroll;
