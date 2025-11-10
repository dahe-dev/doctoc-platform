export class DocumentId {
  private readonly _type: string;
  private readonly _number: string;

  private constructor(type: string, number: string) {
    this._type = type;
    this._number = number;
  }

  public static create(type: string, number: string): DocumentId {
    if (!type || !number) {
      throw new Error('Document type and number are required');
    }
    
    const cleanedNumber = number.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleanedNumber.length < 5 || cleanedNumber.length > 20) {
      throw new Error(`Invalid document number: ${number}`);
    }
    
    return new DocumentId(type.toUpperCase(), cleanedNumber);
  }

  get type(): string {
    return this._type;
  }

  get number(): string {
    return this._number;
  }

  get formatted(): string {
    return `${this._type}: ${this._number}`;
  }

  public equals(other: DocumentId): boolean {
    return this._type === other._type && this._number === other._number;
  }
}