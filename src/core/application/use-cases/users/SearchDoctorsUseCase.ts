import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { User } from '@/core/domain/entities/User';
import type { GetOrganizationInfoDTO } from '@/core/application/dto';

export class SearchDoctorsUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: GetOrganizationInfoDTO): Promise<User[]> {
    if (!dto.sections.includes('users')) {
      return [];
    }

    const users = await this.userRepo.findAll(dto.orgID);
    return users;
  }
}
