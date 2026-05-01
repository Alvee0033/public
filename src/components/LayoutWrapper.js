"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Footer = dynamic(() => import("@/components/layout/footer/Footer"), {
    ssr: false,
});
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), {
    ssr: false,
});
const DeferredSPConnectWidget = dynamic(() => import("@/components/sp-connect-widget").then((mod) => mod.SPConnectWidget), {
    ssr: false,
});

const isLmsRoute = (pathname) =>
    pathname?.startsWith("/lms/") ||
    pathname?.startsWith("/learninghub/") ||
    pathname?.startsWith("/all-courses");

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const [deferredUiReady, setDeferredUiReady] = useState(false);

    const isDashboard = pathname === "/lms/tutor-dashboard/settings" ||
        pathname === "/lms/tutor-dashboard" ||
        pathname === "/lms/tutor-dashboard/tutors-profile" ||
        pathname === "/lms/tutor-dashboard/course/add-new" ||
        pathname === "/lms/tutor-dashboard/course" ||
        pathname === "/lms/tutor-dashboard/students" ||
        pathname === "/lms/tutor-dashboard/tutors-profile/approval" ||
        pathname === "/lms/tutor-dashboard/tutors-profile/approval-pending" ||
        pathname === "/lms/tutor-dashboard/tutors-profile" ||
        pathname === "/lms/tutor-dashboard/weekly-work-schedules" ||
        pathname === "/lms/tutor-dashboard/sessions/group-list" ||
        pathname === "/lms/tutor-dashboard/sessions/session-list" ||
        pathname === "/lms/guardian-dashboard" ||
        pathname === "/lms/guardian-dashboard/students/add" ||
        pathname === "/lms/guardian-dashboard/settings" ||
        pathname === "/lms/student-dashboard" ||
        pathname === "/lms/student-dashboard/learning-goals" ||
        pathname === "/lms/student-dashboard/learning-goals/add" ||
        pathname === "/lms/student-dashboard/my-courses" ||
        pathname === "/lms/student-dashboard/assignments" ||
        pathname === "/lms/student-dashboard/quiz" ||
        pathname === "/lms/student-dashboard/exam" ||
        pathname === "/lms/student-dashboard/games" ||
        pathname === "/lms/student-dashboard/my-schedules" ||
        pathname === "/lms/student-dashboard/my-guardian" ||
        pathname === "/lms/student-dashboard/my-certificates" ||
        pathname === "/lms/student-dashboard/settings" ||
        pathname === "/lms/student-dashboard/my-guardian/new" ||
        pathname === "/lms/student-dashboard/my-weekly-schedules" ||
        pathname.startsWith("/lms/student-dashboard/learning-hub") ||
        pathname === "/lms/admin-dashboard" ||
        pathname === "/scholarship-category";

    const hideFooterOnRoutes = [
        "/register",
        "/auth/register"
    ];

    const shouldHideFooter =
        hideFooterOnRoutes.includes(pathname) ||
        pathname.startsWith("/lms/guardian-dashboard/students/") ||
        pathname.startsWith("/lms/student-dashboard/course-player") ||
        pathname.startsWith("/lms/student-dashboard/assignments/");

    const shouldShowFooter = !isDashboard && !shouldHideFooter;

    // Lazy-load IcoFont only on routes that need it (LMS / course pages)
    useEffect(() => {
        if (isLmsRoute(pathname)) {
            import("@/assets/css/icofont.min.css");
        }
    }, [pathname]);

    useEffect(() => {
        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(() => setDeferredUiReady(true), {
                timeout: 300, // reduced from 1200ms
            });
            return () => window.cancelIdleCallback?.(idleId);
        }

        const timeoutId = window.setTimeout(() => setDeferredUiReady(true), 80); // reduced from 300ms
        return () => window.clearTimeout(timeoutId);
    }, []);

    return (
        <>
            <div className="flex-1 flex flex-col">{children}</div>
            {deferredUiReady && shouldShowFooter ? <Footer /> : null}
            {deferredUiReady ? <MobileBottomNav /> : null}
            {deferredUiReady ? <DeferredSPConnectWidget /> : null}
        </>
    );
}
