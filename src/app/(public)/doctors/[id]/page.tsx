'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Mail, Stethoscope, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Container } from '@/presentation/components/ui/container';
import { Section } from '@/presentation/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import { DoctorAvailabilityCalendar } from '@/presentation/components/features/DoctorAvailabilityCalendar';
import { useDoctorProfile } from '@/presentation/hooks/queries';
import { useAppointmentTypes, useLocations } from '@/presentation/hooks/queries/useOrganization';
import { UserMapper } from '@/core/application/mappers';
import { DOCTOC_CONFIG, ROUTES } from '@/config/constants';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Label } from '@/presentation/components/ui/label';

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');

  const { data: response, isLoading, error } = useDoctorProfile(doctorId, DOCTOC_CONFIG.orgID);
  const { data: typesResponse } = useAppointmentTypes(DOCTOC_CONFIG.orgID);
  const { data: locationsResponse } = useLocations(DOCTOC_CONFIG.orgID);

  const doctor = response?.data ? UserMapper.toEntity(response.data) : null;

  const allLocations = locationsResponse?.data || [];
  const doctorLocationIds = doctor?.calendarInfo?.horarios 
    ? Object.keys(doctor.calendarInfo.horarios) 
    : [];
  
  const availableLocations = allLocations.filter(loc => 
    doctorLocationIds.includes(loc.id)
  );

  const appointmentTypes = useMemo(() => 
    typesResponse?.data?.filter(type => type.externalVisibility) || [], 
    [typesResponse]
  );

  useEffect(() => {
    if (!selectedLocationId && availableLocations.length > 0) {
      setSelectedLocationId(availableLocations[0].id);
    }
  }, [availableLocations, selectedLocationId]);

  useEffect(() => {
    if (!selectedTypeId && appointmentTypes.length > 0) {
      setSelectedTypeId(appointmentTypes[0].id);
    }
  }, [appointmentTypes, selectedTypeId]);

  const selectedType = appointmentTypes.find(type => type.id === selectedTypeId) || appointmentTypes[0];

  const hasSchedule = doctor?.calendarInfo?.horarios && 
    Object.keys(doctor.calendarInfo.horarios).length > 0;

  const totalLocations = doctor?.calendarInfo?.horarios 
    ? Object.keys(doctor.calendarInfo.horarios).length 
    : 0;

  const appointmentDuration = selectedType?.durationMinutes || 30;

  if (isLoading) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </Section>
    );
  }

  if (error || !response?.success || !response.data || !doctor) {
    return (
      <Section className="min-h-screen">
        <Container>
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Doctor no encontrado</h2>
              <p className="text-muted-foreground">
                El doctor que buscas no está disponible o no existe.
              </p>
              <Link href={ROUTES.public.home}>
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  const getWorkingDaysWithSchedule = (): Array<{ day: string; schedule: string }> => {
    if (!doctor.calendarInfo?.horarios || !selectedLocationId) return [];
    
    const schedules = doctor.calendarInfo.horarios[selectedLocationId];
    if (!schedules) return [];
    
    const daysMap = new Map<string, { start: string; end: string }[]>();
    
    const key = doctor.calendarInfo.configureByType ? Object.keys(schedules)[0] : 'default';
    const schedule = schedules[key];
    
    if (schedule?.horariesFijo) {
      Object.entries(schedule.horariesFijo).forEach(([day, slots]) => {
        if (slots && slots.length > 0) {
          daysMap.set(day, slots);
        }
      });
    }
    
    const dayNames: Record<string, string> = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes',
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };
    
    return Array.from(daysMap.entries()).map(([day, slots]) => {
      const minStart = slots.reduce((min, s) => s.start < min ? s.start : min, '23:59');
      const maxEnd = slots.reduce((max, s) => s.end > max ? s.end : max, '00:00');
      return {
        day: dayNames[day] || day,
        schedule: `${minStart} - ${maxEnd}`
      };
    });
  };

  const workingDays = getWorkingDaysWithSchedule();

  const handleSlotSelect = (date: Date, startTime: string, endTime: string) => {
    setSelectedSlot({ date, startTime, endTime });
  };

  const handleBookAppointment = () => {
    if (!selectedSlot || !selectedTypeId || !selectedLocationId) return;
    
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dayKey = format(selectedSlot.date, 'dd-MM-yyyy');
    
    const appointmentData = {
      doctorId,
      dayKey,
      dateStr: format(selectedSlot.date, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      typeId: selectedTypeId,
      locationId: selectedLocationId
    };
    
    sessionStorage.setItem(`appointment_${appointmentId}`, JSON.stringify(appointmentData));
    
    router.push(`/appointments/confirm/${appointmentId}`);
  };

  return (
    <>
      <Section variant="gradient" size="default" >
        <Container>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <Avatar className="h-32 w-32 border-4 border-border">
                        <AvatarImage src={doctor.photoUrl} alt={doctor.fullName} />
                        <AvatarFallback className="text-3xl">{doctor.initials}</AvatarFallback>
                      </Avatar>
                      {hasSchedule && (
                        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                          <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    <h1 className="text-2xl font-bold mb-2">{doctor.fullName}</h1>

                    {doctor.specialty && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Stethoscope className="h-5 w-5" />
                        <span className="text-lg">{doctor.specialty}</span>
                      </div>
                    )}

                    <div className="w-full space-y-3 mb-6">
                      {doctor.email && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                      )}

                      {workingDays.length > 0 && (
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 font-medium pb-2">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>Días de atención:</span>
                          </div>

                          <div className="space-y-1">
                            {workingDays.map(({ day, schedule }) => (
                              <div key={day} className="text-xs">
                                <span className="font-medium">{day}:</span> {schedule}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {totalLocations > 0 && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{totalLocations} {totalLocations === 1 ? 'sede' : 'sedes'} disponibles</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {hasSchedule && (
                        <Badge variant="success" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Disponible
                        </Badge>
                      )}
                      {doctor.allowsOverbooking() && (
                        <Badge variant="outline">
                          Sobreagendamiento
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedSlot && (
                <Card className="mt-4 border-2 border-primary shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Horario Seleccionado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha</p>
                        <p className="font-semibold">
                          {format(selectedSlot.date, "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hora</p>
                        <p className="font-semibold">
                          {selectedSlot.startTime} - {selectedSlot.endTime}
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={handleBookAppointment}
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirmar Cita
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              {hasSchedule ? (
                <div className="space-y-4">
                  {(availableLocations.length > 1 || appointmentTypes.length > 0) && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableLocations.length > 1 && (
                            <div className="space-y-1.5">
                              <Label >
                                <MapPin className="h-3.5 w-3.5" />
                                Sedes
                              </Label>
                              <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Seleccionar sede" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableLocations.map((location) => (
                                    <SelectItem key={location.id} value={location.id}>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        <div>
                                          <p className="font-medium text-sm">{location.nombre}</p>
                                          {location.direccion && (
                                            <p className="text-xs text-muted-foreground">
                                              {location.direccion}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {appointmentTypes.length > 0 && (
                            <div className="space-y-1.5">
                              <Label>
                                <Stethoscope className="h-3.5 w-3.5" />
                                Tipo de Cita
                              </Label>
                              <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {appointmentTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="h-6 w-6 rounded-full flex items-center justify-center"
                                          style={{ 
                                            backgroundColor: type.color ? `${type.color}20` : 'hsl(var(--primary) / 0.1)',
                                            color: type.color || 'hsl(var(--primary))'
                                          }}
                                        >
                                          <Clock className="h-3 w-3" />
                                        </div>
                                        <span className="font-medium text-sm">{type.name}</span>
                                        <Badge variant="secondary" className="text-xs ml-auto">
                                          {type.durationMinutes}min
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <DoctorAvailabilityCalendar
                    doctor={response.data}
                    onSlotSelect={handleSlotSelect}
                    selectedSlot={selectedSlot}
                    appointmentDuration={appointmentDuration}
                    locationId={selectedLocationId}
                  />
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">Sin horarios disponibles</h3>
                    <p className="text-muted-foreground">
                      Este doctor aún no ha configurado sus horarios de atención.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
