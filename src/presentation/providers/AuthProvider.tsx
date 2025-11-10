'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useRouter,
  //  usePathname 
} from 'next/navigation';
import { onAuthChange, signIn, signUp, signOut, getIdToken } from '@/infrastructure/auth/firebase';
import { ROUTES } from '@/config/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await getIdToken();
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
      router.push(ROUTES.auth.dashboard);
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      setLoading(true);
      await signUp(email, password, name);
      router.push(ROUTES.auth.dashboard);
    } catch (error: unknown) {
      console.error('Register error:', error);
      setError(error instanceof Error ? error.message : 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut();
      router.push(ROUTES.public.home);
    } catch (error: unknown) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}