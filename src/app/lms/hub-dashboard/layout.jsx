"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { hubMenuItems } from "@/config/menu-items";
import { useEffect, useState } from "react";

export default function HubDashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <Sidebar
        menuItems={hubMenuItems}
        userType="hub"
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed((c) => !c)}
        isMobile={isMobile}
      />
      <main
        className="flex min-h-screen flex-1 flex-col overflow-auto"
        style={{ minWidth: 0 }}
      >
        {children}
      </main>
    </div>
  );
}
