import CheckoutPrimary from "@/components/sections/checkout/CheckoutPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

export const metadata = {
  title: "Checkout | ScholarPASS - Education LMS Template",
  description: "Checkout | ScholarPASS - Education LMS Template",
};

const Checkout = async () => {
  return (
    <>
      <HeroPrimary path={"Checkout"} title={"Checkout"} />
      <CheckoutPrimary />
    </>
  );
};

export default Checkout;
