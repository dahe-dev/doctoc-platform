'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/presentation/components/ui/card';
import { Container } from '@/presentation/components/ui/container';
import { Section } from '@/presentation/components/ui/section';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Label } from '@/presentation/components/ui/label';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Badge } from '@/presentation/components/ui/badge';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  useDoctorProfile,
  useDoctorAvailability,
} from '@/presentation/hooks/queries';
import {
  useAppointmentTypes,
  useLocations,
} from '@/presentation/hooks/queries/useOrganization';
import { DOCTOC_CONFIG, ROUTES } from '@/config/constants';
import { toast } from 'sonner';
import { createAppointment } from '@/app/actions';
import { useQueryClient } from '@tanstack/react-query';

type AppointmentData = {
  doctorId: string;
  dayKey: string;
  dateStr: string;
  startTime: string;
  endTime: string;
  typeId: string;
  locationId: string;
};

export default function ConfirmAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, patientId, displayName } = useAuth();
  const appointmentId = params.id as string;
  const queryClient = useQueryClient();

  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [motive, setMotive] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotAvailable, setSlotAvailable] = useState(false);

  const { data: doctorResponse } = useDoctorProfile(
    appointmentData?.doctorId || '',
    DOCTOC_CONFIG.orgID,
    !!appointmentData?.doctorId,
  );

  const { data: availabilityData } = useDoctorAvailability(
    {
      orgID: DOCTOC_CONFIG.orgID,
      dayKey: appointmentData?.dayKey || '',
      userId: appointmentData?.doctorId,
      format: 'busy_ranges',
    },
    !!appointmentData?.dayKey && !!appointmentData?.doctorId,
  );

  const { data: typesResponse } = useAppointmentTypes(DOCTOC_CONFIG.orgID);
  const { data: locationsResponse } = useLocations(DOCTOC_CONFIG.orgID);

  useEffect(() => {
    const stored = sessionStorage.getItem(`appointment_${appointmentId}`);
    if (!stored) {
      router.push(ROUTES.public.doctors);
      return;
    }

    const data: AppointmentData = JSON.parse(stored);
    setAppointmentData(data);
  }, [appointmentId, router]);

  useEffect(() => {
    if (!user) {
      const currentPath = `/appointments/confirm/${appointmentId}`;
      router.push(
        `${ROUTES.public.login}?redirect=${encodeURIComponent(currentPath)}`,
      );
    }
  }, [user, appointmentId, router]);

  useEffect(() => {
    if (!appointmentData || !availabilityData) return;

    setIsVerifying(true);

    const busyRanges = availabilityData.data?.busyRanges || [];
    const [startHour, startMin] = appointmentData.startTime
      .split(':')
      .map(Number);
    const [endHour, endMin] = appointmentData.endTime.split(':').map(Number);
    const slotStartMinutes = startHour * 60 + startMin;
    const slotEndMinutes = endHour * 60 + endMin;

    const isOccupied = busyRanges.some((busy) => {
      const busyStart = busy.start.includes('T')
        ? busy.start.split('T')[1].substring(0, 5)
        : busy.start.substring(0, 5);
      const busyEnd = busy.end.includes('T')
        ? busy.end.split('T')[1].substring(0, 5)
        : busy.end.substring(0, 5);

      const [busyStartH, busyStartM] = busyStart.split(':').map(Number);
      const [busyEndH, busyEndM] = busyEnd.split(':').map(Number);

      const busyStartMinutes = busyStartH * 60 + busyStartM;
      const busyEndMinutes = busyEndH * 60 + busyEndM;

      return (
        (slotStartMinutes >= busyStartMinutes &&
          slotStartMinutes < busyEndMinutes) ||
        (slotEndMinutes > busyStartMinutes &&
          slotEndMinutes <= busyEndMinutes) ||
        (slotStartMinutes <= busyStartMinutes &&
          slotEndMinutes >= busyEndMinutes)
      );
    });

    setSlotAvailable(!isOccupied);
    setIsVerifying(false);
  }, [appointmentData, availabilityData]);

  const handleConfirm = async () => {
    if (!appointmentData || !user || !motive.trim() || !acceptTerms) return;

    setIsSubmitting(true);

    try {
      const effectivePatientId =
        patientId ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('patient_id')
          : null) ||
        user.uid;

      const [day, month, year] = appointmentData.dayKey.split('-');
      const dateStr = `${year}-${month}-${day}`;
      const scheduledStart = new Date(
        `${dateStr}T${appointmentData.startTime}:00.000Z`,
      );
      const scheduledEnd = new Date(
        `${dateStr}T${appointmentData.endTime}:00.000Z`,
      );

      const appointmentType = typesResponse?.data?.find(
        (t) => t.id === appointmentData.typeId,
      );

      const result = await createAppointment({
        orgID: DOCTOC_CONFIG.orgID,
        dayKey: appointmentData.dayKey,
        scheduledStart: scheduledStart.toISOString(),
        scheduledEnd: scheduledEnd.toISOString(),
        patient: effectivePatientId,
        userId: appointmentData.doctorId,
        type: appointmentType?.name || 'Consulta',
        typeId: appointmentData.typeId,
        motive: motive.trim(),
        status: 'pendiente',
        version: 'v2',
        locationId: appointmentData.locationId,
        recipeID: '',
        category: 'cita',
        personaEjecutante: displayName || user.email || 'Paciente',
      });

      if (result.success && result.data) {
        sessionStorage.removeItem(`appointment_${appointmentId}`);

        queryClient.invalidateQueries({
          queryKey: ['appointments', effectivePatientId],
        });

        toast.success('¡Cita agendada exitosamente!', {
          description: `Tu cita con ${doctorResponse?.data?.firstName} ${doctorResponse?.data?.lastName} ha sido confirmada`,
        });

        router.push(`/appointments/success/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Error al crear la cita');
      }
    } catch (error) {
      toast.error('Error al agendar la cita', {
        description:
          error instanceof Error ? error.message : 'Por favor intenta de nuevo',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (appointmentData) {
      sessionStorage.removeItem(`appointment_${appointmentId}`);
    }
    router.push(`${ROUTES.public.doctors}/${appointmentData?.doctorId}`);
  };

  if (!user || !appointmentData || !doctorResponse?.data) {
    return (
      <Section className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </Section>
    );
  }

  if (isVerifying) {
    return (
      <Section className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md p-12 text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
          <h2 className="mb-2 text-xl font-bold">Verificando disponibilidad</h2>
          <p className="text-muted-foreground">
            Validando que el horario siga disponible...
          </p>
        </Card>
      </Section>
    );
  }

  if (!slotAvailable) {
    return (
      <Section className="flex min-h-screen items-center justify-center">
        <Container>
          <Card className="mx-auto max-w-md p-12 text-center">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Horario no disponible</h2>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, este horario ya no está disponible. Por favor
              selecciona otro horario.
            </p>
            <Button onClick={handleCancel} className="w-full">
              Seleccionar otro horario
            </Button>
          </Card>
        </Container>
      </Section>
    );
  }

  const doctor = doctorResponse.data;
  const selectedType = typesResponse?.data?.find(
    (t) => t.id === appointmentData.typeId,
  );
  const selectedLocation = locationsResponse?.data?.find(
    (l) => l.id === appointmentData.locationId,
  );

  const formattedDate = (() => {
    const [day, month, year] = appointmentData.dayKey.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return format(date, "EEEE, d 'de' MMMM yyyy", { locale: es });
  })();

  const isFormValid = motive.trim().length >= 3 && acceptTerms;

  return (
    <Section size="xs">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="border-b pb-4 text-center">
                <h1 className="mb-2 text-2xl font-bold">Confirmar Cita</h1>
                <p className="text-muted-foreground">
                  Revisa los detalles antes de confirmar tu cita
                </p>
              </div>
              {/* <CardTitle>Resumen de tu Cita</CardTitle> */}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <User className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  {doctor.specialty && (
                    <Badge variant="secondary" className="mt-1">
                      {doctor.specialty}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Fecha</p>
                    <p className="font-medium capitalize">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Hora</p>
                    <p className="font-medium">
                      {appointmentData.startTime} - {appointmentData.endTime}
                    </p>
                    {selectedType && (
                      <p className="text-muted-foreground text-sm">
                        Duración: {selectedType.durationMinutes} minutos
                      </p>
                    )}
                  </div>
                </div>

                {selectedLocation && (
                  <div className="flex items-center gap-3">
                    <MapPin className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Ubicación</p>
                      <p className="font-medium">{selectedLocation.nombre}</p>
                      {selectedLocation.direccion && (
                        <p className="text-muted-foreground text-sm">
                          {selectedLocation.direccion}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedType && (
                  <div className="flex items-center gap-3">
                    <FileText className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Tipo de Cita
                      </p>
                      <p className="font-medium">{selectedType.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="motive">
                  Motivo de la Consulta{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motive"
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-muted-foreground text-right text-xs">
                  {motive.length}/500 caracteres
                </p>
              </div>

              <div className="flex items-start gap-3 border-t pt-4">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked: boolean) =>
                    setAcceptTerms(checked)
                  }
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm leading-relaxed"
                >
                  Acepto los términos y condiciones y autorizo el uso de mis
                  datos personales para la gestión de mi cita médica
                </label>
              </div>

              <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-4 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  Recibirás una confirmación por correo electrónico una vez
                  agendada la cita
                </span>
              </div>

              <div className="flex gap-3 pt-4">
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
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    'Confirmar Cita'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
