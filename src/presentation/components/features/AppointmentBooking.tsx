"use client"

import { useState } from "react"
import { User } from "@/core/domain/entities/User"
import { TimeSlot } from "@/core/domain/value-objects/TimeSlot"
import { Calendar } from "@/presentation/components/ui/calendar"
import { ScheduleGrid } from "./ScheduleGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { LoadingSpinner } from "@/presentation/components/ui/LoadingSpinner"
import { useAvailability } from "@/presentation/hooks/queries/useAppointments"
import { format } from "date-fns"

interface AppointmentBookingProps {
  doctor: User
  locationId: string
  typeId?: string
  onConfirm: (date: Date, slot: TimeSlot) => void
  onCancel: () => void
}

export function AppointmentBooking({
  doctor,
  onConfirm,
  onCancel,
}: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>()

  const { data: availabilityResponse, isLoading } = useAvailability({
    orgID: "default",
    userId: doctor.id,
    dayKey: selectedDate ? format(selectedDate, "dd-MM-yyyy") : "",
    format: 'busy_ranges',
  }, !!selectedDate)

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      onConfirm(selectedDate, selectedSlot)
    }
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Cita con {doctor.fullName}</CardTitle>
          {doctor.specialty && (
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <>
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ) : availabilityResponse?.data?.busyRanges && availabilityResponse.data.busyRanges.length > 0 ? (
            <ScheduleGrid
              timeSlots={availabilityResponse.data.busyRanges.map(slot => 
                TimeSlot.create(slot.start, slot.end)
              )}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No hay horarios disponibles para esta fecha
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedSlot}
          className="flex-1"
        >
          Confirmar Cita
        </Button>
      </div>
    </div>
  )
}
