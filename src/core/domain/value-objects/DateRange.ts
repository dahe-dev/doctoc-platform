export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  private constructor(startDate: Date, endDate: Date) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  public static create(startDate: Date | string, endDate: Date | string): DateRange {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid dates provided');
    }
    
    if (start >= end) {
      throw new Error('Start date must be before end date');
    }
    
    return new DateRange(start, end);
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  public getDurationInMinutes(): number {
    return Math.floor((this._endDate.getTime() - this._startDate.getTime()) / (1000 * 60));
  }

  public getDurationInHours(): number {
    return this.getDurationInMinutes() / 60;
  }

  public contains(date: Date): boolean {
    return date >= this._startDate && date <= this._endDate;
  }

  public overlapsWith(other: DateRange): boolean {
    return this._startDate < other._endDate && this._endDate > other._startDate;
  }

  public isPast(): boolean {
    return this._endDate < new Date();
  }

  public isFuture(): boolean {
    return this._startDate > new Date();
  }

  public isOngoing(): boolean {
    const now = new Date();
    return this._startDate <= now && this._endDate >= now;
  }

  public equals(other: DateRange): boolean {
    return (
      this._startDate.getTime() === other._startDate.getTime() &&
      this._endDate.getTime() === other._endDate.getTime()
    );
  }
}