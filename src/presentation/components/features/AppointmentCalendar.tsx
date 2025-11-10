'use client';

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner';
import { cn } from '@/presentation/utils/cn';

interface TimeSlot {
  start: string;
  end: string;
}

interface AppointmentCalendarProps {
  doctorId: string;
  locationId: string;
  typeId?: string;
  duration?: number;
  onSlotSelect: (date: string, slot: TimeSlot) => void;
  selectedDate?: string;
  selectedSlot?: TimeSlot;
}

export function AppointmentCalendar({
  doctorId,
  locationId,
  typeId,
  duration = 30,
  onSlotSelect,
  selectedDate,
  selectedSlot,
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(selectedDate || null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysArray: Date[] = [];

    const startingDayOfWeek = firstDay.getDay();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      daysArray.push(prevDate);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day));
    }

    return daysArray;
  }, [currentMonth]);

  const formatDayKey = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateClick = async (date: Date) => {
    const dayKey = formatDayKey(date);
    setSelectedDay(dayKey);
    setLoading(true);

    try {
      const response = await fetch('/api/appointments/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: doctorId,
          dayKey,
          locationId,
          typeId,
          duration,
        }),
      });

      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (selectedDay) {
      onSlotSelect(selectedDay, slot);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Selecciona una Fecha
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-foreground">
            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((date, index) => {
            const dayKey = formatDayKey(date);
            const isSelected = dayKey === selectedDay;
            const isDisabled = isPastDate(date);
            const isCurrent = isCurrentMonth(date);

            return (
              <button
                key={index}
                disabled={isDisabled}
                onClick={() => handleDateClick(date)}
                className={cn(
                  'aspect-square rounded-lg text-sm transition-all',
                  'hover:bg-primary/10 hover:text-primary',
                  'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                  !isCurrent && 'text-muted-foreground',
                  isToday(date) && 'font-bold border-2 border-primary',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Horarios Disponibles
        </h3>

        {!selectedDay ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Selecciona una fecha para ver los horarios disponibles
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No hay horarios disponibles para este día
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {availableSlots.map((slot, index) => {
              const isSlotSelected =
                selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

              return (
                <Button
                  key={index}
                  variant={isSlotSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSlotClick(slot)}
                  className="justify-center"
                >
                  {slot.start}
                </Button>
              );
            })}
          </div>
        )}

        {selectedSlot && selectedDay && (
          <div className="mt-6 pt-6 border-t">
            <Badge variant="success" className="text-sm">
              Seleccionado: {selectedDay} a las {selectedSlot.start}
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
