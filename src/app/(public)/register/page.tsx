'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { createPatient } from '@/app/actions';
import { savePatientIdToAuth } from '@/infrastructure/auth/firebase';
import { DOCTOC_CONFIG, ROUTES } from '@/config/constants';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Container } from '@/presentation/components/ui/container';
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { register, error: authError, clearError } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    names: '',
    surnames: '',
    phone: '',
    birthDate: '',
    gender: 'Masculino' as 'Masculino' | 'Femenino',
    dni: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationError) setValidationError('');
    if (authError) clearError();
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError('Por favor completa todos los campos');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.names ||
      !formData.surnames ||
      !formData.phone ||
      !formData.birthDate ||
      !formData.dni
    ) {
      setValidationError('Por favor completa todos los campos');
      return false;
    }
    if (formData.dni.length < 8) {
      setValidationError('El DNI debe tener al menos 8 dígitos');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setValidationError('');
    }
  };

  const handleBackStep = () => {
    setStep(1);
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);
    setValidationError('');

    try {
      await register(formData.email, formData.password, {
        names: formData.names,
        surnames: formData.surnames,
        dni: formData.dni,
        birth_date: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
      });

      const patientResult = await createPatient({
        action: 'create',
        orgID: DOCTOC_CONFIG.orgID,
        names: formData.names,
        surnames: formData.surnames,
        dni: formData.dni,
        birth_date: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
        mail: formData.email,
      });

      if (patientResult.success && patientResult.data) {
        await savePatientIdToAuth(patientResult.data.id);

        if (typeof window !== 'undefined') {
          localStorage.setItem('patient_id', patientResult.data.id);
        }

        toast.success('¡Cuenta creada exitosamente!', {
          description: `Bienvenido ${formData.names} ${formData.surnames}`,
          duration: 2000,
        });

        setTimeout(() => {
          if (redirectUrl) {
            const decodedUrl = decodeURIComponent(redirectUrl);
            router.push(decodedUrl);
          } else {
            router.push(ROUTES.auth.dashboard);
          }
        }, 1500);
      } else {
        throw new Error(
          patientResult.error || 'Error al crear el perfil de paciente',
        );
      }
    } catch (err: unknown) {
      console.error('Error en registro:', err);

      let errorMessage = 'Error al registrar';
      if (err instanceof Error) {
        if (
          err.message.includes('email-already-in-use') ||
          err.message.includes('EMAIL_EXISTS')
        ) {
          errorMessage = 'Este correo electrónico ya está registrado';
        } else {
          errorMessage = err.message;
        }
      }

      setValidationError(errorMessage);
      toast.error('Error al crear cuenta', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = validationError || authError;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Container size="sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Crea tu Cuenta</h1>
          <p className="text-muted-foreground">
            Únete para agendar citas médicas en línea
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                1
              </div>
              <span className="text-muted-foreground ml-2 text-sm">Cuenta</span>
            </div>
            <div className="bg-border h-0.5 w-12"></div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span className="text-muted-foreground ml-2 text-sm">
                Información Personal
              </span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? 'Credenciales de Acceso' : 'Datos Personales'}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? 'Crea tu cuenta de acceso'
                : 'Completa tu información personal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={
                step === 2
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNextStep();
                    }
              }
            >
              {displayError && (
                <div className="bg-destructive/10 border-destructive/20 mb-6 flex items-start gap-3 rounded-lg border p-4">
                  <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-destructive text-sm">{displayError}</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="tu@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Mín. 6 caracteres"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Repetir contraseña"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="mt-6 w-full" size="lg">
                    Siguiente Paso
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="names">Nombres</Label>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="names"
                          name="names"
                          type="text"
                          required
                          value={formData.names}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Juan Carlos"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surnames">Apellidos</Label>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="surnames"
                          name="surnames"
                          type="text"
                          required
                          value={formData.surnames}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Pérez López"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <div className="relative">
                      <CreditCard className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="dni"
                        name="dni"
                        type="text"
                        required
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="12345678"
                        maxLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          gender: value as 'Masculino' | 'Femenino',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <div className="relative">
                      <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackStep}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              href={
                redirectUrl
                  ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
                  : '/login'
              }
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
