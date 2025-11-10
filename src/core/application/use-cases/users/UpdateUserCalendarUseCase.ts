import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
// import { User } from '@/core/domain/entities/User';
import type { UpdateCalendarInfoDTO } from '@/core/application/dto';

export class UpdateUserCalendarUseCase {
  constructor(
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: UpdateCalendarInfoDTO): Promise<void> {
    const user = await this.userRepo.findById(dto.uid, dto.orgID);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const calendarInfo = {
      ...dto.data.calendarInfo,
      overschedule: dto.data.calendarInfo.overschedule ?? false,
      configureByType: dto.data.calendarInfo.configureByType ?? false,
    };
    await this.userRepo.updateCalendarInfo(dto.uid, dto.orgID, calendarInfo);
  }
}
