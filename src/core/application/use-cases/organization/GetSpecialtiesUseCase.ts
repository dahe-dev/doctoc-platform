import { IOrganizationRepository } from '@/core/domain/repositories/IOrganizationRepository';
import type { GetOrganizationInfoDTO } from '@/core/application/dto';
import { Specialty } from '@/core/domain/entities/Specialty';

export class GetSpecialtiesUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository
  ) {}

  async execute(dto: GetOrganizationInfoDTO): Promise<Specialty[]> {
    const info = await this.orgRepo.getInfo(dto.orgID, dto.sections);
    
    return info.specialties || [];
  }
}
