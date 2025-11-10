'use client';

import { useState, useMemo } from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/presentation/utils/cn';
import { useDoctorAvailability } from '@/presentation/hooks/queries';
import type { SerializedUser } from '@/core/application/mappers';
import { DOCTOC_CONFIG } from '@/config/constants';

interface DoctorAvailabilityCalendarProps {
  doctor: SerializedUser;
  onSlotSelect?: (date: Date, startTime: string, endTime: string) => void;
  selectedSlot?: { date: Date; startTime: string; endTime: string } | null;
  appointmentDuration?: number;
  locationId?: string;
}

export function DoctorAvailabilityCalendar({ 
  doctor, 
  onSlotSelect,
  selectedSlot,
  appointmentDuration = 30,
  locationId
}: DoctorAvailabilityCalendarProps) {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const dayKey = format(selectedDate, 'dd-MM-yyyy');

  const { data: availabilityData, isLoading } = useDoctorAvailability({
    orgID: DOCTOC_CONFIG.orgID,
    dayKey,
    userId: doctor.id,
    format: 'busy_ranges'
  });

  const busySlots = useMemo(() => {
    return availabilityData?.data?.busyRanges || [];
  }, [availabilityData]);

  const generateTimeSlots = useMemo(() => {
    if (!doctor.calendarInfo?.horarios || !locationId) return [];

    const schedules = doctor.calendarInfo.horarios[locationId];
    if (!schedules) return [];
    
    const key = doctor.calendarInfo.configureByType ? Object.keys(schedules)[0] : 'default';
    const schedule = schedules[key];

    if (!schedule) return [];

    const dayNameEn = format(selectedDate, 'EEEE');
    
    const now = new Date();
    const isToday = isSameDay(selectedDate, now);
    const currentTimeMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
    
    const slots: Array<{ start: string; end: string; status: 'available' | 'busy' | 'past' }> = [];

    if (schedule.horariesFijo && schedule.horariesFijo[dayNameEn as keyof typeof schedule.horariesFijo]) {
      const daySlots = schedule.horariesFijo[dayNameEn as keyof typeof schedule.horariesFijo] || [];
      

      daySlots.forEach(block => {
        
        const startParts = block.start.split(':');
        const endParts = block.end.split(':');
        let currentMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        while (currentMinutes + appointmentDuration <= endMinutes) {
          const slotStartHour = Math.floor(currentMinutes / 60);
          const slotStartMin = currentMinutes % 60;
          const slotEndHour = Math.floor((currentMinutes + appointmentDuration) / 60);
          const slotEndMin = (currentMinutes + appointmentDuration) % 60;

          const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
          
          const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

          let status: 'available' | 'busy' | 'past' = 'available';

          if (isToday && currentMinutes <= currentTimeMinutes) {
            status = 'past';
          } else {
            const isBusy = busySlots.some(busy => {
              const busyStart = busy.start;
              const busyEnd = busy.end;

              
              
              const busyStartTime = busyStart.includes('T') ? busyStart.split('T')[1].substring(0, 5) : busyStart.substring(0, 5);
              const busyEndTime = busyEnd.includes('T') ? busyEnd.split('T')[1].substring(0, 5) : busyEnd.substring(0, 5);
              
              const [busyStartH, busyStartM] = busyStartTime.split(':').map(Number);
              const [busyEndH, busyEndM] = busyEndTime.split(':').map(Number);
              
              const busyStartMinutes = busyStartH * 60 + busyStartM;
              const busyEndMinutes = busyEndH * 60 + busyEndM;
              const slotEndMinutes = currentMinutes + appointmentDuration;
              


              return (
                (currentMinutes >= busyStartMinutes && currentMinutes < busyEndMinutes) ||
                (slotEndMinutes > busyStartMinutes && slotEndMinutes <= busyEndMinutes) ||
                (currentMinutes <= busyStartMinutes && slotEndMinutes >= busyEndMinutes)
              );
            });
            if (isBusy) status = 'busy';
          }

          slots.push({ start: slotStart, end: slotEnd, status });

          currentMinutes += appointmentDuration;
        }
      });
    }

    if (schedule.horariesDinamico) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      schedule.horariesDinamico.forEach(range => {
        const daySchedule = range.daySchedules[dateKey];
        if (daySchedule) {
          daySchedule.forEach(block => {
            const startParts = block.start.split(':');
            const endParts = block.end.split(':');
            let currentMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
            const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

            while (currentMinutes + appointmentDuration <= endMinutes) {
              const slotStartHour = Math.floor(currentMinutes / 60);
              const slotStartMin = currentMinutes % 60;
              const slotEndHour = Math.floor((currentMinutes + appointmentDuration) / 60);
              const slotEndMin = (currentMinutes + appointmentDuration) % 60;
              
              const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
              const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

              let status: 'available' | 'busy' | 'past' = 'available';

              if (isToday && currentMinutes <= currentTimeMinutes) {
                status = 'past';
              } else {
                const isBusy = busySlots.some(busy => {
                  const busyStart = busy.start;
                  const busyEnd = busy.end;
                  
                  const busyStartTime = busyStart.includes('T') ? busyStart.split('T')[1].substring(0, 5) : busyStart.substring(0, 5);
                  const busyEndTime = busyEnd.includes('T') ? busyEnd.split('T')[1].substring(0, 5) : busyEnd.substring(0, 5);
                  
                  const [busyStartH, busyStartM] = busyStartTime.split(':').map(Number);
                  const [busyEndH, busyEndM] = busyEndTime.split(':').map(Number);
                  
                  const busyStartMinutes = busyStartH * 60 + busyStartM;
                  const busyEndMinutes = busyEndH * 60 + busyEndM;
                  const slotEndMinutes = currentMinutes + appointmentDuration;
                  
                  return (
                    (currentMinutes >= busyStartMinutes && currentMinutes < busyEndMinutes) ||
                    (slotEndMinutes > busyStartMinutes && slotEndMinutes <= busyEndMinutes) ||
                    (currentMinutes <= busyStartMinutes && slotEndMinutes >= busyEndMinutes)
                  );
                });
                
                if (isBusy) status = 'busy';
              }

              slots.push({ start: slotStart, end: slotEnd, status });

              currentMinutes += appointmentDuration;
            }
          });
        }
      });
    }
    

    return slots.sort((a, b) => a.start.localeCompare(b.start));
  }, [doctor, selectedDate, busySlots, appointmentDuration, locationId]);
  

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (slot: { start: string; end: string; status: string }) => {
    if (slot.status === 'available' && onSlotSelect) {
      onSlotSelect(selectedDate, slot.start, slot.end);
    }
  };

  const isSlotSelected = (start: string, end: string) => {
    if (!selectedSlot) return false;
    return (
      isSameDay(selectedSlot.date, selectedDate) &&
      selectedSlot.startTime === start &&
      selectedSlot.endTime === end
    );
  };

  const availableCount = generateTimeSlots.filter(s => s.status === 'available').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Seleccionar Fecha
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-32 text-center">
                {format(currentWeekStart, 'MMMM yyyy', { locale: es })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextWeek}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isPast = day < startOfDay(new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isPast}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                    'hover:border-primary hover:bg-primary/5',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent',
                    isSelected && !isPast && 'border-primary bg-primary text-primary-foreground hover:bg-primary',
                    !isSelected && !isPast && 'border-border',
                    isToday && !isSelected && !isPast && 'border-primary/50'
                  )}
                >
                  <span className="text-xs font-medium mb-1">
                    {format(day, 'EEE', { locale: es })}
                  </span>
                  <span className="text-lg font-bold">
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horarios Disponibles
            </CardTitle>
            <Badge variant={availableCount > 0 ? 'success' : 'secondary'}>
              {availableCount} {availableCount === 1 ? 'horario disponible' : 'horarios disponibles'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : generateTimeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {generateTimeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  disabled={slot.status === 'busy' || slot.status === 'past'}
                  className={cn(
                    'px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all relative',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    slot.status === 'available' && !isSlotSelected(slot.start, slot.end) && 
                      'border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground hover:border-primary',
                    slot.status === 'busy' && 
                      'border-border bg-muted text-muted-foreground',
                    slot.status === 'past' && 
                      'border-border bg-muted/50 text-muted-foreground line-through',
                    isSlotSelected(slot.start, slot.end) && 
                      'border-primary bg-primary text-primary-foreground'
                  )}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay horarios configurados para este día</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
