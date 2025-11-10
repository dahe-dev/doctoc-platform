'use client';

import * as React from 'react';
import {
  Calendar,
  Heart,
  Home,
  FileText,
  Stethoscope,
  Activity,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { ROUTES } from '@/config/constants';

import { NavMain } from '@/presentation/layouts/sidebar/nav-main';
import { NavUser } from '@/presentation/layouts/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/presentation/components/ui/sidebar';
import { cleanDisplayName } from '@/presentation/utils';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = {
    name: cleanDisplayName(user?.displayName),
    email: user?.email || '',
    avatar: user?.photoURL || '',
  };

  const navMain = [
    {
      title: 'Dashboard',
      url: ROUTES.auth.dashboard,
      icon: Home,
    },
    {
      title: 'Citas',
      url: ROUTES.auth.appointments,
      icon: Calendar,
    },
    {
      title: 'Doctores',
      url: ROUTES.public.doctors,
      icon: Stethoscope,
    },
    {
      title: 'Perfil',
      url: ROUTES.auth.profile,
      icon: UserCircle,
    },
  ];

  const navSecondary = [
    {
      title: 'Historial Médico',
      url: '#',
      icon: FileText,
    },
    {
      title: 'Registros de Salud',
      url: '#',
      icon: Heart,
    },
    {
      title: 'Actividad',
      url: '#',
      icon: Activity,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={ROUTES.auth.dashboard}>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Heart className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Doctoc</span>
                  <span className="truncate text-xs">Medical Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavMain items={navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
