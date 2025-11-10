export class AppointmentType {
  private static readonly VALID_TYPES = [
    'Consulta',
    'Teleconsulta',
    'Procedimiento',
    'Cirugía',
    'Control',
    'Emergencia',
    'Laboratorio',
    'Imagenología',
  ] as const;

  private readonly _value: string;
  private readonly _duration: number; //  minutes

  private constructor(value: string, duration: number) {
    this._value = value;
    this._duration = duration;
  }

  public static create(value: string, duration?: number): AppointmentType {
    if (!AppointmentType.VALID_TYPES.includes(value as typeof AppointmentType.VALID_TYPES[number])) {
      throw new Error(`Invalid appointment type: ${value}`);
    }
    
    const defaultDurations: Record<string, number> = {
      Consulta: 30,
      Teleconsulta: 20,
      Procedimiento: 60,
      Cirugía: 120,
      Control: 15,
      Emergencia: 30,
      Laboratorio: 15,
      Imagenología: 30,
    };
    
    return new AppointmentType(value, duration || defaultDurations[value] || 30);
  }

  get value(): string {
    return this._value;
  }

  get defaultDuration(): number {
    return this._duration;
  }

  public requiresPreparation(): boolean {
    return ['Cirugía', 'Procedimiento', 'Laboratorio'].includes(this._value);
  }

  public isRemote(): boolean {
    return this._value === 'Teleconsulta';
  }

  public equals(other: AppointmentType): boolean {
    return this._value === other._value;
  }
}