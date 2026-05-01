"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const HubDirectoryGeoContext = createContext(null);

export function HubDirectoryGeoProvider({ children }) {
  const [userPos, setUserPos] = useState(null);
  const [geoStatus, setGeoStatus] = useState("");

  const requestGeo = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("Geolocation not supported.");
      return;
    }
    setGeoStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("");
      },
      () => {
        setGeoStatus("Location denied — search by place name.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }, []);

  const clearGeo = useCallback(() => {
    setUserPos(null);
    setGeoStatus("");
  }, []);

  const value = useMemo(
    () => ({ userPos, geoStatus, requestGeo, clearGeo }),
    [userPos, geoStatus, requestGeo, clearGeo],
  );

  return <HubDirectoryGeoContext.Provider value={value}>{children}</HubDirectoryGeoContext.Provider>;
}

export function useHubDirectoryGeo() {
  const ctx = useContext(HubDirectoryGeoContext);
  if (!ctx) {
    return {
      userPos: null,
      geoStatus: "",
      requestGeo: () => {},
      clearGeo: () => {},
    };
  }
  return ctx;
}
