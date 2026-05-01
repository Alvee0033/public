"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search, User, Menu, X,
  ChevronDown, Globe, Home,
  Building2, BookOpen, Wand2,
  Sparkles, Zap, MessageCircle,
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

const NAV_ITEMS = [
  { label: "Home",          href: "/",                    icon: Home },
  { label: "Learning Hub",  href: "/learninghubs",        icon: Sparkles,  highlight: true },
  { label: "Institutes",    href: "/institutes",          icon: Building2 },
  { label: "Courses",       href: "/courses",             icon: BookOpen,  highlight: true },
  { label: "Get Matched",   href: "/matching-profile",    icon: Wand2,     highlight: true },
  { label: "Become Partner",href: "/register?role=partner", icon: Zap },
];

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { openWidget } = useSPConnect();

  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [scrolled,         setScrolled]         = useState(false);
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  const [user,             setUser]             = useState(null);
  const [searchQuery,      setSearchQuery]      = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
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

  useEffect(() => {
    const t = setTimeout(() => {
      prefetchRoute(router, "/register?role=partner");
      prefetchRoute(router, "/login");
      if (user) prefetchRoute(router, getDashboardRoute(user));
    }, 800);
    return () => clearTimeout(t);
  }, [router, user]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const accountHref = isAuthenticated ? getDashboardRoute(user) : "/login";

  return (
    <header
      className={cn(
        "sticky top-0 z-[1100] w-full transition-all duration-200",
        scrolled ? "shadow-[0_1px_0_rgba(15,23,42,.08),0_4px_16px_rgba(15,23,42,.06)]" : ""
      )}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className={cn(
        "bg-white border-b transition-colors duration-200",
        scrolled ? "border-slate-200" : "border-slate-100"
      )}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-3 lg:gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 rounded focus-visible:ring-2 focus-visible:ring-[var(--sp-blue)] outline-none"
              aria-label="ScholarPASS Home"
            >
              <Image
                src={navbarlogo}
                alt="ScholarPASS"
                width={132}
                height={34}
                priority
                style={{ width: "132px", height: "auto" }}
              />
            </Link>

            {/* Search */}
            <form
              role="search"
              className="flex-1 relative min-w-0 max-w-xl mx-auto hidden sm:flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
              }}
            >
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none z-10" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, tutors, learning hubs..."
                aria-label="Search ScholarPASS"
                className="w-full h-10 pl-10 pr-24 rounded-lg border border-slate-200 bg-slate-50 text-[13.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:border-[var(--sp-blue)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sp-blue)]/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-7 px-3 rounded-md text-[12px] font-semibold text-white transition-colors hover:brightness-105"
                style={{ background: "var(--sp-orange)" }}
              >
                Search
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
              {/* Language — desktop only */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1 px-2.5 h-9 rounded-lg border border-slate-200 bg-white text-[12px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3 opacity-50" aria-hidden="true" />
              </button>

              {/* SP Connect */}
              <button
                type="button"
                onClick={openWidget}
                className="hidden md:flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-[12.5px] font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--sp-blue)" }}
                aria-label="Open SP Connect"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>SP Connect</span>
              </button>

              {/* Account */}
              <Link
                href={accountHref}
                prefetch={shouldPrefetchRoute(accountHref)}
                onMouseEnter={() => prefetchRoute(router, accountHref)}
                className="hidden md:flex flex-col items-end leading-none px-2 py-1.5 rounded-lg transition hover:bg-slate-50"
                aria-label={isAuthenticated ? "Go to account" : "Sign in"}
              >
                <span className="text-[11px] font-medium text-slate-500">
                  {isAuthenticated ? `Hello, ${user?.first_name ?? ""}` : "Hello, sign in"}
                </span>
                <span className="text-[13px] font-bold flex items-center gap-1 text-slate-900 mt-px">
                  <User className="w-3 h-3 text-[var(--sp-blue)]" aria-hidden="true" />
                  Account
                </span>
              </Link>

              {/* SP Wallet */}
              <Link
                href="/wallet"
                className="hidden lg:flex flex-col items-end leading-none px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 transition hover:bg-white hover:border-slate-300"
                aria-label="SP Wallet"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">SP Wallet</span>
                <span className="text-[13px] font-bold text-[var(--sp-navy)]">650 Credits</span>
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-slate-600 transition hover:bg-slate-100"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen
                  ? <X className="w-5 h-5" aria-hidden="true" />
                  : <Menu className="w-5 h-5" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop nav bar ──────────────────────────────────────── */}
      <nav
        className="hidden lg:block w-full"
        style={{ background: "var(--sp-navy)" }}
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-0.5 h-10" role="list">
            {NAV_ITEMS.map(({ label, href, icon: Icon, highlight }) => {
              const active = isNavActive(pathname, href);
              return (
                <li key={label} role="listitem">
                  <Link
                    href={href}
                    prefetch={shouldPrefetchRoute(href)}
                    onMouseEnter={() => prefetchRoute(router, href)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 h-10 rounded text-[12.5px] font-medium whitespace-nowrap transition-all duration-150",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn("w-3.5 h-3.5 flex-shrink-0", active ? "text-amber-300" : "text-white/50 group-hover:text-white/80")}
                      aria-hidden="true"
                    />
                    {label}
                    {highlight && !active && (
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Right side CTA */}
            <li className="ml-auto" role="listitem">
              <Link
                href="/scholarpass-plus"
                className="flex items-center gap-1.5 px-4 h-7 rounded-md text-[11.5px] font-bold text-[var(--sp-navy)] bg-amber-300 transition hover:bg-amber-200 whitespace-nowrap"
              >
                Plus Access
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-14 z-[1099] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-h-[calc(100vh-3.5rem)] overflow-y-auto shadow-2xl">
            {/* Nav header */}
            <div className="px-4 py-3 border-b border-slate-100" style={{ background: "var(--sp-navy)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Navigation</p>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search ScholarPASS..."
                  aria-label="Search"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--sp-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--sp-blue)]/20"
                />
              </div>
            </div>

            {/* Nav links */}
            <nav className="px-4 pb-2" aria-label="Mobile links">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = isNavActive(pathname, href);
                return (
                  <Link
                    key={label}
                    href={href}
                    prefetch={shouldPrefetchRoute(href)}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium transition-colors",
                      active
                        ? "bg-[var(--sp-blue-light)] text-[var(--sp-navy)]"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn("w-4 h-4 flex-shrink-0", active ? "text-[var(--sp-blue)]" : "text-slate-400")}
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom CTAs */}
            <div className="px-4 pt-2 pb-4 border-t border-slate-100 flex gap-2">
              <Link
                href="/scholarpass-plus"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center h-11 rounded-lg text-[13.5px] font-bold text-white transition hover:opacity-90"
                style={{ background: "var(--sp-orange)" }}
              >
                Get Plus Access
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center h-11 rounded-lg text-[13.5px] font-semibold border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50"
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
