import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getBusySlots } from '@/app/actions';
import type { GetBusySlotsDTO } from '@/core/application/dto/appointment.dto';

export function useDoctorProfile(doctorId: string, orgID: string, enabled = true) {
  return useQuery({
    queryKey: ['doctor', 'profile', doctorId],
    queryFn: () => getUserProfile({ 
      action: 'get',
      uid: doctorId, 
      orgID, 
      type: 'user',
      sections: ['basic', 'professional', 'calendarInfo'] 
    }),
    enabled: enabled && !!doctorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDoctorAvailability(params: GetBusySlotsDTO, enabled = true) {
  return useQuery({
    queryKey: ['doctor-availability', params.userId, params.dayKey],
    queryFn: () => getBusySlots(params),
    enabled: enabled && !!params.userId && !!params.dayKey,
    staleTime: 1000 * 60 * 1,
  });
}
