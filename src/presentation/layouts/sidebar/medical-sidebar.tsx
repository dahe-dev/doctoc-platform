"use client"

import * as React from "react"
import {
  Calendar,
  Users,
  Activity,
  FileText,
  Settings,
  Home,
  Stethoscope,
  Heart,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/infrastructure/auth/AuthContext"
import { ROUTES } from "@/config/constants"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/presentation/components/ui/sidebar"
import { NavUser } from "@/presentation/layouts/sidebar/nav-user"

export function MedicalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      url: ROUTES.auth.dashboard,
      icon: Home,
    },
    {
      title: "Appointments",
      url: ROUTES.auth.appointments,
      icon: Calendar,
    },
    {
      title: "Find Doctors",
      url: ROUTES.public.doctors,
      icon: Users,
    },
    {
      title: "Medical History",
      url: "#",
      icon: FileText,
    },
    {
      title: "Health Records",
      url: "#",
      icon: Heart,
    },
    {
      title: "Profile",
      url: ROUTES.auth.profile,
      icon: Activity,
    },
  ]

  const supportItems = [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Support",
      url: "#",
      icon: Clock,
    },
  ]

  const userData = {
    name: user?.displayName || "User",
    email: user?.email || "",
    avatar: user?.photoURL || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={ROUTES.auth.dashboard}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Stethoscope className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Doctoc</span>
                  <span className="truncate text-xs">Medical Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <SidebarMenu className="mt-auto">
          {supportItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
