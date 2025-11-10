'use client';

import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Calendar, ArrowRight, Home, Mail } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { ROUTES } from '@/config/constants';
import Link from 'next/link';
import { Section } from '@/presentation/components/ui/section';

export default function AppointmentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  return (
    <Section className="flex items-center justify-center" size="xs">
      <div className="w-full max-w-lg">
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                  ¡Cita agendada exitosamente!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tu cita ha sido confirmada
                </p>
              </div>

              <Card className="w-full bg-muted/50 border-0">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="size-3.5" />
                    <span>Código de cita</span>
                  </div>
                  <p className="text-xl font-mono font-semibold">
                    #{appointmentId.slice(0, 8).toUpperCase()}
                  </p>
                </CardContent>
              </Card>

              <div className="w-full space-y-3">
                <div className="flex items-start gap-3 text-sm text-left">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium">Confirmación enviada</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Revisa tu correo electrónico con los detalles de tu cita
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-left">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium">Recordatorio</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Te enviaremos un recordatorio 24 horas antes de tu cita
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
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
