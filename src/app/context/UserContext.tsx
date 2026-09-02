'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../loading';
import { userType } from '@/lib/types';

interface IUserContext {
  isAuthenticated: boolean;
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  login: (loggedUser: userType) => void;
  logout: () => void;
  signup: () => void;
}

const APP_PREFIX = 'closet_studio_';
const AUTH_KEY = `${APP_PREFIX}isAuthenticated`;
const USER_KEY = `${APP_PREFIX}user`;

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const clearAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  // 1. Restore & Verify Session on Mount
  useEffect(() => {
    const verifyAndRestoreSession = async () => {
      if (typeof window === 'undefined') return;

      const storedAuth = localStorage.getItem(AUTH_KEY);
      const storedUserRaw = localStorage.getItem(USER_KEY);

      if (storedAuth === 'true' && storedUserRaw) {
        try {
          const parsedUser: userType = JSON.parse(storedUserRaw);

          if (parsedUser?._id) {
            // Optimistically set state from localStorage immediately
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Background verification with backend DB
            try {
              const response = await axios.get('/api/user', {
                params: { userId: parsedUser._id },
              });

              const dbUser = response.data?.user || response.data;
              if (dbUser && dbUser._id) {
                setUser(dbUser);
                localStorage.setItem(USER_KEY, JSON.stringify(dbUser));
              }
            } catch (apiErr: any) {
              console.warn('Backend user verification error:', apiErr);
              // Only wipe storage if backend explicitly confirms user no longer exists
              if (apiErr.response?.status === 401 || apiErr.response?.status === 404) {
                clearAuth();
              }
            }
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error('Session parsing error:', error);
          clearAuth();
        }
      } else {
        clearAuth();
      }

      setLoading(false);
    };

    verifyAndRestoreSession();
  }, []);

  // 2. Client-Side Route Protection
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = pathname === '/login' || pathname === '/signup';

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    } else if (isAuthenticated && isPublicRoute) {
      router.push('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = (loggedUser: userType) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const signup = () => router.push('/login');

  if (loading) return <Loading />;

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};