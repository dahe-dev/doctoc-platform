import type { IOrganizationRepository, OrganizationInfo } from '@/core/domain/repositories/IOrganizationRepository';
import { Organization } from '@/core/domain/entities/Organization';
import { Location } from '@/core/domain/entities/Location';
import { Specialty } from '@/core/domain/entities/Specialty';
import { organizationApiClient } from '../api/clients/OrganizationApiClient';

export class DoctocOrganizationRepository implements IOrganizationRepository {
  async getInfo(orgID: string, sections: string[]): Promise<OrganizationInfo> {
    const response = await organizationApiClient.getOrganizationInfo(orgID, sections);

    return {
      basic: response.basic ? new Organization(
        orgID,
        response.basic.name || '',
        response.basic.businessName,
        response.basic.taxId,
        response.basic.address,
        response.basic.phone,
        response.basic.email
      ) : undefined,
      locations: response.sedes ? response.sedes.map(loc => new Location(
        loc.id,
        loc.nombre,
        loc.direccion,
        loc.distrito,
        loc.departamento,
        loc.pais,
        loc.correo,
        loc.celular,
        loc.locationCoordinates,
        loc.default
      )) : undefined,
      specialties: response.specialties ? Object.values(response.specialties).map(spec => new Specialty(
        spec.name,
        spec.description,
        spec.photo || undefined
      )) : undefined,
      users: response.users ? Object.values(response.users).map(user => ({
        uid: user.uid,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        specialty: user.specialty,
      })) : undefined
    };
  }
}
