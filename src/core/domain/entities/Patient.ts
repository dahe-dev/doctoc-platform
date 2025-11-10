import { DocumentId } from '../value-objects/DocumentId';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { Email } from '../value-objects/Email';

export class Patient {
  constructor(
    public readonly id: string,
    public readonly orgID: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly documentId: DocumentId,
    public readonly phoneNumber: PhoneNumber,
    public readonly email?: Email,
    public readonly birthDate?: Date,
    public readonly gender?: 'M' | 'F' | 'Other',
    public readonly address?: string
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get age(): number | null {
    if (!this.birthDate) return null;

    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }

    return age;
  }

  isMinor(): boolean {
    const age = this.age;
    return age !== null && age < 18;
  }
}
