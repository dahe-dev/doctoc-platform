import {
  User,
  type CalendarInfo,
  type ScheduleData,
} from '@/core/domain/entities/User';

export type SerializedUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  specialty?: string;
  photoUrl?: string;
  gender?: string;
  role?: string;
  calendarInfo?: {
    overschedule: boolean;
    configureByType: boolean;
    horarios?: Record<string, Record<string, ScheduleData>>;
    associatedTypes?: Record<string, number>;
  };
};

export class UserMapper {
  static toSerialized(user: User): SerializedUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      specialty: user.specialty,
      photoUrl: user.photoUrl,
      gender: user.gender,
      role: user.role,
      calendarInfo: user.calendarInfo,
    };
  }

  static toEntity(serialized: SerializedUser): User {
    return new User(
      serialized.id,
      serialized.firstName,
      serialized.lastName,
      serialized.email,
      serialized.specialty,
      serialized.calendarInfo as CalendarInfo | undefined,
      serialized.photoUrl,
      serialized.gender,
      serialized.role,
    );
  }

  static toSerializedArray(users: User[]): SerializedUser[] {
    return users.map((user) => UserMapper.toSerialized(user));
  }

  static toEntityArray(serializedUsers: SerializedUser[]): User[] {
    return serializedUsers.map((serialized) => UserMapper.toEntity(serialized));
  }
}
