export class PhoneNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): PhoneNumber {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length < 7 || cleaned.length > 15) {
      throw new Error(`Invalid phone number: ${value}`);
    }
    
    return new PhoneNumber(cleaned);
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    if (this._value.length === 10) {
      return `(${this._value.slice(0, 3)}) ${this._value.slice(3, 6)}-${this._value.slice(6)}`;
    }
    return this._value;
  }

  public equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }
}