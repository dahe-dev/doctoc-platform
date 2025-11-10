import { BaseApiClient } from '../base/BaseApiClient';
import type { UserProfileResponseDTO, OrganizationTypesResponseDTO } from '@/core/application/dto/doctor.dto';

export class UserApiClient extends BaseApiClient {
  async getUserProfile(orgID: string, uid: string, sections: string[]): Promise<UserProfileResponseDTO> {
    return this.post<UserProfileResponseDTO>('/manageUserInfoAPIV2', {
      action: 'get',
      orgID,
      uid,
      type: 'user',
      sections
    });
  }

  async updateUserProfile(orgID: string, uid: string, data: unknown): Promise<UserProfileResponseDTO> {
    return this.post<UserProfileResponseDTO>('/manageUserInfoAPIV2', {
      action: 'update',
      orgID,
      uid,
      type: 'user',
      data
    });
  }

  async getAppointmentTypes(orgID: string): Promise<OrganizationTypesResponseDTO> {
    return this.post<OrganizationTypesResponseDTO>('/manageUserInfoAPIV2', {
      action: 'get',
      orgID,
      sections: ['tipos']
    });
  }
}

export const userApiClient = new UserApiClient();
