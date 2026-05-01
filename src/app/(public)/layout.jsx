"use client";

import DeferredHeader from "@/components/layout/header/DeferredHeader";
import CartContextProvider from "@/contexts/CartContext";
import { stableSWRConfig } from "@/lib/swr-config";
import { SWRConfig } from "swr";

export default function PublicLayout({ children }) {
  return (
    <CartContextProvider>
      <div className="flex min-h-screen flex-col">
        <DeferredHeader />
        <SWRConfig value={stableSWRConfig}>
          <main className="flex-1">{children}</main>
        </SWRConfig>
      </div>
    </CartContextProvider>
  );
}
