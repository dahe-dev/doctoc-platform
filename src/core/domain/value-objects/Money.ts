export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  public static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    
    if (!currency || currency.length !== 3) {
      throw new Error('Invalid currency code');
    }
    
    // 2 decimal 
    const roundedAmount = Math.round(amount * 100) / 100;
    
    return new Money(roundedAmount, currency.toUpperCase());
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get formatted(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency,
    }).format(this._amount);
  }

  public add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return Money.create(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return Money.create(this._amount - other._amount, this._currency);
  }

  public multiply(factor: number): Money {
    return Money.create(this._amount * factor, this._currency);
  }

  public equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  public isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount > other._amount;
  }

  public isLessThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount < other._amount;
  }
}