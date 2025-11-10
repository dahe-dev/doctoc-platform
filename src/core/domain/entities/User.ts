export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email?: string,
    public readonly specialty?: string,
    public readonly calendarInfo?: CalendarInfo,
    public readonly photoUrl?: string,
    public readonly gender?: string,
    public readonly role?: string,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  allowsOverbooking(): boolean {
    return this.calendarInfo?.overschedule ?? false;
  }

  isConfiguredByType(): boolean {
    return this.calendarInfo?.configureByType ?? false;
  }

  getAssociatedDuration(typeId: string): number {
    return this.calendarInfo?.associatedTypes?.[typeId] ?? 30;
  }

  getScheduleForLocation(locationId: string, typeId?: string): ScheduleData | null {
    if (!this.calendarInfo?.horarios) return null;

    const locationSchedules = this.calendarInfo.horarios[locationId];
    if (!locationSchedules) return null;

    const key = this.isConfiguredByType() && typeId ? typeId : 'default';
    return locationSchedules[key] || null;
  }
}

export interface CalendarInfo {
  overschedule: boolean;
  configureByType: boolean;
  horarios?: Record<string, Record<string, ScheduleData>>;
  associatedTypes?: Record<string, number>;
  anticipationHours?: number;
  customPrices?: Record<string, unknown>;
  exeptionsBlock?: unknown[];
  paymentMethods?: Record<string, unknown>;
  visibility?: {
    external: boolean;
    internal: boolean;
  };
  noAppointmentsMessage?: string;
}

export interface TimeBlock {
  id: number;
  start: string;
  end: string;
}

export interface ScheduleData {
  horariesFijo?: {
    Monday?: TimeBlock[];
    Tuesday?: TimeBlock[];
    Wednesday?: TimeBlock[];
    Thursday?: TimeBlock[];
    Friday?: TimeBlock[];
    Saturday?: TimeBlock[];
    Sunday?: TimeBlock[];
  };
  horariesDinamico?: Array<{
    id: number;
    startDate: string;
    endDate: string;
    daySchedules: Record<string, TimeBlock[]>;
  }>;
}
