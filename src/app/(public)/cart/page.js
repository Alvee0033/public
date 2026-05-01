import CartPrimary from "@/components/sections/cart/CartPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

export const metadata = {
  title: "Cart | ScholarPASS - Education LMS Template",
  description: "Cart | ScholarPASS - Education LMS Template",
};

const Cart = async () => {
  return (
    <>
      <HeroPrimary path={"Cart"} title={"Cart"} />
      <CartPrimary />
    </>
  );
};

export default Cart;
