"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { SPConnectProvider } from "@/components/sp-connect-context";

export function Providers({ children }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (!navigator.onLine) setIsOffline(true);

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleClose = () => {
    setIsOffline(false);
  };

  return (
    <Provider store={store}>
      <SPConnectProvider>
        {children}
        <Dialog open={isOffline} onOpenChange={setIsOffline}>
          <DialogContent>
            <DialogTitle className="sr-only">Offline</DialogTitle>
            <h2 className="text-lg font-semibold">You are offline</h2>
            <p className="text-sm text-muted-foreground">
              Please check your internet connection and try again.
            </p>
            <DialogFooter>
              <Button onClick={handleReload}>
                <RefreshCcw /> Reload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SPConnectProvider>
    </Provider>
  );
}
