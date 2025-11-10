import { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import { Patient } from '@/core/domain/entities/Patient';
import type { GetAllPatientsDTO } from '@/core/application/dto';

export class GetAllPatientsUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository
  ) {}

  async execute(dto: GetAllPatientsDTO): Promise<Patient[]> {
    return this.patientRepo.findAll(dto.orgID, dto.limit);
  }
}
