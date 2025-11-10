export class TimeSlot {
  private readonly _startTime: string; // HH:MM format
  private readonly _endTime: string;   // HH:MM format

  private constructor(startTime: string, endTime: string) {
    this._startTime = startTime;
    this._endTime = endTime;
  }

  public static create(startTime: string, endTime: string): TimeSlot {
    if (!TimeSlot.isValidTime(startTime) || !TimeSlot.isValidTime(endTime)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
    
    if (TimeSlot.timeToMinutes(startTime) >= TimeSlot.timeToMinutes(endTime)) {
      throw new Error('Start time must be before end time');
    }
    
    return new TimeSlot(startTime, endTime);
  }

  private static isValidTime(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(time);
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  get startTime(): string {
    return this._startTime;
  }

  get endTime(): string {
    return this._endTime;
  }

  get durationInMinutes(): number {
    return TimeSlot.timeToMinutes(this._endTime) - TimeSlot.timeToMinutes(this._startTime);
  }

  public overlapsWith(other: TimeSlot): boolean {
    const thisStart = TimeSlot.timeToMinutes(this._startTime);
    const thisEnd = TimeSlot.timeToMinutes(this._endTime);
    const otherStart = TimeSlot.timeToMinutes(other._startTime);
    const otherEnd = TimeSlot.timeToMinutes(other._endTime);
    
    return thisStart < otherEnd && thisEnd > otherStart;
  }

  public equals(other: TimeSlot): boolean {
    return this._startTime === other._startTime && this._endTime === other._endTime;
  }
}