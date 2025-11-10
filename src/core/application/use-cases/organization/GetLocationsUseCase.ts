import { IOrganizationRepository } from '@/core/domain/repositories/IOrganizationRepository';
import type { GetOrganizationInfoDTO } from '@/core/application/dto';
import { Location } from '@/core/domain/entities/Location';

export class GetLocationsUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository
  ) {}

  async execute(dto: GetOrganizationInfoDTO): Promise<Location[]> {
    const info = await this.orgRepo.getInfo(dto.orgID, dto.sections);
    return info.locations || [];
  }
}
