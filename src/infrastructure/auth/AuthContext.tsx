'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { onAuthChange, signIn, signUp, signOut, getIdToken, getPatientIdFromAuth, getCleanDisplayName } from './firebase';
import { ROUTES } from '@/config/constants';

interface AuthContextType {
  user: User | null;
  patientId: string | null;
  displayName: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, shouldRedirect?: boolean) => Promise<void>;
  register: (email: string, password: string, userData: {
    names: string;
    surnames: string;
    dni: string;
    birth_date: string;
    gender: 'Masculino' | 'Femenino';
    phone: string;
  }) => Promise<{ uid: string }>;
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
  const [patientId, setPatientId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await getIdToken();
        const pId = getPatientIdFromAuth();
        const cleanName = getCleanDisplayName();
        setPatientId(pId);
        setDisplayName(cleanName);
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('patient_id');
          document.cookie = 'auth_token=; path=/; max-age=0';
        }
        setPatientId(null);
        setDisplayName(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, shouldRedirect: boolean = true) => {
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
      if (shouldRedirect) {
        router.push(ROUTES.auth.dashboard);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: {
    names: string;
    surnames: string;
    dni: string;
    birth_date: string;
    gender: 'Masculino' | 'Femenino';
    phone: string;
  }) => {
    try {
      setError(null);
      setLoading(true);
      const firebaseUser = await signUp(email, password, `${userData.names} ${userData.surnames}`);
      return { uid: firebaseUser.uid };
    } catch (error: unknown) {
      console.error('Register error:', error);
      
      let errorMsg = 'Failed to register';
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          errorMsg = 'Este correo electrónico ya está registrado';
        } else if (error.message.includes('weak-password')) {
          errorMsg = 'La contraseña es muy débil';
        } else if (error.message.includes('invalid-email')) {
          errorMsg = 'El correo electrónico no es válido';
        } else {
          errorMsg = error.message;
        }
      }
      
      setError(errorMsg);
      throw new Error(errorMsg);
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
    patientId,
    displayName,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}