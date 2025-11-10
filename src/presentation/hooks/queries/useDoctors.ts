import { useQuery } from '@tanstack/react-query';
import {
  searchDoctors,
  getDoctorById,
  getUserProfile,
} from '@/app/actions/doctors';
import type { GetUserProfileDTO } from '@/core/application/dto/doctor.dto';
import type { GetOrganizationInfoDTO } from '@/core/application/dto/organization.dto';

export function useDoctors(params: GetOrganizationInfoDTO) {
  return useQuery({
    queryKey: ['doctors', params.orgID],
    queryFn: () => searchDoctors(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDoctor(userId: string, orgID: string, enabled = true) {
  return useQuery({
    queryKey: ['doctor', userId],
    queryFn: () => getDoctorById(userId, orgID),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserProfile(params: GetUserProfileDTO, enabled = true) {
  return useQuery({
    queryKey: ['user-profile', params.uid, params.orgID],
    queryFn: () => getUserProfile(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
