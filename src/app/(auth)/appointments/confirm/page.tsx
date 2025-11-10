'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Section } from '@/presentation/components/ui/section';
import { Container } from '@/presentation/components/ui/container';
import { Heading } from '@/presentation/components/ui/heading';
import { Text } from '@/presentation/components/ui/text';
import { Badge } from '@/presentation/components/ui/badge';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { useBookingFlow, type BookingState } from '@/presentation/hooks/useBookingFlow';
import { useCreateAppointment } from '@/presentation/hooks/queries';
import { DOCTOC_CONFIG, ROUTES } from '@/config/constants';
import { Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfirmAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { getBookingState, clearBookingState } = useBookingFlow();
  const createAppointmentMutation = useCreateAppointment();
  
  const [booking, setBooking] = useState<BookingState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(ROUTES.public.login + '?redirect=booking');
      return;
    }

    const state = getBookingState();
    if (!state) {
      router.push(ROUTES.public.doctors);
      return;
    }

    setBooking(state);
    setLoading(false);
  }, [user, router, getBookingState]);

  const handleConfirm = async () => {
    if (!booking || !user) return;

    try {
      const [day, month, year] = booking.selectedDate.split('-');
      const scheduledStart = new Date(`${year}-${month}-${day}T${booking.selectedSlot.start}:00.000Z`);
      const scheduledEnd = new Date(`${year}-${month}-${day}T${booking.selectedSlot.end}:00.000Z`);

      await createAppointmentMutation.mutateAsync({
        version: 'v2',
        orgID: DOCTOC_CONFIG.orgID,
        dayKey: booking.selectedDate,
        scheduledStart: scheduledStart.toISOString(),
        scheduledEnd: scheduledEnd.toISOString(),
        patient: user.uid,
        userId: booking.doctorId,
        type: 'Consulta',
        typeId: booking.typeId,
        motive: booking.motive,
        status: 'pendiente',
        locationId: booking.locationId,
        category: 'cita',
        recipeID: '',
        personaEjecutante: user.displayName || user.email || 'Paciente',
      });

      toast.success('¡Cita agendada exitosamente!', {
        description: `Tu cita con ${booking.doctorName} ha sido confirmada`,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      clearBookingState();
      router.push(ROUTES.auth.appointments);
    } catch (error: unknown) {
      console.error('Error al crear cita:', error);
      toast.error('Error al agendar la cita', {
        description: error instanceof Error ? error.message : 'Por favor intenta de nuevo',
      });
    }
  };

  const handleCancel = () => {
    clearBookingState();
    router.push(ROUTES.public.doctors);
  };

  if (loading || !booking) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </Section>
    );
  }

  const isSubmitting = createAppointmentMutation.isPending;

  return (
    <Section>
      <Container size="sm" >
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <Heading as="h1" size="xl" className="mb-2">
              Confirmar Cita Médica
            </Heading>
            <Text variant="muted">
              Revisa los detalles de tu cita antes de confirmar
            </Text>
          </div>

          <Card className="p-6 space-y-6">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking.doctorName}</h3>
                {booking.specialty && (
                  <Badge variant="secondary" className="mt-1">
                    {booking.specialty}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Text size="sm" variant="muted">
                    Fecha
                  </Text>
                  <p className="font-medium">{booking.selectedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Text size="sm" variant="muted">
                    Hora
                  </Text>
                  <p className="font-medium">
                    {booking.selectedSlot.start} - {booking.selectedSlot.end}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <Text size="sm" variant="muted">
                    Motivo de Consulta
                  </Text>
                  <p className="font-medium">{booking.motive}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t bg-muted/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Recibirás una confirmación por correo electrónico
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Cita'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
