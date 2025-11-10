import { IAppointmentRepository } from '@/core/domain/repositories/IAppointmentRepository';
import { Appointment } from '@/core/domain/entities/Appointment';
import type { GetAppointmentsByPatientDTO } from '@/core/application/dto';

export class GetAppointmentsByPatientUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: GetAppointmentsByPatientDTO): Promise<Appointment[]> {
    return this.appointmentRepo.findByPatient(dto.patientID, dto.orgID);
  }
}
