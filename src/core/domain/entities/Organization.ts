export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly businessName?: string,
    public readonly taxId?: string,
    public readonly address?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly logo?: string
  ) {}

  get displayName(): string {
    return this.businessName || this.name;
  }
}
