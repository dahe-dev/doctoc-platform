'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/presentation/components/ui/sidebar';
import { Separator } from '@/presentation/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/presentation/components/ui/breadcrumb';
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle';
import { Button } from '@/presentation/components/ui/button';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/config/constants';
import { Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  [ROUTES.auth.dashboard]: 'Dashboard',
  [ROUTES.auth.appointments]: 'Citas',
  [ROUTES.auth.profile]: 'Perfil',
  [ROUTES.public.doctors]: 'Doctores',
};

export function AppHeader() {
  const pathname = usePathname();
  const currentRouteName = routeNames[pathname] || 'Página';

  return (
    <header className="border-border bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={ROUTES.auth.dashboard}>
              Plataforma
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentRouteName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Link href={ROUTES.public.home}>
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Inicio
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
