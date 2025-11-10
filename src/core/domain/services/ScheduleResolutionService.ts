import { User } from '../entities/User';
import { Schedule } from '../entities/Schedule';
import type { TimeBlock } from '../entities/User';

export class ScheduleResolutionService {
  static resolveScheduleForDate(
    user: User,
    _date: Date,
    locationId: string,
    typeId?: string
  ): Schedule | null {
    const scheduleData = user.getScheduleForLocation(locationId, typeId);
    if (!scheduleData) return null;

    const actualTypeId = user.isConfiguredByType() && typeId ? typeId : null;

    return new Schedule(
      locationId,
      actualTypeId,
      scheduleData.horariesFijo,
      scheduleData.horariesDinamico
    );
  }

  static getEffectiveSchedule(
    fixedBlocks: TimeBlock[],
    dynamicBlocks: TimeBlock[]
  ): TimeBlock[] {
    if (dynamicBlocks.length > 0) {
      return dynamicBlocks;
    }
    return fixedBlocks;
  }
}
