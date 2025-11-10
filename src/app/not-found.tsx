'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { ROUTES } from '@/config/constants';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="bg-primary/10 flex h-32 w-32 items-center justify-center rounded-full">
              <FileQuestion className="text-primary h-16 w-16" />
            </div>
            <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full opacity-75"></div>
          </div>
        </div>

        <h1 className="text-foreground mb-2 text-6xl font-bold">404</h1>
        <h2 className="text-foreground mb-4 text-2xl font-semibold">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={ROUTES.public.home}>
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
