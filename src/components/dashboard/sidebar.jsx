"use client";
import logo from "@/assets/icons/navbarlogo.png";
import { logoutUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import {
  ChevronDown,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Sidebar({
  menuItems,
  userType,
  isCollapsed,
  toggleSidebar,
  isMobile,
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const currentRoute = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const handleSignOut = async () => {
    await logoutUser(dispatch);
    window.location.href = "/login";
  };

  useEffect(() => {
    setIsSidebarVisible(!isMobile);
  }, [isMobile]);

  const shouldCollapse = isMobile ? false : isCollapsed;

  const sidebarClasses = cn(
    "border-r border-slate-100 bg-white transition-all duration-300 z-40",
    isMobile ? "fixed top-0 left-0 h-full shadow-2xl" : "relative h-full min-h-screen",
    isMobile && !isSidebarVisible ? "-translate-x-full" : "translate-x-0",
    shouldCollapse ? "w-[80px]" : "w-[280px]"
  );

  return (
    <>
      {isMobile && isSidebarVisible && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" onClick={() => setIsSidebarVisible(false)} />
      )}

      {isMobile && (
        <button
          onClick={() => setIsSidebarVisible(true)}
          className="fixed left-4 top-4 z-20 md:hidden bg-white p-2.5 rounded-xl shadow-lg border border-slate-100"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
      )}

      <aside className={sidebarClasses}>
        <div className="flex h-full flex-col sticky top-0">
          {/* Logo Area */}
          <div className={cn(
            "flex h-20 items-center border-b border-slate-50 px-6",
            shouldCollapse ? "justify-center px-0" : "justify-between"
          )}>
            <Link href="/" className="transition-transform hover:scale-105">
              {shouldCollapse ? (
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">S</div>
              ) : (
                <Image
                  src={logo}
                  alt="ScholarPASS"
                  width={140}
                  height={32}
                  style={{ width: "140px", height: "32px" }}
                />
              )}
            </Link>
            {isMobile && (
              <button onClick={() => setIsSidebarVisible(false)} className="p-2 hover:bg-slate-50 rounded-lg">
                <ChevronLeft className="h-5 w-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-slate-200">
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  isCollapsed={shouldCollapse}
                  activeLink={currentRoute}
                />
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-50 space-y-1.5">
            {!shouldCollapse && (
              <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50/90 p-3.5 relative overflow-hidden">
                <Sparkles className="absolute -right-1 -top-1 h-8 w-8 text-blue-500/15" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                  ScholarPASS Plus
                </p>
                <p className="text-xs font-semibold text-slate-700 mb-2.5 leading-snug">
                  AI features & premium courses
                </p>
                <Link
                  href="/scholarpass-plus"
                  className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline"
                >
                  Upgrade
                </Link>
              </div>
            )}
            
            <MenuItem 
              item={{ label: "Settings", href: `/lms/${userType}-dashboard/settings`, icon: Settings }} 
              isCollapsed={shouldCollapse} 
              activeLink={currentRoute} 
            />
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all",
                shouldCollapse && "justify-center px-0"
              )}
              title={shouldCollapse ? "Sign out" : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!shouldCollapse && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

export const MenuItem = ({ item, isCollapsed, activeLink }) => {
  const Icon = item.icon || LayoutDashboard;
  const hasSubmenu = item.items && item.items.length > 0;
  const normalizeRoute = (route = "") => route.replace(/\/+$/, "");
  const activeRoute = normalizeRoute(activeLink);
  const itemRoute = normalizeRoute(item.href);
  const isActive =
    activeRoute === itemRoute ||
    item.items?.some((sub) => activeRoute === normalizeRoute(sub.href));
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (hasSubmenu && isActive) {
      setIsOpen(true);
    }
  }, [hasSubmenu, isActive]);

  const sharedClasses = cn(
    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group relative",
    isCollapsed ? "justify-center px-0" : "justify-start",
    isActive 
      ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50" 
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  );

  return (
    <div className="w-full">
      {item.href ? (
        <Link href={item.href} className={sharedClasses} title={isCollapsed ? item.label : ""}>
          <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-blue-600")} />
          {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
          {isActive && !isCollapsed && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600" />}
        </Link>
      ) : (
        <button onClick={() => setIsOpen(!isOpen)} className={sharedClasses}>
          <Icon className="h-5 w-5" />
          {!isCollapsed && (
            <>
              <span className="font-bold text-sm tracking-tight flex-1 text-left">{item.label}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </>
          )}
        </button>
      )}

      {hasSubmenu && isOpen && !isCollapsed && (
        <div className="mt-1 ml-6 pl-4 border-l-2 border-slate-100 space-y-1">
          {item.items.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className={cn(
                "block py-2 text-sm font-bold transition-colors",
                activeLink === sub.href ? "text-blue-600" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
