import { BaseApiClient } from '../base/BaseApiClient';
import type { OrganizationInfoResponseDTO, LocationResponseDTO } from '@/core/application/dto/organization.dto';

export class OrganizationApiClient extends BaseApiClient {
  async getOrganizationInfo(orgID: string, sections: string[]): Promise<OrganizationInfoResponseDTO> {
    return this.post<OrganizationInfoResponseDTO>('/getOrgInfoAPIV2', {
      orgID,
      sections
    });
  }

  async getLocations(orgID: string): Promise<LocationResponseDTO[]> {
    const response = await this.post<{ sedes: LocationResponseDTO[] }>('/getOrgInfoAPIV2', {
      orgID,
      sections: ['sedes']
    });
    return response.sedes || [];
  }
}

export const organizationApiClient = new OrganizationApiClient();
