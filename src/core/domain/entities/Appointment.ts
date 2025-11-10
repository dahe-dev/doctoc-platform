import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import { DayKey } from '../value-objects/DayKey';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly orgID: string,
    public readonly dayKey: DayKey,
    public readonly scheduledStart: Date,
    public readonly scheduledEnd: Date,
    public readonly patientId: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly typeId: string,
    public readonly motive: string,
    public readonly locationId: string,
    public readonly status: AppointmentStatus,
    public readonly category: string = 'cita',
    public readonly recipeID?: string,
    public readonly history?: AppointmentHistoryEntry[]
  ) {}

  get durationInMinutes(): number {
    return Math.floor((this.scheduledEnd.getTime() - this.scheduledStart.getTime()) / 60000);
  }

  canBeModified(): boolean {
    return this.status.canBeModified();
  }

  canBeCancelled(): boolean {
    return this.status.isActive();
  }

  overlapsWith(other: Appointment): boolean {
    if (this.userId !== other.userId) return false;
    if (!this.dayKey.equals(other.dayKey)) return false;

    const thisStart = this.scheduledStart.getTime();
    const thisEnd = this.scheduledEnd.getTime();
    const otherStart = other.scheduledStart.getTime();
    const otherEnd = other.scheduledEnd.getTime();

    return thisStart < otherEnd && thisEnd > otherStart;
  }

  isInPast(): boolean {
    return this.scheduledStart.getTime() < Date.now();
  }

  changeStatus(newStatus: AppointmentStatus): Appointment {
    if (!this.status.canTransitionTo(newStatus.value)) {
      throw new Error(`No se puede cambiar de ${this.status.value} a ${newStatus.value}`);
    }

    return new Appointment(
      this.id,
      this.orgID,
      this.dayKey,
      this.scheduledStart,
      this.scheduledEnd,
      this.patientId,
      this.userId,
      this.type,
      this.typeId,
      this.motive,
      this.locationId,
      newStatus,
      this.category,
      this.recipeID,
      this.history
    );
  }
}

export interface AppointmentHistoryEntry {
  action: string;
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId: string;
}
