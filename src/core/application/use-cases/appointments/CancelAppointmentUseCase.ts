import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import type { CancelAppointmentDTO } from '@/core/application/dto';

export class CancelAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: CancelAppointmentDTO): Promise<void> {
    const dayKey = DayKey.create(dto.dayKey);
    await this.appointmentRepo.cancel(dto.quoteID, dayKey, dto.userId, dto.orgID);
  }
}
