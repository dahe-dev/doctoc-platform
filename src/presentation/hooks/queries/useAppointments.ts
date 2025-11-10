import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createAppointment, 
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDay,
  getBusySlots,
  getAvailability 
} from '@/app/actions/appointments';
import type { 
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  CancelAppointmentDTO,
  GetAppointmentsByPatientDTO,
  GetAppointmentsByDayDTO,
  GetBusySlotsDTO
} from '@/core/application/dto/appointment.dto';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentDTO) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['busy-slots'] });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAppointmentDTO) => updateAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelAppointmentDTO) => cancelAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

export function useAppointmentsByPatient(params: GetAppointmentsByPatientDTO, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'patient', params.patientID],
    queryFn: () => getAppointmentsByPatient(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAppointmentsByDay(params: GetAppointmentsByDayDTO, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'day', params.dayKey],
    queryFn: () => getAppointmentsByDay(params),
    enabled,
    staleTime: 1000 * 60 * 1,
  });
}

export function useBusySlots(params: GetBusySlotsDTO, enabled = true) {
  return useQuery({
    queryKey: ['busy-slots', params.userId, params.dayKey],
    queryFn: () => getBusySlots(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAvailability(params: GetBusySlotsDTO, enabled = true) {
  return useQuery({
    queryKey: ['availability', params.userId, params.dayKey, params.userId],
    queryFn: () => getAvailability(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
