export class AppointmentStatus {
  private static readonly VALID_STATUSES = [
    'pendiente',
    'confirmada',
    'completada',
    'cancelada',
    'cancelado',
  ] as const;

  private static readonly VALID_TRANSITIONS: Record<string, string[]> = {
    pendiente: ['confirmada', 'cancelada', 'cancelado'],
    confirmada: ['completada', 'cancelada', 'cancelado'],
    completada: [],
    cancelada: [],
    cancelado: [],
  };

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value === 'cancelado' ? 'cancelada' : value;
  }

  public static create(value: string): AppointmentStatus {
    if (!AppointmentStatus.VALID_STATUSES.includes(value as typeof AppointmentStatus.VALID_STATUSES[number])) {
      throw new Error(`Estado de cita inválido: ${value}`);
    }
    return new AppointmentStatus(value);
  }

  public static pendiente(): AppointmentStatus {
    return new AppointmentStatus('pendiente');
  }

  public static confirmada(): AppointmentStatus {
    return new AppointmentStatus('confirmada');
  }

  public static completada(): AppointmentStatus {
    return new AppointmentStatus('completada');
  }

  public static cancelada(): AppointmentStatus {
    return new AppointmentStatus('cancelada');
  }

  get value(): string {
    return this._value;
  }

  public canTransitionTo(status: string): boolean {
    return AppointmentStatus.VALID_TRANSITIONS[this._value]?.includes(status) || false;
  }

  public isActive(): boolean {
    return ['pendiente', 'confirmada'].includes(this._value);
  }

  public isFinal(): boolean {
    return ['completada', 'cancelada'].includes(this._value);
  }

  public canBeModified(): boolean {
    return ['pendiente', 'confirmada'].includes(this._value);
  }

  public equals(other: AppointmentStatus): boolean {
    return this._value === other._value;
  }
}