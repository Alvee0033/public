"use client";

import dynamic from "next/dynamic";
import DeferredHeader from "@/components/layout/header/DeferredHeader";
import CartContextProvider from "@/contexts/CartContext";
import { stableSWRConfig } from "@/lib/swr-config";
import { SWRConfig } from "swr";

const Footer = dynamic(() => import("@/components/layout/footer/Footer"));

export default function PublicLayout({ children }) {
  return (
    <CartContextProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <DeferredHeader />
        <SWRConfig value={stableSWRConfig}>
          <main className="flex-1">{children}</main>
        </SWRConfig>
        <Footer />
      </div>
    </CartContextProvider>
  );
}
