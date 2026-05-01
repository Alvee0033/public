"use client";
import navbarlogo from "@/assets/icons/navbarlogo.png";
import { avatarPlaceHolder } from "@/assets/images";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { instance } from "@/lib/axios";
import { cn, logOut } from "@/lib/utils";
import { Bot, LayoutDashboard, Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import useSWR from "swr";
import { MessagesIcon, NotificationIcon } from "../icons";

const AIAgentChat = dynamic(
  () =>
    import("@/app/lms/student-dashboard/dashboard/_components/ai-agent-chat").then(
      (mod) => mod.AIAgentChat
    ),
  { ssr: false }
);

function normalizeRoute(route = "") {
  return route.replace(/\/+$/, "");
}

function mobileNavLinkClass(active, indented) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
    indented && "ml-2 border-l-2 border-slate-100 pl-3",
    active
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  );
}

function MobileLmsNav({ menuItems, currentRoute, roleType }) {
  const nActive = normalizeRoute(currentRoute);

  if (!menuItems?.length && roleType) {
    const dash = `/lms/${roleType}-dashboard`;
    return (
      <nav className="grid gap-1" aria-label="Mobile navigation">
        <SheetClose asChild>
          <Link
            href={dash}
            className={mobileNavLinkClass(nActive === normalizeRoute(dash))}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Dashboard
          </Link>
        </SheetClose>
      </nav>
    );
  }

  return (
    <nav
      className="grid gap-1 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200"
      aria-label="Mobile navigation"
    >
      {menuItems.map((item) => {
        const Icon = item.icon || LayoutDashboard;

        if (item.href) {
          const active = nActive === normalizeRoute(item.href);
          return (
            <SheetClose key={item.label} asChild>
              <Link href={item.href} className={mobileNavLinkClass(active)}>
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </SheetClose>
          );
        }

        if (item.items?.length) {
          return (
            <div key={item.label} className="space-y-1">
              <div className="px-3 pt-3 pb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                {item.label}
              </div>
              {item.items.map((sub) => {
                const subActive = nActive === normalizeRoute(sub.href);
                return (
                  <SheetClose key={sub.label} asChild>
                    <Link
                      href={sub.href}
                      className={mobileNavLinkClass(subActive, true)}
                    >
                      {sub.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          );
        }

        return null;
      })}
    </nav>
  );
}

const CommonHeader = ({
  menuItems = [],
  userType,
  type: legacyUserType,
}) => {
  const type = userType ?? legacyUserType;
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState(reduxUser ?? null);
  const [isHydrated, setIsHydrated] = useState(Boolean(reduxUser));
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const primaryRoleName = user?.app_user_roles?.[0]?.role?.name?.toLowerCase();

  const isSuperAdmin =
    user?.is_super_admin === true || primaryRoleName?.includes("admin");

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
      setIsHydrated(true);
      return;
    }

    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setUser(parsed);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsHydrated(true);
    }
  }, [reduxUser]);

  const { data: student } = useSWR(
    user?.student_id ? ["/students", user.student_id] : null,
    async ([, studentId]) => {
      const res = await instance.get(`/students/${studentId}`);
      return res.data?.status === "SUCCESS" ? res.data.data || null : null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000,
    }
  );

  const { data: employeeData } = useSWR(
    typeof student?.assigned_employee_id === "number"
      ? ["/employees", student.assigned_employee_id]
      : null,
    async ([, employeeId]) => {
      const res = await instance.get(
        `/employees?filter=${encodeURIComponent(JSON.stringify({ id: employeeId }))}`
      );
      if (res.data?.status === "SUCCESS" && res.data?.data?.length > 0) {
        return res.data.data[0];
      }
      return null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000,
    }
  );

  if (!isHydrated) {
    return (
      <header
        className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b border-slate-100 bg-white px-2 sm:px-4 lg:h-[60px] lg:px-6"
        aria-busy="true"
        aria-label="Loading header"
      >
        <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 animate-pulse lg:hidden" />
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse hidden sm:block" />
          <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse hidden sm:block" />
          <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
          <div className="ms-2 hidden text-right sm:block">
            <div className="mb-1 h-3 w-24 rounded bg-slate-100 animate-pulse ms-auto" />
            <div className="h-2 w-16 rounded bg-slate-100 animate-pulse ms-auto" />
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </header>
    );
  }

  const roleLabel =
    type === "tutor"
      ? "Tutor"
      : type === "student"
        ? "Student"
        : type === "guardian"
          ? "Guardian"
          : type === "admin"
            ? "Admin"
            : type === "partner"
              ? "Partner"
              : "Your";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b border-slate-100 bg-white px-2 sm:px-4 sm:gap-3 lg:h-[60px] lg:justify-end lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 -mt-2 shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[min(100vw-2rem,320px)] flex-col gap-0">
          <SheetClose asChild>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4"
            >
              <Image
                src={navbarlogo}
                alt="ScholarPASS"
                width={140}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </SheetClose>
          <MobileLmsNav
            menuItems={menuItems}
            currentRoute={currentRoute}
            roleType={type}
          />
        </SheetContent>
      </Sheet>

      {/* Success Manager Display */}
      {employeeData && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <span className="text-xs font-medium text-gray-600">
            Success Manager:
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {employeeData.name}
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-1.5 sm:gap-2 py-0.5">
        <Button
          size="icon"
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          variant="secondary"
          aria-label="Messages"
        >
          <MessagesIcon className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button
          size="icon"
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          variant="secondary"
          aria-label="Notifications"
        >
          <NotificationIcon className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        {/* AI Chat trigger moved to header */}
        <Button
          size="icon"
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
          aria-label="AI Chat"
          onClick={() => setIsAIChatOpen(true)}
          title="ScholarPASS AI Agent"
        >
          <span className="relative inline-block">
            <Bot className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </span>
        </Button>
        <div className="flex gap-2 sm:gap-3 ms-3 sm:ms-4">
          <div className="text-right">
            <h4 className="font-medium uppercase">
              {user?.first_name} {user?.last_name}
            </h4>
            <p className="font-light leading-5 text-xs">
              {roleLabel} Dashboard
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus-visible:ring-0 focus">
              <Button variant="secondary" size="icon" className="rounded-full">
                <Image
                  src={user?.profile_picture_url || avatarPlaceHolder}
                  alt="user"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                disabled={isTutor}
                className={isTutor ? selectedCls : "cursor-pointer"}
                asChild
              >
                <Link href="/lms/tutor-dashboard">Tutor Dashboard</Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem
                disabled={isStudent}
                className={isStudent ? selectedCls : "cursor-pointer"}
                asChild
              >
                <Link href="/lms/student-dashboard">Student Dashboard</Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem
                disabled={isStudent}
                className={isStudent ? selectedCls : "cursor-pointer"}
                asChild
              >
                <Link href="/lms/student-dashboard">Student Dashboard</Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className={`cursor-pointer ${
                  pathname === "/lms/guardian-dashboard" ? selectedCls : ""
                }`}
                asChild
              >
                <Link href={`/lms/${type}-dashboard`}>Dashboard</Link>
              </DropdownMenuItem>

              {type !== "guardian" && !isSuperAdmin && (
                <DropdownMenuItem
                  className={`cursor-pointer ${pathname === "/lms/guardian-dashboard/courses/all" ||
                    pathname === `/lms/${type}-dashboard/my-courses`
                    ? selectedCls
                    : ""
                    }`}
                  asChild
                >
                  <Link
                    href={
                      type === "guardian"
                        ? "/lms/guardian-dashboard/courses/all"
                        : `/lms/${type}-dashboard/my-courses`
                    }
                  >
                    My Courses
                  </Link>
                </DropdownMenuItem>
              )}
              {!isSuperAdmin && (
                <DropdownMenuItem
                  className={`cursor-pointer ${pathname === `/lms/${type}-dashboard/settings`
                    ? selectedCls
                    : ""
                    }`}
                  asChild
                >
                  <Link href={`/lms/${type}-dashboard/settings`}>Settings</Link>
                </DropdownMenuItem>
              )}
              {/* <DropdownMenuItem
                disabled={isPartner}
                className={isPartner ? selectedCls : "cursor-pointer"}
                asChild
              >
                <Link href="/lms/partner-dashboard">Partner Dashboard</Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem className="cursor-pointer" asChild><Link href={`/lms/${type}/support`}>Support</Link></DropdownMenuItem> */}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* AI Chat modal placed in header so it is globally accessible */}
        <AIAgentChat
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
        />
      </div>
    </header>
  );
};

export default CommonHeader;

const selectedCls = "bg-brand hover:bg-brand text-white";
