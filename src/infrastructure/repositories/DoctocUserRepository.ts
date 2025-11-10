import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { User, type CalendarInfo } from '@/core/domain/entities/User';
import { userApiClient } from '../api/clients/UserApiClient';
import { organizationApiClient } from '../api/clients/OrganizationApiClient';

export class DoctocUserRepository implements IUserRepository {
  async findById(userId: string, orgID: string): Promise<User | null> {
    try {
      const response = await userApiClient.getUserProfile(orgID, userId, [
        'basic',
        'professional',
        'calendarInfo',
      ]);

      if (!response) {
        console.warn('[DoctocUserRepository] Response is null or undefined');
        return null;
      }

      const basic = response.basic;
      const professional = response.professional;
      const calendarInfo = response.calendarInfo || null;

      const uid = response.uid || userId;
      const firstName = basic?.profile_name || '';
      const lastName = basic?.profile_lastname || '';
      const email = basic?.profile_email || '';
      const specialty = professional?.specialty || '';
      const photo =
        basic?.profile_image || response.images?.profile_image || '';
      const gender =
        ((basic as Record<string, unknown>)?.profile_gender as string) || 'M';
      const role =
        ((response as Record<string, unknown>)?.role as string) ||
        ((professional as Record<string, unknown>)?.role as string) ||
        'doctor';

      if (!uid || !firstName) {
        console.warn(
          '[DoctocUserRepository] Missing required fields (uid or firstName)',
        );
        return null;
      }

      return new User(
        uid,
        firstName,
        lastName,
        email,
        specialty,
        calendarInfo as CalendarInfo,
        photo,
        gender,
        role,
      );
    } catch (error) {
      console.error('[DoctocUserRepository] Error finding user by id:', error);
      return null;
    }
  }

  async findAll(orgID: string): Promise<User[]> {
    try {
      const response = await organizationApiClient.getOrganizationInfo(orgID, [
        'users',
      ]);

      if (!response?.users || !Array.isArray(response.users)) {
        console.warn('No users found in organization response');
        return [];
      }

      return response.users
        .filter((user: Record<string, unknown>) => {
          return (
            user?.uid &&
            user?.name &&
            user?.role === 'doctor' &&
            user?.disabled === false
          );
        })
        .map((user: Record<string, unknown>) => {
          const fullName = (user.name || '') as string;
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          return new User(
            user.uid as string,
            firstName,
            lastName,
            user.email as string,
            user.specialty as string,
            user.calendarInfo as CalendarInfo,
            user.photo as string | undefined,
            user.gender as string,
            user.role as string,
          );
        });
    } catch (error) {
      console.error('Error finding all users:', error);
      return [];
    }
  }

  async findBySpecialty(specialty: string, orgID: string): Promise<User[]> {
    const allUsers = await this.findAll(orgID);

    if (!specialty) return allUsers;

    return allUsers.filter((user) =>
      user.specialty?.toLowerCase().includes(specialty.toLowerCase()),
    );
  }

  async updateCalendarInfo(
    userId: string,
    orgID: string,
    calendarInfo: unknown,
  ): Promise<void> {
    await userApiClient.updateUserProfile(orgID, userId, {
      calendarInfo,
    });
  }
}
