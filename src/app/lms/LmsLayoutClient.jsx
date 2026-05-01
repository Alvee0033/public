'use client';

import Loader from '@/components/shared/Loader';
import { instance } from '@/lib/axios';
import { stableSWRConfig } from '@/lib/swr-config';
import { setToken, setUser } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SWRConfig } from 'swr';

export default function LmsLayoutClient({ children }) {
  const dispatch = useAppDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [token, setTokenState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('auth-token');
        const normalizedToken =
          authToken && authToken !== 'undefined' && authToken !== 'null'
            ? authToken
            : null;

        setTokenState(normalizedToken);
        dispatch(setToken(normalizedToken));

        if (!normalizedToken) {
          localStorage.removeItem('auth-token');
          setIsCheckingAuth(false);
          return;
        }

        try {
          const res = await instance.post('/auth/me');
          const userData = res.data.data;
          const existingUser = localStorage.getItem('user');
          let userToSet = userData;

          if (existingUser) {
            try {
              const parsedExistingUser = JSON.parse(existingUser);
              if (parsedExistingUser.roles && Array.isArray(parsedExistingUser.roles) &&
                parsedExistingUser.roles.length > 0 &&
                typeof parsedExistingUser.roles[0] === 'object' &&
                parsedExistingUser.roles[0].id) {
                userToSet = {
                  ...parsedExistingUser,
                  first_name: userData.first_name || parsedExistingUser.first_name,
                  last_name: userData.last_name || parsedExistingUser.last_name,
                  email: userData.email || parsedExistingUser.email,
                  student_id: parsedExistingUser.student_id || userData.student_id,
                  tutor_id: parsedExistingUser.tutor_id || userData.tutor_id,
                };
              }
            } catch {
              userToSet = userData;
            }
          }
          dispatch(setUser(userToSet));
          localStorage.setItem('user', JSON.stringify(userToSet));
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
            dispatch(setUser(null));
            dispatch(setToken(null));
            router.replace('/login?expired=true');
            return;
          }
          const localUser = localStorage.getItem('user');
          if (localUser) {
            try {
              dispatch(setUser(JSON.parse(localUser)));
            } catch {
              dispatch(setUser(null));
            }
          } else {
            dispatch(setUser(null));
          }
        } finally {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
  }, [dispatch, router]);

  useEffect(() => {
    if (!isCheckingAuth && !token) {
      router.replace('/');
    }
  }, [isCheckingAuth, token, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader></Loader>
          <p className="text-gray-600 mb-10">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return <SWRConfig value={stableSWRConfig}>{children}</SWRConfig>;
}
