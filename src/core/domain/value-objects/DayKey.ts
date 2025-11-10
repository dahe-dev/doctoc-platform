export class DayKey {
  private readonly _value: string;
  private readonly _date: Date;

  private constructor(value: string, date: Date) {
    this._value = value;
    this._date = date;
  }

  public static create(value: string): DayKey {
    // format: DD-MM-YYYY
    const parts = value.split('-');
    if (parts.length !== 3) {
      throw new Error(`Invalid day key format: ${value}. Expected DD-MM-YYYY`);
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date in day key: ${value}`);
    }
    
    return new DayKey(value, date);
  }

  public static fromDate(date: Date): DayKey {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const value = `${day}-${month}-${year}`;
    
    return new DayKey(value, date);
  }

  get value(): string {
    return this._value;
  }

  get date(): Date {
    return new Date(this._date);
  }

  public equals(other: DayKey): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}