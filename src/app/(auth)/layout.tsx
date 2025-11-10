'use client';

import { useAuth } from '@/infrastructure/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/config/constants';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import {
  SidebarProvider,
  SidebarInset,
} from '@/presentation/components/ui/sidebar';
import { AppSidebar } from '@/presentation/layouts/sidebar/app-sidebar';
import { AppHeader } from '@/presentation/layouts/header/app-header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.public.login);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-6 p-4">{children}</div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
