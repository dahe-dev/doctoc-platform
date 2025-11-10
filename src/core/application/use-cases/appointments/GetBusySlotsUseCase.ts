import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { TimeSlot } from '@/core/domain/value-objects/TimeSlot';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import type { GetBusySlotsDTO } from '@/core/application/dto';
import { Appointment } from '@/core/domain/entities/Appointment';

export class GetBusySlotsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: GetBusySlotsDTO): Promise<TimeSlot[]> {
    const dayKey = DayKey.create(dto.dayKey);
    
    if (dto.userId) {
      const appointments = await this.appointmentRepo.findByUserAndDay(dto.userId, dayKey, dto.orgID);
      return this.appointmentsToTimeSlots(appointments);
    }

    const appointments = await this.appointmentRepo.findByDay(dayKey, dto.orgID);
    return this.appointmentsToTimeSlots(appointments);
  }

  private appointmentsToTimeSlots(appointments: Appointment[]): TimeSlot[] {
    return appointments.map(apt => {
      const rawStart = (apt as { _rawStart?: string })._rawStart;
      const rawEnd = (apt as { _rawEnd?: string })._rawEnd;
      
      if (rawStart && rawEnd) {
        const startTime = rawStart.substring(11, 16);
        const endTime = rawEnd.substring(11, 16);
        return TimeSlot.create(startTime, endTime);
      }
      
      const start = this.formatTime(apt.scheduledStart);
      const end = this.formatTime(apt.scheduledEnd);
      return TimeSlot.create(start, end);
    });
  }

  private formatTime(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}
