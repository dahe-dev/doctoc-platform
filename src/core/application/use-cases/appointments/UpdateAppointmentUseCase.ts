import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import { AppointmentStatus } from '@/core/domain/value-objects/AppointmentStatus';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import type { UpdateAppointmentDTO } from '@/core/application/dto';

export class UpdateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: UpdateAppointmentDTO): Promise<Appointment> {
    const dayKey = DayKey.create(dto.dayKey);
    const scheduledStart = new Date(dto.scheduledStart);
    const scheduledEnd = new Date(dto.scheduledEnd);

    const appointment = new Appointment(
      dto.quoteID,
      dto.orgID,
      dayKey,
      scheduledStart,
      scheduledEnd,
      dto.patient,
      dto.userId,
      dto.type,
      dto.typeId,
      dto.motive,
      dto.locationId,
      AppointmentStatus.create(dto.status),
      dto.category,
      dto.recipeID
    );

    const oldDayKey = dto.oldDayKey ? DayKey.create(dto.oldDayKey) : undefined;
    return this.appointmentRepo.update(appointment, oldDayKey);
  }
}
