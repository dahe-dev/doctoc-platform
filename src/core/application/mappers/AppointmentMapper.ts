import { Appointment } from '@/core/domain/entities/Appointment';

export type SerializedAppointment = {
  id: string;
  orgID: string;
  dayKey: string;
  scheduledStart: string;
  scheduledEnd: string;
  patientId: string;
  userId: string;
  type: string;
  typeId: string;
  motive: string;
  locationId: string;
  status: string;
  category: string;
  recipeID?: string;
  history?: unknown[];
};

export class AppointmentMapper {
  static toSerialized(appointment: Appointment): SerializedAppointment {
    return {
      id: appointment.id,
      orgID: appointment.orgID,
      dayKey: appointment.dayKey.value,
      scheduledStart: appointment.scheduledStart.toISOString(),
      scheduledEnd: appointment.scheduledEnd.toISOString(),
      patientId: appointment.patientId,
      userId: appointment.userId,
      type: appointment.type,
      typeId: appointment.typeId,
      motive: appointment.motive,
      locationId: appointment.locationId,
      status: appointment.status.value,
      category: appointment.category,
      recipeID: appointment.recipeID,
      history: appointment.history
    };
  }

  static toSerializedArray(appointments: Appointment[]): SerializedAppointment[] {
    return appointments.map(appointment => AppointmentMapper.toSerialized(appointment));
  }
}
