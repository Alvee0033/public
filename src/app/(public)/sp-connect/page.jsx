"use client";

import { useEffect } from "react";
import { useSPConnect } from "@/components/sp-connect-context";
import { useRouter } from "next/navigation";

export default function SPConnectPage() {
  const { openWidget } = useSPConnect();
  const router = useRouter();

  useEffect(() => {
    openWidget();
    router.replace("/");
  }, [openWidget, router]);

  return null;
}
