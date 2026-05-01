"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthenticationCheck({ onAuthenticated, onCancel }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [authDetails, setAuthDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setChecking(true);
        
        const response = await fetch("/api/auth/check-auth");
        const data = await response.json();
        
        setAuthDetails(data);
        
        if (data.authenticated) {
          setAuthenticated(true);
          if (onAuthenticated) {
            onAuthenticated(data);
          }
        } else {
          setAuthenticated(false);
          setError(data.message || "You need to be logged in to proceed with payment");
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuthenticated(false);
        setError("Failed to check authentication status");
      } finally {
        setChecking(false);
      }
    };
    
    checkAuthentication();
  }, [onAuthenticated]);

  const handleLogin = () => {
    // Save the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    }
    router.push("/login");
  };

  if (checking) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Checking Authentication</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-center">Verifying your login status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!authenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>You need to be logged in to proceed with payment and enrollment.</p>
            
            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                {error}
              </div>
            )}
            
            {authDetails && (
              <div className="text-sm text-gray-500 mt-4">
                <p>Authentication details:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Status: {authDetails.authenticated ? "Authenticated" : "Not authenticated"}</li>
                  <li>Message: {authDetails.message}</li>
                  {authDetails.cookies && (
                    <li>Available cookies: {authDetails.cookies.join(", ") || "None"}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>
            Log In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // If authenticated, this component doesn't render anything
  return null;
}
