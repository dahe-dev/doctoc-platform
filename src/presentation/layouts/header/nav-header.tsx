"use client"

import { Bell } from "lucide-react"
import { SidebarTrigger } from "@/presentation/components/ui/sidebar"
import { Separator } from "@/presentation/components/ui/separator"
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle"
import { NavBreadcrumb } from "@/presentation/layouts/header/nav-breadcrumb"
import { Button } from "@/presentation/components/ui/button"

export function NavHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <NavBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
