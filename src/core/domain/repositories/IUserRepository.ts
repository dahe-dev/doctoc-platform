import type { User, CalendarInfo } from '../entities/User';

export interface IUserRepository {
  findById(userId: string, orgID: string): Promise<User | null>;
  findAll(orgID: string): Promise<User[]>;
  findBySpecialty(specialty: string, orgID: string): Promise<User[]>;
  updateCalendarInfo(userId: string, orgID: string, calendarInfo: CalendarInfo): Promise<void>;
}
