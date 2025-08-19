'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';
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

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<userType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUser = localStorage.getItem('user');
        if (storedAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = (loggedUser: userType) => {
        setUser(loggedUser);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(loggedUser));
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        }
        router.push('/login');
    };

    const signup = () => router.push('/login');

    if (loading) return <Loading/>;

    return (
        <UserContext.Provider value={{ isAuthenticated, user, setUser, login, logout, signup }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): IUserContext  => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
