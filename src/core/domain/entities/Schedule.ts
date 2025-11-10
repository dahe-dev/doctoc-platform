import type { TimeBlock } from './User';
import { TimeSlot } from '../value-objects/TimeSlot';

export class Schedule {
  constructor(
    public readonly locationId: string,
    public readonly typeId: string | null,
    public readonly fixedSchedule?: FixedSchedule,
    public readonly dynamicSchedules?: DynamicSchedule[]
  ) {}

  getTimeSlotsForDate(date: Date): TimeSlot[] {
    const dynamicSlots = this.getDynamicSlotsForDate(date);
    if (dynamicSlots.length > 0) {
      return dynamicSlots;
    }

    return this.getFixedSlotsForDate(date);
  }

  private getDynamicSlotsForDate(date: Date): TimeSlot[] {
    if (!this.dynamicSchedules) return [];

    const dateStr = this.formatDateISO(date);

    for (const dynamic of this.dynamicSchedules) {
      if (this.isDateInRange(dateStr, dynamic.startDate, dynamic.endDate)) {
        const blocks = dynamic.daySchedules[dateStr];
        if (blocks && blocks.length > 0) {
          return blocks.map(block => TimeSlot.create(block.start, block.end));
        }
      }
    }

    return [];
  }

  private getFixedSlotsForDate(date: Date): TimeSlot[] {
    if (!this.fixedSchedule) return [];

    const dayName = this.getDayName(date);
    const blocks = this.fixedSchedule[dayName] || [];

    return blocks.map(block => TimeSlot.create(block.start, block.end));
  }

  private getDayName(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  private formatDateISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isDateInRange(date: string, start: string, end: string): boolean {
    return date >= start && date <= end;
  }
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface FixedSchedule {
  Monday?: TimeBlock[];
  Tuesday?: TimeBlock[];
  Wednesday?: TimeBlock[];
  Thursday?: TimeBlock[];
  Friday?: TimeBlock[];
  Saturday?: TimeBlock[];
  Sunday?: TimeBlock[];
}

interface DynamicSchedule {
  id: number;
  startDate: string;
  endDate: string;
  daySchedules: Record<string, TimeBlock[]>;
}
