export class Location {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly direccion?: string,
    public readonly distrito?: string,
    public readonly departamento?: string,
    public readonly pais?: string,
    public readonly correo?: string,
    public readonly celular?: {
      phoneNumber: string;
      isValidNumber: boolean;
    },
    public readonly locationCoordinates?: {
      lat: number;
      lng: number;
    },
    public readonly isDefault?: boolean
  ) {}

  get name(): string {
    return this.nombre;
  }

  get address(): string {
    return this.direccion || '';
  }

  get fullAddress(): string {
    const parts = [this.direccion, this.distrito, this.departamento, this.pais].filter(Boolean);
    return parts.join(', ');
  }
}
