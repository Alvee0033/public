"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionFlow from './_components/SubscriptionFlow';

const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const localToken = localStorage.getItem('auth-token');
  if (localToken) {
    return localToken;
  }

  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookiePart of cookies) {
    const cookie = cookiePart.trim();
    if (cookie.startsWith('token=')) {
      return cookie.slice('token='.length);
    }
    if (cookie.startsWith('auth-token=')) {
      return cookie.slice('auth-token='.length);
    }
  }

  return null;
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace('/login?redirect=/subscription');
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Checking your account...</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to sign in if needed.</p>
        </div>
      </div>
    );
  }

  return <SubscriptionFlow />;
}