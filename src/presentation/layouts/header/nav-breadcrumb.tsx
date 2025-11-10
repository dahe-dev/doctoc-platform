"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ROUTES } from "@/config/constants"

const routeLabels: Record<string, string> = {
  [ROUTES.auth.dashboard]: "Dashboard",
  [ROUTES.auth.appointments]: "Appointments",
  [ROUTES.auth.profile]: "Profile",
  [ROUTES.public.doctors]: "Doctors",
}

export function NavBreadcrumb() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean)
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`
    const label = routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1)
    return { path, label }
  })

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
