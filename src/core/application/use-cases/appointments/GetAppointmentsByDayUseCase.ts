import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import type { GetAppointmentsByDayDTO } from '@/core/application/dto';

export class GetAppointmentsByDayUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: GetAppointmentsByDayDTO): Promise<Appointment[]> {
    const dayKey = DayKey.create(dto.dayKey);
    return this.appointmentRepo.findByDay(dayKey, dto.orgID);
  }
}
