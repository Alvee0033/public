"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";
import navbarlogo from "@/assets/icons/navbarlogo.png";
import { LogOut } from "lucide-react";

export default function HubRegisterLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <SWRConfig value={swrConfig}>
      <div className="flex flex-col min-h-screen bg-gray-50 fixed inset-0 overflow-auto z-[9999]">
        {/* Minimal header — logo only + logout */}
        <header className="sticky top-0 z-[10000] bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src={navbarlogo}
                alt="ScholarPASS"
                width={140}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </SWRConfig>
  );
}
