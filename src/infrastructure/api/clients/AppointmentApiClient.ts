import { BaseApiClient } from '../base/BaseApiClient';
import type { 
  AppointmentResponseDTO,
  CreateAppointmentResponseDTO,
  UpdateAppointmentResponseDTO,
  CancelAppointmentResponseDTO,
  GetAppointmentsResponseDTO,
  GetBusySlotsResponseDTO
} from '@/core/application/dto/appointment.dto';

export class AppointmentApiClient extends BaseApiClient {
  async manageAppointment(data: Record<string, unknown>): Promise<CreateAppointmentResponseDTO | UpdateAppointmentResponseDTO | CancelAppointmentResponseDTO> {
    return this.post('/manageQuotesAPIV2', data);
  }

  async getAppointmentsByDay(orgID: string, dayKey: string): Promise<GetAppointmentsResponseDTO> {
    return this.post<GetAppointmentsResponseDTO>('/getDayQuotesAPIV2', {
      orgID,
      dayKey
    });
  }

  async getAppointmentsByPatient(orgID: string, patientID: string): Promise<GetAppointmentsResponseDTO> {
    const response = await this.post<{ status: string; total: number; quotes: Array<Record<string, unknown>> }>('/getPatientQuoteAPIV2', {
      orgID,
      patientID
    });
    
    return {
      success: response.status === 'success',
      appointments: (response.quotes || []) as unknown as AppointmentResponseDTO[]
    };
  }

  async getAppointmentById(orgID: string, dayKey: string, citaID: string): Promise<AppointmentResponseDTO> {
    return this.post<AppointmentResponseDTO>('/getQuoteByIdAPIV2', {
      orgID,
      dayKey,
      citaID
    });
  }

  async getBusySlots(orgID: string, dayKey: string, userId?: string): Promise<GetBusySlotsResponseDTO> {
    const response = await this.post<{ status: string; total: number; busy_ranges: Array<{ start: string; end: string }> }>('/getDayQuotesAPIV2', {
      orgID,
      dayKey,
      userId,
      format: 'busy_ranges'
    });
    
    return {
      success: response.status === 'success',
      busyRanges: response.busy_ranges || []
    };
  }
}

export const appointmentApiClient = new AppointmentApiClient();
