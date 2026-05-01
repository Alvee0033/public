"use client";

import CartContextProvider from "@/contexts/CartContext";

export default function ContextWrapper({ children }) {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  );
}
