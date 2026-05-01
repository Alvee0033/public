import React from "react";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import OrdersList from "@/components/sections/orders/OrdersList";

const OrdersPage = () => {
  return (
    <div>
      <HeroPrimary title="My Orders" path="Orders" />
      <OrdersList />
    </div>
  );
};

export default OrdersPage;
