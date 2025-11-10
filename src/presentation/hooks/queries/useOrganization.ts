import { useQuery } from '@tanstack/react-query';
import { 
  getOrganizationInfo, 
  getLocations, 
  getSpecialties,
  getAppointmentTypes
} from '@/app/actions/organization';
import type { GetOrganizationInfoDTO } from '@/core/application/dto/organization.dto';

export function useOrganizationInfo(params: GetOrganizationInfoDTO) {
  return useQuery({
    queryKey: ['organization', params.orgID, ...params.sections],
    queryFn: () => getOrganizationInfo(params),
    staleTime: 1000 * 60 * 10,
  });
}

export function useLocations(orgID: string) {
  return useQuery({
    queryKey: ['locations', orgID],
    queryFn: () => getLocations(orgID),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSpecialties(orgID: string, enabled = true) {
  return useQuery({
    queryKey: ['specialties', orgID],
    queryFn: () => getSpecialties(orgID),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
}

export function useAppointmentTypes(orgID: string, enabled = true) {
  return useQuery({
    queryKey: ['appointmentTypes', orgID],
    queryFn: () => getAppointmentTypes(orgID),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
}
