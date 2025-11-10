import { Appointment } from "@/core/domain/entities/Appointment"
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/card"
import { Badge } from "@/presentation/components/ui/badge"
import { Button } from "@/presentation/components/ui/button"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (appointment: Appointment) => void
  showActions?: boolean
}

export function AppointmentCard({
  appointment,
  onCancel,
  showActions = true,
}: AppointmentCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const startTime = format(appointment.scheduledStart, "HH:mm")
  const endTime = format(appointment.scheduledEnd, "HH:mm")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {format(appointment.scheduledStart, "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {startTime} - {endTime}
              </span>
            </div>
          </div>
          <Badge variant={getStatusVariant(appointment.status.value)}>
            {getStatusLabel(appointment.status.value)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {appointment.locationId && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Sede: {appointment.locationId}
              </span>
            </div>
          )}
          {showActions && onCancel && appointment.status.value !== "cancelled" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(appointment)}
              className="w-full mt-4"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar Cita
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
