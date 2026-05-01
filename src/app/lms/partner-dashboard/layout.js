"use client";
import CommonHeader from "@/components/dashboard/common-header";
import Sidebar from "@/components/dashboard/sidebar";
import { partnerMenuItems } from "@/config/menu-items";

export default function Layout({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar menuItems={partnerMenuItems} userType="partner" />
      <div className="flex flex-col">
        <CommonHeader userType="partner" menuItems={partnerMenuItems} />
        <main className="container py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
