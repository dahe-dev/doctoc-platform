'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/infrastructure/auth/AuthContext'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/presentation/components/ui/field'
import { ROUTES } from '@/config/constants'
import { AlertCircle, Calendar, GalleryVerticalEnd } from 'lucide-react'
import {
  Card,
  CardContent,
} from "@/presentation/components/ui/card"
import { cn } from '@/presentation/utils/cn'


function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const isBookingFlow = redirectUrl?.includes('appointments') || redirectUrl === 'booking'
  const { login, loading, error, clearError, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (user) {
      if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl)
        router.push(decodedUrl)
      } else {
        router.push(ROUTES.auth.dashboard)
      }
    }
  }, [user, redirectUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    clearError()

    if (!formData.email || !formData.password) {
      setValidationError('Por favor completa todos los campos')
      return
    }

    try {
      await login(formData.email, formData.password, false)
    } catch (err: unknown) {
      console.error('Login error:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (validationError) setValidationError('')
    if (error) clearError()
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 ">
      <div className={cn("flex flex-col gap-6 w-full max-w-md ")}>
        {isBookingFlow && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm">
                  Después de iniciar sesión, podrás confirmar tu cita con el doctor seleccionado
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
                {isBookingFlow ? 'Inicia Sesión para Continuar' : 'Bienvenido de Nuevo'}
              </h1>
              <FieldDescription>
                ¿No tienes cuenta?{' '}
                <Link href={redirectUrl ? `${ROUTES.public.register}?redirect=${encodeURIComponent(redirectUrl)}` : ROUTES.public.register}>
                  Regístrate gratis
                </Link>
              </FieldDescription>
            </div>

            {(error || validationError) && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">
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
                  className="w-4 h-4 text-primary border-input rounded focus:ring-ring"
                />
                <span>Recordarme</span>
              </label>
              <Link
                href="#"
                className="text-primary hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Field>
              <Button  type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
          </CardContent>
        </Card>

        <FieldDescription className="text-center">
          <Link href={ROUTES.public.home} className="text-muted-foreground hover:text-foreground">
            ← Volver al Inicio
          </Link>
        </FieldDescription>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Cargando...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}