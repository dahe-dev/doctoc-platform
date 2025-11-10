'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/presentation/components/ui/field';
import { ROUTES } from '@/config/constants';
import { AlertCircle, Calendar, GalleryVerticalEnd } from 'lucide-react';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { cn } from '@/presentation/utils/cn';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const isBookingFlow =
    redirectUrl?.includes('appointments') || redirectUrl === 'booking';
  const { login, loading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl);
        window.location.href = decodedUrl;
      } else {
        window.location.href = ROUTES.auth.dashboard;
      }
    }
  }, [user, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!formData.email || !formData.password) {
      setValidationError('Por favor completa todos los campos');
      return;
    }

    try {
      await login(formData.email, formData.password, false);
    } catch (err: unknown) {
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationError) setValidationError('');
    if (error) clearError();
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className={cn('flex w-full max-w-md flex-col gap-6')}>
        {isBookingFlow && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-primary h-5 w-5 shrink-0" />
                <p className="text-sm">
                  Después de iniciar sesión, podrás confirmar tu cita con el
                  doctor seleccionado
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Link
                    href={ROUTES.public.home}
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <GalleryVerticalEnd className="size-6" />
                    </div>
                    <span className="sr-only">Doctoc</span>
                  </Link>
                  <h1 className="text-xl font-bold">
                    {isBookingFlow
                      ? 'Inicia Sesión para Continuar'
                      : 'Bienvenido de Nuevo'}
                  </h1>
                  <FieldDescription>
                    ¿No tienes cuenta?{' '}
                    <Link
                      href={
                        redirectUrl
                          ? `${ROUTES.public.register}?redirect=${encodeURIComponent(redirectUrl)}`
                          : ROUTES.public.register
                      }
                    >
                      Regístrate gratis
                    </Link>
                  </FieldDescription>
                </div>

                {(error || validationError) && (
                  <div className="bg-destructive/10 border-destructive/20 flex items-start gap-3 rounded-lg border p-4">
                    <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
                    <p className="text-destructive text-sm">
                      {validationError || error}
                    </p>
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Field>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="text-primary border-input focus:ring-ring h-4 w-4 rounded"
                    />
                    <span>Recordarme</span>
                  </label>
                  <Link
                    href="#"
                    className="text-primary font-medium hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="text-center">
          <Link
            href={ROUTES.public.home}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Volver al Inicio
          </Link>
        </FieldDescription>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground mt-4">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
