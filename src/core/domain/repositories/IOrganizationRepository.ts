import type { Organization } from '../entities/Organization';
import type { Location } from '../entities/Location';
import type { Specialty } from '../entities/Specialty';

export interface IOrganizationRepository {
  getInfo(orgID: string, sections: string[]): Promise<OrganizationInfo>;
}

export interface OrganizationInfo {
  basic?: Organization;
  locations?: Location[];
  specialties?: Specialty[];
  users?: UserBasic[];
}

interface UserBasic {
  uid: string;
  firstName: string;
  lastName: string;
  specialty?: string;
}
