"use client";
import CommonHeader from "@/components/dashboard/common-header";
import Sidebar from "@/components/dashboard/sidebar";
import { tutorMenuItems } from "@/config/menu-items";
import { useEffect, useState } from "react";

export default function TutorDashboardLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

  return (
    <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar menuItems={tutorMenuItems} userType="tutor"  isMobile={isMobile} />
      <div className="flex flex-col">
        <CommonHeader menuItems={tutorMenuItems} userType="tutor"/>
        <main className="container py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
