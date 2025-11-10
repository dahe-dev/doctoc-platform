import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import type { GetAppointmentsByUserDayDTO } from '@/core/application/dto';

export class GetAppointmentsByUserDayUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: GetAppointmentsByUserDayDTO): Promise<Appointment[]> {
    const dayKey = DayKey.create(dto.dayKey);
    return this.appointmentRepo.findByUserAndDay(dto.userId, dayKey, dto.orgID);
  }
}
