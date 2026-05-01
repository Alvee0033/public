"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search, User, Menu, X,
  ChevronDown, Globe, Home,
  Building2, BookOpen, Wand2,
  Sparkles, Zap, MessageCircle,
  Wallet,
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
  { label: "Home",            href: "/",                       icon: Home },
  { label: "Learning Hub",    href: "/learninghubs",           icon: Sparkles },
  { label: "Institutes",      href: "/institutes",             icon: Building2 },
  { label: "Courses",         href: "/courses",                icon: BookOpen },
  { label: "Get Matched",     href: "/matching-profile",       icon: Wand2 },
  { label: "Become Partner",  href: "/register?role=partner",  icon: Zap },
];

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { openWidget } = useSPConnect();

  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,            setUser]            = useState(null);
  const [searchQuery,     setSearchQuery]     = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const accountHref = isAuthenticated ? getDashboardRoute(user) : "/login";

  return (
    <header
      className={cn(
        "sticky top-0 z-[1100] w-full transition-shadow duration-200",
        scrolled ? "shadow-[0_1px_0_rgba(15,27,45,.06),0_8px_24px_-12px_rgba(15,27,45,.10)]" : ""
      )}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "bg-white border-b transition-colors duration-200",
          scrolled ? "border-[var(--sp-border)]" : "border-[var(--sp-gray-100)]"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3 lg:gap-5">

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 outline-none rounded-md focus-visible:ring-2 focus-visible:ring-[var(--sp-blue)]"
              aria-label="ScholarPASS Home"
            >
              <Image
                src={navbarlogo}
                alt="ScholarPASS"
                width={140}
                height={36}
                priority
                style={{ width: "140px", height: "auto" }}
              />
            </Link>

            {/* Search */}
            <form
              role="search"
              className="flex-1 relative min-w-0 max-w-[640px] mx-auto hidden sm:flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
              }}
            >
              <Search
                className="absolute left-4 w-4 h-4 text-[var(--sp-light)] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, tutors, learning hubs..."
                aria-label="Search ScholarPASS"
                className="w-full h-11 pl-11 pr-28 rounded-[10px] border border-[var(--sp-border)] bg-[var(--sp-gray-50)] text-[14px] text-[var(--sp-ink)] placeholder:text-[var(--sp-light)] transition-all focus:border-[var(--sp-blue)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--sp-blue)]/12"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-8 px-4 rounded-[8px] text-[12.5px] font-semibold text-white bg-[var(--sp-orange)] hover:bg-[var(--sp-orange-deep)] transition-colors"
              >
                Search
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto flex-shrink-0">
              {/* Language */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1.5 px-3 h-9 rounded-[8px] text-[12.5px] font-medium text-[var(--sp-ink-soft)] transition hover:bg-[var(--sp-gray-50)]"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--sp-light)]" aria-hidden="true" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3 opacity-50" aria-hidden="true" />
              </button>

              {/* SP Connect */}
              <button
                type="button"
                onClick={openWidget}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 h-9 rounded-[8px] text-[12.5px] font-semibold text-[var(--sp-blue)] border border-[var(--sp-blue)]/30 bg-[var(--sp-blue-light)] transition hover:bg-[var(--sp-blue)] hover:text-white"
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
                className="hidden md:flex items-center gap-2 pl-2 pr-3 h-9 rounded-[8px] transition hover:bg-[var(--sp-gray-50)]"
                aria-label={isAuthenticated ? "Go to account" : "Sign in"}
              >
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[var(--sp-blue-light)] text-[var(--sp-navy)]">
                  <User className="w-3.5 h-3.5" strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span className="flex flex-col leading-none text-left">
                  <span className="text-[10px] font-medium text-[var(--sp-light)] tracking-wide">
                    {isAuthenticated ? `Hi, ${user?.first_name ?? "there"}` : "Sign in"}
                  </span>
                  <span className="text-[12.5px] font-bold text-[var(--sp-ink)] mt-px">
                    {isAuthenticated ? "Dashboard" : "Account"}
                  </span>
                </span>
              </Link>

              {/* SP Wallet */}
              <Link
                href="/wallet"
                className="hidden lg:flex items-center gap-2 pl-2 pr-3 h-9 rounded-[8px] border border-[var(--sp-border)] bg-white transition hover:bg-[var(--sp-gray-50)]"
                aria-label="SP Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-[var(--sp-orange)]" aria-hidden="true" />
                <span className="flex flex-col leading-none text-left">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[var(--sp-light)]">SP Wallet</span>
                  <span className="text-[12.5px] font-bold text-[var(--sp-navy)] mt-px">650 Credits</span>
                </span>
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                className="md:hidden p-2.5 rounded-[8px] text-[var(--sp-ink-soft)] transition hover:bg-[var(--sp-gray-100)]"
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
        className="hidden lg:block w-full bg-[var(--sp-navy)]"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-0.5 h-11" role="list">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isNavActive(pathname, href);
              return (
                <li key={label} role="listitem">
                  <Link
                    href={href}
                    prefetch={shouldPrefetchRoute(href)}
                    onMouseEnter={() => prefetchRoute(router, href)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 h-11 text-[13px] font-medium whitespace-nowrap relative transition-colors",
                      active
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        active ? "text-[#FFB23F]" : "text-white/45"
                      )}
                      aria-hidden="true"
                    />
                    {label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-3.5 right-3.5 -bottom-px h-[2px] bg-[#FFB23F] rounded-t"
                      />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Right side CTA */}
            <li className="ml-auto" role="listitem">
              <Link
                href="/scholarpass-plus"
                className="flex items-center gap-1.5 px-4 h-7 rounded-md text-[11.5px] font-bold text-[var(--sp-navy)] bg-[#FFB23F] hover:bg-[#FFA522] transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
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
          className="lg:hidden fixed inset-0 top-16 z-[1099] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-white w-full max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
            <div className="px-4 py-3 border-b border-[var(--sp-border)] bg-[var(--sp-navy)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                Navigation
              </p>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <form
                role="search"
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
                    setMobileOpen(false);
                  }
                }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sp-light)]" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ScholarPASS..."
                  aria-label="Search"
                  className="w-full pl-10 pr-4 h-11 bg-[var(--sp-gray-50)] border border-[var(--sp-border)] rounded-[10px] text-sm text-[var(--sp-ink)] placeholder:text-[var(--sp-light)] focus:border-[var(--sp-blue)] focus:outline-none focus:ring-4 focus:ring-[var(--sp-blue)]/12"
                />
              </form>
            </div>

            {/* Nav links */}
            <nav className="px-4 pb-3" aria-label="Mobile links">
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
                      "flex items-center gap-3 px-3 h-12 rounded-[10px] text-[14.5px] font-medium transition-colors",
                      active
                        ? "bg-[var(--sp-blue-light)] text-[var(--sp-navy)]"
                        : "text-[var(--sp-ink-soft)] hover:bg-[var(--sp-gray-50)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        active ? "text-[var(--sp-blue)]" : "text-[var(--sp-light)]"
                      )}
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pt-2 pb-4 border-t border-[var(--sp-border)] flex gap-2">
              <Link
                href="/scholarpass-plus"
                onClick={() => setMobileOpen(false)}
                className="btn-orange flex-1"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Plus Access
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-outline flex-1"
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
