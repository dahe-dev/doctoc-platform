'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Calendar, ArrowRight, Home, Mail } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { ROUTES } from '@/config/constants';
import Link from 'next/link';
import { Section } from '@/presentation/components/ui/section';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/infrastructure/auth/AuthContext';

export default function AppointmentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;
  const queryClient = useQueryClient();
  const { user, patientId } = useAuth();

  const effectivePatientId =
    patientId ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('patient_id')
      : null) ||
    user?.uid ||
    '';

  useEffect(() => {
    if (effectivePatientId) {
      queryClient.invalidateQueries({
        queryKey: ['appointments', effectivePatientId],
      });
    }
  }, [effectivePatientId, queryClient]);

  return (
    <Section className="flex items-center justify-center" size="xs">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary size-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                  ¡Cita agendada exitosamente!
                </h1>
                <p className="text-muted-foreground text-sm">
                  Tu cita ha sido confirmada
                </p>
              </div>

              <Card className="bg-muted/50 w-full border-0">
                <CardContent className="pt-4 pb-4">
                  <div className="text-muted-foreground mb-2 flex items-center justify-center gap-2 text-xs">
                    <Calendar className="size-3.5" />
                    <span>Código de cita</span>
                  </div>
                  <p className="font-mono text-xl font-semibold">
                    #{appointmentId.slice(0, 8).toUpperCase()}
                  </p>
                </CardContent>
              </Card>

              <div className="w-full space-y-3">
                <div className="flex items-start gap-3 text-left text-sm">
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Mail className="text-primary size-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium">Confirmación enviada</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Revisa tu correo electrónico con los detalles de tu cita
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-left text-sm">
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Calendar className="text-primary size-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium">Recordatorio</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Te enviaremos un recordatorio 24 horas antes de tu cita
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => router.push(ROUTES.public.home)}
                  className="flex-1"
                >
                  <Home className="mr-2 size-4" />
                  Ir al Inicio
                </Button>
                <Link href={ROUTES.auth.appointments} className="flex-1">
                  <Button className="w-full">
                    Ver mis Citas
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
