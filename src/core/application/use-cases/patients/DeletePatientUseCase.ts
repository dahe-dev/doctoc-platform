import { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import type { DeletePatientDTO } from '@/core/application/dto';

export class DeletePatientUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository
  ) {}

  async execute(dto: DeletePatientDTO): Promise<void> {
    await this.patientRepo.delete(dto.patientID, dto.orgID);
  }
}
