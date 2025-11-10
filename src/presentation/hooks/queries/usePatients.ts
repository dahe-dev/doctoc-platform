import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createPatient, 
  updatePatient,
  deletePatient,
  searchPatients,
  getAllPatients 
} from '@/app/actions/patients';
import type { 
  CreatePatientDTO,
  UpdatePatientDTO,
  DeletePatientDTO,
  SearchPatientDTO,
  GetAllPatientsDTO
} from '@/core/application/dto/patient.dto';

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientDTO) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientDTO) => updatePatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeletePatientDTO) => deletePatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

export function useSearchPatients(params: SearchPatientDTO, enabled = true) {
  return useQuery({
    queryKey: ['patients', 'search', params.type, params.text],
    queryFn: () => searchPatients(params),
    enabled: enabled && params.text.length > 0,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllPatients(params: GetAllPatientsDTO, enabled = true) {
  return useQuery({
    queryKey: ['patients', 'all', params.orgID],
    queryFn: () => getAllPatients(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
