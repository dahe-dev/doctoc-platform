import { IOrganizationRepository, OrganizationInfo } from '@/core/domain/repositories/IOrganizationRepository';
import type { GetOrganizationInfoDTO } from '@/core/application/dto';

export class GetOrganizationInfoUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository
  ) {}

  async execute(dto: GetOrganizationInfoDTO): Promise<OrganizationInfo> {
    return this.orgRepo.getInfo(dto.orgID, dto.sections);
  }
}
