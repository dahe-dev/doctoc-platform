import { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import { Patient } from '@/core/domain/entities/Patient';
import type { SearchPatientDTO } from '@/core/application/dto';

export class SearchPatientUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository
  ) {}

  async execute(dto: SearchPatientDTO): Promise<Patient[]> {
    return this.patientRepo.search(dto.type, dto.text, dto.orgID, dto.limit);
  }
}
