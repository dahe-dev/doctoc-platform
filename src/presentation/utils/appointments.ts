import { type SerializedAppointment } from "@/core/application/mappers"

export const filterUpcomingAppointments = (appointments: SerializedAppointment[]) => {
  const now = new Date()
  return appointments.filter(
    app => new Date(app.scheduledStart) >= now && 
    app.status !== "cancelada" && 
    app.status !== "cancelado"
  )
}

export const filterPastAppointments = (appointments: SerializedAppointment[]) => {
  const now = new Date()
  return appointments.filter(
    app => new Date(app.scheduledStart) < now || 
    app.status === "cancelada" || 
    app.status === "cancelado"
  )
}

export const getAppointmentStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "confirmada":
      return "default"
    case "pendiente":
      return "secondary"
    case "cancelada":
      return "destructive"
    default:
      return "outline"
  }
}

export const getAppointmentStatusLabel = (status: string): string => {
  switch (status) {
    case "confirmada":
      return "Confirmada"
    case "pendiente":
      return "Pendiente"
    case "cancelada":
      return "Cancelada"
    case "completada":
      return "Completada"
    default:
      return status
  }
}
