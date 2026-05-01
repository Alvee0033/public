"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken && pathname !== '/login') {
      router.push(params.get("redirect") || "/");
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, [checkingAuth, params, router, pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center py-4">
      {children}
    </div>
  );
}
