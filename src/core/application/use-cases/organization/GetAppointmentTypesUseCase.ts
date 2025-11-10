import type { AppointmentTypeResponseDTO } from '@/core/application/dto';

export class GetAppointmentTypesUseCase {
  async execute(orgID: string): Promise<AppointmentTypeResponseDTO[]> {
    const { userApiClient } = await import('@/infrastructure/api/clients/UserApiClient');
    const response = await userApiClient.getAppointmentTypes(orgID);
    return response.tipos || [];
  }
}
