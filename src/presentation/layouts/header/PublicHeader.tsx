'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Calendar,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Container } from '@/presentation/components/ui/container';
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle';
import { ROUTES } from '@/config/constants';
import { cn } from '@/presentation/utils/cn';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, displayName, logout } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navigation = [
    { name: 'Inicio', href: isHomePage ? '#inicio' : '/#inicio' },
    { name: 'Médicos', href: isHomePage ? '#medicos' : '/#medicos' },
    { name: 'Ventajas', href: isHomePage ? '#ventajas' : '/#ventajas' },
    { name: 'Contacto', href: isHomePage ? '#contacto' : '/#contacto' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('#') && isHomePage) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b shadow-sm backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <Calendar className="text-primary h-8 w-8 transition-transform group-hover:scale-110" />
              <div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            </div>
            <span className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold">
              MedPortal
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <div className="flex gap-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-muted-foreground hover:text-foreground group relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="bg-primary/10 absolute inset-0 origin-center scale-0 rounded-lg transition-transform group-hover:scale-100" />
                </a>
              ))}
            </div>

            <div className="ml-2 flex items-center gap-2 border-l pl-2">
              <ThemeToggle />
              {user ? (
                <>
                  <Link href={ROUTES.auth.dashboard}>
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.photoURL || undefined}
                            alt={displayName || 'Usuario'}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {displayName?.charAt(0)?.toUpperCase() ||
                              user.email?.charAt(0)?.toUpperCase() ||
                              'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden text-sm font-medium lg:block">
                          {displayName || user.email?.split('@')[0]}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.auth.appointments}
                          className="cursor-pointer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Mis Citas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={ROUTES.auth.profile}
                          className="cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Configuración
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-destructive cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href={ROUTES.public.login}>
                    <Button variant="outline" size="sm">
                      Ingresar
                    </Button>
                  </Link>
                  <Link href={ROUTES.public.register}>
                    <Button size="sm" className="shadow-sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="hover:bg-muted rounded-lg p-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="space-y-1 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:bg-primary/10 hover:text-primary block rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:translate-x-1"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-2 space-y-2 border-t px-4 pt-4">
              {user ? (
                <>
                  <div className="bg-muted mb-3 flex items-center gap-3 rounded-lg px-4 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.photoURL || undefined}
                        alt={displayName || 'Usuario'}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {displayName?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {displayName || 'Usuario'}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={ROUTES.auth.dashboard}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    href={ROUTES.auth.appointments}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Mis Citas
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive w-full justify-start"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.public.login}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Ingresar
                    </Button>
                  </Link>
                  <Link
                    href={ROUTES.public.register}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full shadow-sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
