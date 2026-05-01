"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search, MessageCircle, User, Menu, X,
  ChevronDown, Sparkles, Globe, Home,
  Building2, Zap, BookOpen, Wand2,
} from "lucide-react";
import Image from "next/image";
import { useSPConnect } from "@/components/sp-connect-context";
import navbarlogo from "@/assets/icons/navbarlogo.png";
import { prefetchRoute, shouldPrefetchRoute } from "@/lib/prefetch-route";
import { cn } from "@/lib/utils";
import { getDashboardRoute } from "@/lib/dashboard-route";

function navPath(href) {
  const i = href.indexOf("?");
  return i === -1 ? href : href.slice(0, i);
}

function isNavActive(pathname, href) {
  const path = navPath(href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

const BOTTOM_NAV = [
  { label: "Home",                 href: "/",                    icon: Home },
  { label: "LearningHub",          href: "/learninghub",         icon: Sparkles,  highlight: true },
  { label: "Institutes",           href: "/institutes",          icon: Building2 },
  { label: "EduMarket",            href: "/courses",             icon: BookOpen,  highlight: true },
  { label: "Get Matched",          href: "/matching-profile",    icon: Wand2,     highlight: true },
  { label: "Own a LearningHub",    href: "/register?role=partner", icon: Zap },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openWidget }                      = useSPConnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]                     = useState(null);
  const [scrolled, setScrolled]             = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const token    = localStorage.getItem("auth-token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      try { setUser(JSON.parse(userData)); } catch {}
    }
  }, []);

  const accountHref = isAuthenticated ? getDashboardRoute(user) : "/login";

  useEffect(() => {
    const timeout = setTimeout(() => {
      prefetchRoute(router, "/register?role=partner");
      prefetchRoute(router, "/login");
      if (user) prefetchRoute(router, getDashboardRoute(user));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router, user]);

  return (
    <header
      className={cn(
        /* Above Leaflet map panes/controls (z up to ~1000) so the bar stays on top */
        "sticky top-0 z-[1100] w-full transition-all duration-300",
        scrolled
          ? "shadow-[0_8px_32px_rgba(15,23,42,.08)]"
          : "shadow-[0_1px_0_rgba(15,23,42,.04)]"
      )}
    >
      {/* ROW 1 — Top utility bar */}
      <div
        className={cn(
          "border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/90 backdrop-blur-sm transition-[box-shadow] duration-300",
          scrolled && "border-slate-200/60"
        )}
      >
        <div className="w-full px-3 sm:px-5 lg:px-8">
          <div className="flex items-center h-[56px] gap-3 lg:gap-4">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 rounded-lg outline-none ring-offset-2 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--sp-blue)]">
              <Image
                src={navbarlogo}
                alt="ScholarPASS"
                width={140}
                height={36}
                className="drop-shadow-sm"
                style={{ width: "140px", height: "auto" }}
                priority
              />
            </Link>

            {/* Search */}
            <div className="group flex-1 relative flex items-center min-w-0 max-w-2xl mx-auto">
              <Search className="absolute left-4 w-4 h-4 z-10 pointer-events-none text-slate-400 transition group-focus-within:text-[var(--sp-orange)]" />
              <input
                type="text"
                placeholder="Search for courses, tutors, learning hubs..."
                className="w-full h-11 pl-11 pr-[5.25rem] rounded-2xl border-2 border-slate-200/90 bg-slate-50/80 text-[13px] text-slate-900 placeholder:text-slate-400 shadow-inner transition-all focus:border-[var(--sp-orange)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--sp-orange)]/12"
              />
              <button
                type="button"
                className="absolute right-1.5 h-8 px-4 rounded-xl text-[12px] font-bold text-white shadow-md shadow-orange-500/25 transition hover:brightness-105 active:scale-[0.98]"
                style={{ background: "var(--sp-orange)" }}
              >
                Search
              </button>
            </div>

            {/* Language */}
            <button
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200/90 bg-white text-[12px] font-semibold text-slate-600 flex-shrink-0 shadow-sm transition hover:border-[var(--sp-blue)]/35 hover:text-[var(--sp-blue)] hover:shadow"
            >
              <Globe className="w-3.5 h-3.5" />
              EN
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* SP Connect */}
            <button
              type="button"
              onClick={openWidget}
              className="hidden md:flex items-center gap-1.5 px-4 h-9 rounded-full text-[12px] font-bold text-white flex-shrink-0 shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{ background: "linear-gradient(135deg, var(--sp-blue) 0%, var(--sp-blue-deep) 100%)" }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              SP Connect
            </button>

            {/* Account */}
            <Link
              href={accountHref}
              prefetch={shouldPrefetchRoute(accountHref)}
              onMouseEnter={() => prefetchRoute(router, accountHref)}
              onTouchStart={() => prefetchRoute(router, accountHref)}
              className="hidden md:flex flex-col items-end leading-none flex-shrink-0 px-2.5 py-1.5 rounded-xl transition-colors hover:bg-slate-100/80"
            >
              <span className="text-[11px] font-medium text-slate-500">
                {isAuthenticated ? `Hello, ${user?.first_name ?? ""}` : "Hello, sign in"}
              </span>
              <span className="text-[13px] font-bold flex items-center gap-1 text-slate-900">
                <User className="w-3.5 h-3.5 text-[var(--sp-blue)]" />
                Account &amp; Lists
              </span>
            </Link>

            {/* SP Wallet */}
            <Link
              href="/wallet"
              className="hidden md:flex flex-col items-end leading-none flex-shrink-0 px-3.5 py-2 rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50/90 to-white shadow-sm transition hover:border-cyan-300/80 hover:shadow-md"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">SP Wallet</span>
              <span className="text-[13px] font-black" style={{ color: "var(--sp-blue)" }}>650 Credits</span>
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden p-2.5 rounded-xl flex-shrink-0 text-slate-600 transition hover:bg-slate-100"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2 — Bottom nav */}
      <nav
        className="hidden lg:block w-full border-t border-white/10 bg-gradient-to-r from-[#0a4d6e] via-[#155e8a] to-[#4c1d95] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
      >
        <div className="w-full px-3 sm:px-5 lg:px-8">
          <ul className="flex flex-wrap items-center gap-y-1 py-1 min-h-11">
            {BOTTOM_NAV.map(({ label, href, icon: Icon, highlight }) => {
              const active = isNavActive(pathname, href);
              const shouldPrefetch = shouldPrefetchRoute(href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    prefetch={shouldPrefetch}
                    onMouseEnter={() => prefetchRoute(router, href)}
                    onTouchStart={() => prefetchRoute(router, href)}
                    className={cn(
                      "group flex items-center gap-1.5 px-3.5 h-10 mx-0.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all duration-200",
                      active
                        ? "bg-white/20 text-white shadow-sm ring-1 ring-white/25"
                        : "text-white/80 hover:bg-white/12 hover:text-white",
                      highlight && !active && "font-semibold text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0 transition-colors",
                        active ? "text-amber-200" : highlight ? "text-amber-300" : "text-white/55 group-hover:text-white/85"
                      )}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,.08)]">
          <div className="bg-gradient-to-r from-[#0a4d6e] via-[#155e8a] to-[#4c1d95] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Navigate</p>
            <p className="text-sm font-semibold text-white">ScholarPASS</p>
          </div>
          <div className="px-4 py-4 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ScholarPASS…"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--sp-orange)] focus:outline-none focus:ring-4 focus:ring-[var(--sp-orange)]/12"
              />
            </div>
            {BOTTOM_NAV.map(({ label, href, icon: Icon, highlight }) => {
              const active = isNavActive(pathname, href);
              const shouldPrefetch = shouldPrefetchRoute(href);
              return (
                <Link
                  key={label}
                  href={href}
                  prefetch={shouldPrefetch}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => prefetchRoute(router, href)}
                  onTouchStart={() => prefetchRoute(router, href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-medium transition-colors",
                    active
                      ? "bg-gradient-to-r from-cyan-50 to-violet-50 text-[var(--sp-blue-deep)] ring-1 ring-cyan-200/80"
                      : highlight
                        ? "bg-slate-50 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", highlight && !active && "text-[var(--sp-blue)]")} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-200 flex gap-2">
              <Link
                href="/scholarpass-plus"
                className="flex-1 flex items-center justify-center h-11 rounded-2xl text-[13px] font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-[0.98]"
                style={{ background: "var(--sp-orange)" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Plus Access
              </Link>
              <Link
                href="/login"
                className="flex-1 flex items-center justify-center h-11 rounded-2xl text-[13px] font-semibold border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
