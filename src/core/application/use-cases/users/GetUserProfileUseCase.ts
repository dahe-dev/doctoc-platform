import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { User } from '@/core/domain/entities/User';
import type { GetUserProfileDTO } from '@/core/application/dto';

export class GetUserProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: GetUserProfileDTO): Promise<User | null> {
    return this.userRepo.findById(dto.uid, dto.orgID);
  }
}
