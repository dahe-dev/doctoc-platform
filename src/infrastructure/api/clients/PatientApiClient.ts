import { BaseApiClient } from '../base/BaseApiClient';
import type { 
  CreatePatientResponseDTO,
  UpdatePatientResponseDTO,
  DeletePatientResponseDTO 
} from '@/core/application/dto/patient.dto';

export class PatientApiClient extends BaseApiClient {
  async createPatient(data: Record<string, unknown>): Promise<CreatePatientResponseDTO> {
    return this.post<CreatePatientResponseDTO>('/managePatientsAPIV2', {
      action: 'create',
      ...data
    });
  }

  async updatePatient(data: Record<string, unknown>): Promise<UpdatePatientResponseDTO> {
    return this.post<UpdatePatientResponseDTO>('/managePatientsAPIV2', {
      action: 'update',
      ...data
    });
  }

  async deletePatient(data: Record<string, unknown>): Promise<DeletePatientResponseDTO> {
    return this.post<DeletePatientResponseDTO>('/managePatientsAPIV2', {
      action: 'delete',
      ...data
    });
  }

  async searchPatient(data: Record<string, unknown>): Promise<unknown> {
    return this.post<unknown>('/managePatientsAPIV2', {
      action: 'search',
      ...data
    });
  }

  async getPatients(data: Record<string, unknown>): Promise<unknown> {
    return this.post<unknown>('/managePatientsAPIV2', {
      action: 'get',
      ...data
    });
  }
}

export const patientApiClient = new PatientApiClient();
