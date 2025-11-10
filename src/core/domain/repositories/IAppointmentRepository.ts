import { Appointment } from '../entities/Appointment';
import { DayKey } from '../value-objects/DayKey';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment, oldDayKey?: DayKey): Promise<Appointment>;
  cancel(appointmentId: string, dayKey: DayKey, userId: string, orgID: string, reason?: string): Promise<void>;
  findById(id: string, dayKey: DayKey, orgID: string): Promise<Appointment | null>;
  findByPatient(patientId: string, orgID: string): Promise<Appointment[]>;
  findByDay(dayKey: DayKey, orgID: string): Promise<Appointment[]>;
  findByUserAndDay(userId: string, dayKey: DayKey, orgID: string): Promise<Appointment[]>;
}
