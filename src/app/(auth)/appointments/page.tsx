'use client';

import { useState } from 'react';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, XCircle } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Badge } from '@/presentation/components/ui/badge';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { DOCTOC_CONFIG } from '@/config/constants';
import { toast } from 'sonner';
import {
  getAppointmentsByPatient,
  cancelAppointment,
} from '@/app/actions/appointments';
import { type SerializedAppointment } from '@/core/application/mappers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  filterUpcomingAppointments,
  filterPastAppointments,
  getAppointmentStatusVariant,
  getAppointmentStatusLabel,
} from '@/presentation/utils';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] =
    useState<SerializedAppointment | null>(null);
  const { user, patientId } = useAuth();
  const queryClient = useQueryClient();

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

  const cancelMutation = useMutation({
    mutationFn: async (appointment: SerializedAppointment) => {
      const result = await cancelAppointment({
        orgID: DOCTOC_CONFIG.orgID,
        dayKey: appointment.dayKey,
        userId: appointment.userId,
        quoteID: appointment.id,
        cancelReason: 'Cancelada por el paciente',
        personaEjecutante: effectivePatientId,
      });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita cancelada exitosamente');
      setSelectedAppointment(null);
    },
    onError: () => {
      toast.error('Error al cancelar la cita');
    },
  });

  const upcomingAppointments = filterUpcomingAppointments(appointments);
  const pastAppointments = filterPastAppointments(appointments);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Calendar className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis Citas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus citas médicas
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {upcomingAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="flex flex-col overflow-hidden"
                >
                  <CardContent className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <User className="text-primary h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          Dr. {appointment.userId.slice(0, 8)}
                        </p>
                        <Badge
                          variant={getAppointmentStatusVariant(
                            appointment.status,
                          )}
                          className="mt-1 text-xs"
                        >
                          {getAppointmentStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {format(
                            new Date(appointment.scheduledStart),
                            'd MMM yyyy',
                            { locale: es },
                          )}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {format(
                            new Date(appointment.scheduledStart),
                            'HH:mm',
                            { locale: es },
                          )}
                        </span>
                      </div>
                    </div>

                    {appointment.motive && (
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {appointment.motive}
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppointment(appointment)}
                      className="mt-auto h-8 w-full text-xs"
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      Cancelar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Clock className="text-muted-foreground h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold">No tienes citas próximas</h3>
                <p className="text-muted-foreground text-sm">
                  Cuando reserves una cita aparecerá aquí
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : pastAppointments.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pastAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="flex flex-col overflow-hidden"
                >
                  <CardContent className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <User className="text-muted-foreground h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          Dr. {appointment.userId.slice(0, 8)}
                        </p>
                        <Badge
                          variant={getAppointmentStatusVariant(
                            appointment.status,
                          )}
                          className="mt-1 text-xs"
                        >
                          {getAppointmentStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {format(
                            new Date(appointment.scheduledStart),
                            'd MMM yyyy',
                            { locale: es },
                          )}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {format(
                            new Date(appointment.scheduledStart),
                            'HH:mm',
                            { locale: es },
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Calendar className="text-muted-foreground h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold">
                  No tienes historial de citas
                </h3>
                <p className="text-muted-foreground text-sm">
                  Tus citas completadas y canceladas aparecerán aquí
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cita será cancelada
              permanentemente y deberás agendar una nueva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedAppointment &&
                cancelMutation.mutate(selectedAppointment)
              }
              disabled={cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? 'Cancelando...' : 'Sí, cancelar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
