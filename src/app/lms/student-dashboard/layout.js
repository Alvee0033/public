'use client';
import CommonHeader from '@/components/dashboard/common-header';
import Sidebar from '@/components/dashboard/sidebar';
import { studentMenuItems } from '@/config/menu-items';
import useAuth from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ScheduleProvider,
  StudentTutoringSessionsProvider,
} from './dashboard/_context/ScheduleContext';

const DeferredChatbotLauncher = dynamic(
  () => import('./dashboard/_components/DeferredChatbotLauncher'),
  { ssr: false }
);

export default function Layout({ children }) {
  useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if user is in pre-test exam mode
  const isPreTestMode = pathname?.includes('/pre-test/start');

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // If in pre-test mode, render without sidebar and header
  if (isPreTestMode) {
    return (
      <ScheduleProvider>
        <StudentTutoringSessionsProvider>
          <div className="w-full">
            {children}
          </div>
        </StudentTutoringSessionsProvider>
      </ScheduleProvider>
    );
  }

  return (
    <ScheduleProvider>
      <StudentTutoringSessionsProvider>
        <div
          className={`grid w-full transition-all duration-300 ${
            isSidebarCollapsed
              ? 'md:grid-cols-[60px_1fr]'
              : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'
          }`}
        >
          <Sidebar
            menuItems={studentMenuItems}
            userType="student"
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
          <div>
            <CommonHeader
              menuItems={studentMenuItems}
              userType="student"
              toggleSidebar={toggleSidebar}
              isCollapsed={isSidebarCollapsed}
            />
            <main className="container py-6 md:py-8">{children}</main>
          </div>
          <DeferredChatbotLauncher />
        </div>
      </StudentTutoringSessionsProvider>
    </ScheduleProvider>
  );
}
