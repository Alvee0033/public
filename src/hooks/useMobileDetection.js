"use client";

import { useEffect, useState } from "react";

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const ua = (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase();
    const isPhoneUa = /android.+mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);

    const update = () => {
      setIsMobile(query.matches && isPhoneUa);
    };

    update();
    query.addEventListener?.("change", update);

    return () => query.removeEventListener?.("change", update);
  }, []);

  return isMobile;
};
