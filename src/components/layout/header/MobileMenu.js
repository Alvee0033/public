"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import logo from "@/assets/icons/navbarlogo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { instance } from "@/lib/axios";
import {
  getDashboardCoursesRoute,
  getDashboardRoute,
  getDashboardSettingsRoute,
} from "@/lib/dashboard-route";
import { User, Settings, BookOpen, ShoppingCart, Store, GraduationCap, LogIn, UserPlus, Home } from "lucide-react";

export default function MobileMenu({
  isOpen,
  onClose,
  menuItems,
  authItems,
  token,
  programs = [],
}) {
  const router = useRouter();

  // --- Location select state for mobile ---
  const [selectedZone, setSelectedZone] = useState(null);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [cachedZones, setCachedZones] = useState([]);

  // Load options for AsyncSelect
  const loadZoneOptions = async (inputValue) => {
    try {
      let zones = cachedZones;
      if (zones.length === 0) {
        setZonesLoading(true);
        const res = await instance.get("/learning-hub", {
          params: { limit: 100, page: 1 },
          skipErrorLog: true,
        });
        const raw = res?.data?.data;
        const hubs = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
            ? raw.items
            : [];

        const unique = new Map();
        hubs.forEach((hub) => {
          const city = hub.city || hub.master_city?.name;
          const state = hub.state_code || hub.master_state?.name;
          const country = hub.country_code || hub.master_country?.name;
          const label = [city, state, country].filter(Boolean).join(", ") || hub.hub_name || "Learning Hub";
          const value = `hub-${hub.id || label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          if (!unique.has(value)) {
            unique.set(value, { value, label });
          }
        });

        zones = Array.from(unique.values());
        setCachedZones(zones);
        setZonesLoading(false);
      }
      return zones
        .filter((zone) =>
          zone.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((zone) => ({ value: zone.value, label: zone.label }));
    } catch {
      setZonesLoading(false);
      return [];
    }
  };

  // Restore selected zone from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zone");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedZone({ value: parsed.id, label: parsed.name });
        } catch {}
      }
    }
  }, []);

  // Handle zone selection
  const handleZoneChange = (zone) => {
    setSelectedZone(zone);
    if (zone) {
      localStorage.setItem(
        "zone",
        JSON.stringify({ name: zone.label, id: zone.value })
      );
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push("/login");
  };

  // Fetch user info for dashboard link (optional: you can use SWR or props)
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (token) {
      try {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
      } catch {}

      instance
        .get("/me", { skipErrorLog: true, suppressErrorStatuses: [401, 403] })
        .then((res) => {
          const nextUser = res?.data?.data;
          if (nextUser) setUser(nextUser);
        })
        .catch(() => {});
    }
  }, [token]);

  const dashUrl = getDashboardRoute(user || {});
  const myCoursesUrl = getDashboardCoursesRoute(user || {});
  const settingsUrl = getDashboardSettingsRoute(user || {});
  const roleText = String(
    user?.primary_role?.name ||
      user?.primaryRole?.name ||
      user?.role ||
      user?.app_user_roles?.[0]?.role?.name ||
      "",
  ).toLowerCase();

  const isSuperAdmin =
    user?.is_super_admin === true ||
    /\badmin\b|super/.test(roleText);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[80%] max-w-sm p-0 z-[10000]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Image
                src={logo}
                alt="TutorsPlan"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Location select for mobile */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 min-w-0">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadZoneOptions}
                  value={selectedZone}
                  onChange={handleZoneChange}
                  placeholder="Select location"
                  isClearable
                  isLoading={zonesLoading}
                  classNamePrefix="location-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      background: "transparent",
                      border: "none",
                      minHeight: "32px",
                      height: "32px",
                      boxShadow: "none",
                      cursor: "pointer",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0 6px",
                      minHeight: "32px",
                      height: "32px",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                      fontSize: "0.75rem",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "32px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    dropdownIndicator: (base, state) => ({
                      ...base,
                      color: "#6b7280",
                      padding: "0 4px",
                      transition: "all 0.2s ease",
                      transform: state.selectProps.menuIsOpen
                        ? "rotate(180deg)"
                        : null,
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      padding: "0 4px",
                      color: "#6b7280",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      marginTop: "8px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }),
                    menuList: (base) => ({
                      ...base,
                      padding: "4px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#6b7280",
                      fontSize: "0.75rem",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      lineHeight: "32px",
                      fontSize: "0.75rem",
                      color: "#111827",
                    }),
                    option: (base, state) => ({
                      ...base,
                      fontSize: "0.875rem",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "0.375rem",
                      backgroundColor: state.isSelected
                        ? "#3b82f6"
                        : state.isFocused
                        ? "#f3f4f6"
                        : "transparent",
                      color: state.isSelected ? "white" : "#111827",
                      transition: "all 0.15s ease",
                    }),
                    loadingMessage: (base) => ({
                      ...base,
                      minHeight: "32px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                    }),
                    noOptionsMessage: (base) => ({
                      ...base,
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      padding: "8px 12px",
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-4">
              {/* Programs section */}
              {programs && programs.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 text-sm font-medium text-indigo-600">Programs</div>
                  {programs.map((p) => (
                    <Link
                      key={p.slug}
                      href={p.slug}
                      onClick={onClose}
                      className="block py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
              {/* Authenticated user menu */}
              {token && (
                <>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link
                    href={dashUrl}
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <User className="h-5 w-5" />
                    Dashboard
                  </Link>
                  {!isSuperAdmin && (
                    <Link
                      href={myCoursesUrl}
                      onClick={onClose}
                      className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                    >
                      <BookOpen className="h-5 w-5" />
                      My Courses
                    </Link>
                  )}
                  <Link
                    href={settingsUrl}
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <Link
                    href="/store"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <Store className="h-5 w-5" />
                    Store
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </Link>
                </>
              )}

              {/* Unauthenticated user menu */}
              {!token && (
                <>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link
                    href="/store"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <Store className="h-5 w-5" />
                    Store
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </Link>
                  <div className="my-6 border-t border-gray-200"></div>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex items-center gap-2 py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-base font-medium"
                  >
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Footer for logged in users */}
          {token && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
