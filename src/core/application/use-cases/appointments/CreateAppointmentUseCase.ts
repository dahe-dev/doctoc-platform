import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import { AppointmentStatus } from '@/core/domain/value-objects/AppointmentStatus';
import { DayKey } from '@/core/domain/value-objects/DayKey';
import { TimeSlot } from '@/core/domain/value-objects/TimeSlot';
import type { CreateAppointmentDTO } from '@/core/application/dto';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<Appointment> {
    await this.validateUser(dto.userId, dto.orgID);
    
    const dayKey = DayKey.create(dto.dayKey);
    const scheduledStart = new Date(dto.scheduledStart);
    const scheduledEnd = new Date(dto.scheduledEnd);
    
    await this.validateAvailability(dto.userId, dayKey, scheduledStart, scheduledEnd, dto.orgID);

    const appointment = this.buildAppointment(dto, dayKey, scheduledStart, scheduledEnd);
    return this.appointmentRepo.create(appointment);
  }

  private async validateUser(userId: string, orgID: string): Promise<void> {
    const user = await this.userRepo.findById(userId, orgID);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  }

  private async validateAvailability(
    userId: string,
    dayKey: DayKey,
    start: Date,
    end: Date,
    orgID: string
  ): Promise<void> {
    const user = await this.userRepo.findById(userId, orgID);
    if (!user) return;

    const requestedSlot = this.createTimeSlot(start, end);
    const existingAppointments = await this.appointmentRepo.findByUserAndDay(userId, dayKey, orgID);

    if (!user.calendarInfo?.overschedule) {
      const hasConflict = existingAppointments.some(apt => {
        const aptSlot = this.createTimeSlot(apt.scheduledStart, apt.scheduledEnd);
        return requestedSlot.overlapsWith(aptSlot);
      });

      if (hasConflict) {
        throw new Error('El horario solicitado no está disponible');
      }
    }
  }

  private buildAppointment(
    dto: CreateAppointmentDTO,
    dayKey: DayKey,
    scheduledStart: Date,
    scheduledEnd: Date
  ): Appointment {
    return new Appointment(
      '',
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
  }

  private createTimeSlot(start: Date, end: Date): TimeSlot {
    const format = (date: Date) => 
      `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return TimeSlot.create(format(start), format(end));
  }
}
