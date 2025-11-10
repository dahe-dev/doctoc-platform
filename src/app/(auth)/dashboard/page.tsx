'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Container } from '@/presentation/components/ui/container';
import { Section } from '@/presentation/components/ui/section';
import { Heading } from '@/presentation/components/ui/heading';
import { Text } from '@/presentation/components/ui/text';
import { Badge } from '@/presentation/components/ui/badge';
import Link from 'next/link';
import { ROUTES, DOCTOC_CONFIG } from '@/config/constants';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentsByPatient } from '@/app/actions/appointments';
import { getDoctorById } from '@/app/actions/doctors';
import { type SerializedUser } from '@/core/application/mappers';
import {
  filterUpcomingAppointments,
  cleanDisplayName,
  formatDoctorName,
} from '@/presentation/utils';

export default function DashboardPage() {
  const { patientId, displayName, user } = useAuth();
  const [doctorsMap, setDoctorsMap] = useState<Map<string, SerializedUser>>(
    new Map(),
  );

  const cleanedDisplayName = cleanDisplayName(displayName);

  const effectivePatientId =
    patientId ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('patient_id')
      : null) ||
    user?.uid ||
    '';

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', effectivePatientId],
    queryFn: async () => {
      const result = await getAppointmentsByPatient({
        orgID: DOCTOC_CONFIG.orgID,
        patientID: effectivePatientId,
      });
      if (!result.success) throw new Error(result.error);
      return result.data || [];
    },
    enabled: !!effectivePatientId,
  });

  const upcomingAppointments = filterUpcomingAppointments(appointments).slice(
    0,
    3,
  );

  useEffect(() => {
    const loadDoctors = async () => {
      const uniqueDoctorIds = [
        ...new Set(upcomingAppointments.map((apt) => apt.userId)),
      ];
      const doctorsToLoad = uniqueDoctorIds.filter((id) => !doctorsMap.has(id));

      if (doctorsToLoad.length === 0) return;

      const newDoctorsMap = new Map<string, SerializedUser>();

      for (const doctorId of doctorsToLoad) {
        const result = await getDoctorById(doctorId, DOCTOC_CONFIG.orgID);
        if (result.success && result.data) {
          newDoctorsMap.set(doctorId, result.data);
        }
      }

      if (newDoctorsMap.size > 0) {
        setDoctorsMap((prev) => new Map([...prev, ...newDoctorsMap]));
      }
    };

    if (upcomingAppointments.length > 0) {
      loadDoctors();
    }
  }, [upcomingAppointments, doctorsMap]);

  const getDoctorDisplayName = (userId: string): string => {
    const doctor = doctorsMap.get(userId);
    if (!doctor) return `Doctor ${userId.slice(0, 8)}`;

    return formatDoctorName(
      doctor.firstName,
      doctor.lastName,
      doctor.gender,
      doctor.role,
    );
  };

  const getDoctorSpecialty = (userId: string): string => {
    const doctor = doctorsMap.get(userId);
    return doctor?.specialty || 'Medicina General';
  };

  if (isLoading) {
    return (
      <Section size="lg">
        <Container>
          <div className="flex min-h-[400px] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <Section variant="gradient" size="xs" className="border-border border-b">
        <Container>
          <Heading as="h1" size="xl" className="mb-2">
            Bienvenido, {cleanedDisplayName}!
          </Heading>
          <Text variant="muted" size="lg">
            Administra tus citas y registros médicos en un solo lugar
          </Text>
        </Container>
      </Section>

      <Section size="xs">
        <Container>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={<Calendar className="text-primary h-8 w-8" />}
              value={upcomingAppointments.length.toString()}
              subtitle="Citas Próximas"
              trend="Próximos días"
            />
            <StatsCard
              icon={<Clock className="text-chart-4 h-8 w-8" />}
              value={appointments.length.toString()}
              subtitle="Citas Totales"
              trend="Este año"
            />
            <StatsCard
              icon={<Users className="text-chart-2 h-8 w-8" />}
              value="5"
              subtitle="Doctores Consultados"
              trend="2 especialistas"
            />
            <StatsCard
              icon={<TrendingUp className="text-chart-5 h-8 w-8" />}
              value="85"
              subtitle="Estado"
              trend="Muy bueno"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Heading as="h2" size="md">
                      Próximas Citas
                    </Heading>
                    <Link href={ROUTES.auth.appointments}>
                      <Button variant="outline" size="sm">
                        Ver Todas
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          doctorName={getDoctorDisplayName(appointment.userId)}
                          specialty={getDoctorSpecialty(appointment.userId)}
                          date={format(
                            new Date(appointment.scheduledStart),
                            "d 'de' MMMM, yyyy",
                            { locale: es },
                          )}
                          time={format(
                            new Date(appointment.scheduledStart),
                            'HH:mm',
                            { locale: es },
                          )}
                          status={
                            appointment.status === 'confirmada'
                              ? 'confirmed'
                              : 'pending'
                          }
                        />
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <Clock className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                        <Text variant="muted">No tienes citas próximas</Text>
                        <Link href={ROUTES.public.doctors}>
                          <Button className="mt-4" size="sm">
                            Agendar Cita
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <div className="p-6">
                  <Heading as="h2" size="md" className="mb-4">
                    Acciones Rápidas
                  </Heading>
                  <div className="space-y-3">
                    <Link href={ROUTES.public.doctors} className="block">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Nueva Cita
                      </Button>
                    </Link>
                    <Link href={ROUTES.auth.appointments} className="block">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Ver Todas las Citas
                      </Button>
                    </Link>
                    <Link href={ROUTES.auth.profile} className="block">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Actualizar Perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="border-warning/20 bg-warning/5">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-warning mt-0.5 h-5 w-5" />
                    <div>
                      <Heading as="h3" size="sm" className="mb-1">
                        Recordatorio de Salud
                      </Heading>
                      <Text size="sm" variant="muted">
                        Tu chequeo anual vence el próximo mes. Agenda tu cita
                        temprano para obtener tu horario preferido.
                      </Text>
                      <Link href={ROUTES.public.doctors}>
                        <Button size="sm" className="mt-3">
                          Agendar Ahora
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

function StatsCard({
  icon,
  value,
  subtitle,
  trend,
}: {
  icon: React.ReactNode;
  value: string;
  subtitle: string;
  trend: string;
}) {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          {icon}
          <Text size="sm" variant="muted">
            {trend}
          </Text>
        </div>
        <div>
          <div className="text-foreground text-2xl font-bold">{value}</div>
          <Text size="sm" variant="muted">
            {subtitle}
          </Text>
        </div>
      </div>
    </Card>
  );
}

function AppointmentCard({
  doctorName,
  specialty,
  date,
  time,
  status,
}: {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}) {
  return (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Users className="text-primary h-6 w-6" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold">{doctorName}</h3>
          <Text size="sm" variant="muted">
            {specialty}
          </Text>
          <div className="mt-1 flex items-center gap-4">
            <Text size="sm" variant="muted">
              {date}
            </Text>
            <Text size="sm" variant="muted">
              {time}
            </Text>
          </div>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={status === 'confirmed' ? 'success' : 'warning'}>
          {status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
        </Badge>
      </div>
    </div>
  );
}
