import type { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import { AppointmentStatus } from '@/core/domain/value-objects/AppointmentStatus';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import { appointmentApiClient } from '../api/clients/AppointmentApiClient';

export class DoctocAppointmentRepository implements IAppointmentRepository {
  async create(appointment: Appointment): Promise<Appointment> {
    const response = await appointmentApiClient.manageAppointment({
      action: 'create',
      orgID: appointment.orgID,
      dayKey: appointment.dayKey.value,
      scheduledStart: appointment.scheduledStart.toISOString(),
      scheduledEnd: appointment.scheduledEnd.toISOString(),
      patient: appointment.patientId,
      userId: appointment.userId,
      type: appointment.type,
      typeId: appointment.typeId,
      motive: appointment.motive,
      status: appointment.status.value,
      version: 'v2',
      locationId: appointment.locationId,
      recipeID: appointment.recipeID || '',
      category: appointment.category,
      personaEjecutante: 'System'
    });

    if ('quote' in response && response.quote) {
      return this.mapToAppointment({
        ...response.quote,
        dayKey: appointment.dayKey.value
      });
    }

    throw new Error(response.message || 'Error al crear la cita');
  }

  async update(appointment: Appointment, oldDayKey?: DayKey): Promise<Appointment> {
    const response = await appointmentApiClient.manageAppointment({
      action: 'update',
      orgID: appointment.orgID,
      quoteID: appointment.id,
      dayKey: appointment.dayKey.value,
      oldDayKey: oldDayKey?.value,
      scheduledStart: appointment.scheduledStart.toISOString(),
      scheduledEnd: appointment.scheduledEnd.toISOString(),
      patient: appointment.patientId,
      userId: appointment.userId,
      type: appointment.type,
      typeId: appointment.typeId,
      motive: appointment.motive,
      status: appointment.status.value,
      locationId: appointment.locationId,
      recipeID: appointment.recipeID || '',
      category: appointment.category,
      personaEjecutante: 'System'
    });

    if ('quote' in response && response.quote) {
      return this.mapToAppointment({
        ...response.quote,
        dayKey: appointment.dayKey.value
      });
    }

    throw new Error(response.message || 'Error al actualizar la cita');
  }

  async cancel(appointmentId: string, dayKey: DayKey, userId: string, orgID: string, reason?: string): Promise<void> {
    await appointmentApiClient.manageAppointment({
      action: 'cancel',
      orgID,
      dayKey: dayKey.value,
      userId,
      quoteID: appointmentId,
      cancelReason: reason || '',
      personaEjecutante: 'System'
    });
  }

  async findById(id: string, dayKey: DayKey, orgID: string): Promise<Appointment | null> {
    try {
      const response = await appointmentApiClient.getAppointmentById(orgID, dayKey.value, id);
      return this.mapToAppointment(response);
    } catch {
      return null;
    }
  }

  async findByPatient(patientId: string, orgID: string): Promise<Appointment[]> {
    const response = await appointmentApiClient.getAppointmentsByPatient(orgID, patientId);
    if (!response.appointments) return [];
    return response.appointments.map((apt: Record<string, unknown>) => this.mapToAppointment(apt));
  }

  async findByDay(dayKey: DayKey, orgID: string): Promise<Appointment[]> {
    const response = await appointmentApiClient.getAppointmentsByDay(orgID, dayKey.value);
    if (!response.appointments) return [];
    return response.appointments.map((apt: Record<string, unknown>) => this.mapToAppointment(apt));
  }

  async findByUserAndDay(userId: string, dayKey: DayKey, orgID: string): Promise<Appointment[]> {
    try {
      const response = await appointmentApiClient.getBusySlots(orgID, dayKey.value, userId);
      
      if (!response.busyRanges || response.busyRanges.length === 0) {
        return [];
      }

      const appointments = response.busyRanges.map((range: { start: string; end: string }, index: number) => {
        const appointment = new Appointment(
          `busy_${index}_${Date.now()}`,
          orgID,
          dayKey,
          new Date(range.start),
          new Date(range.end),
          '',
          userId,
          'busy_slot',
          '',
          'Ocupado',
          '',
          AppointmentStatus.create('confirmada'),
          'busy',
          '',
          []
        );
        (appointment as { _rawStart?: string })._rawStart = range.start;
        (appointment as { _rawEnd?: string })._rawEnd = range.end;
        return appointment;
      });
      
      return appointments;
    } catch (error) {
      console.error('[DoctocAppointmentRepository] Error fetching busy slots:', error);
      return [];
    }
  }

  private mapToAppointment(data: Record<string, unknown>): Appointment {
    return new Appointment(
      data.id as string,
      (data.orgID || '') as string,
      DayKey.create((data.date || data.dayKey) as string),
      new Date((data.startDate || data.scheduledStart) as string),
      new Date((data.endDate || data.scheduledEnd) as string),
      (data.patientId || data.patient) as string,
      data.userId as string,
      data.type as string,
      (data.typeId || '') as string,
      (data.motive || '') as string,
      (data.locationId || '') as string,
      AppointmentStatus.create(data.status as string),
      (data.category || 'cita') as string,
      data.recipeID as string | undefined,
      undefined
    );
  }
}
