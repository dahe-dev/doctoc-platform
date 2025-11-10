'use server';

import { 
  GetOrganizationInfoUseCase,
  GetLocationsUseCase,
  GetSpecialtiesUseCase,
  GetAppointmentTypesUseCase
} from '@/core/application/use-cases';
import type { GetOrganizationInfoDTO } from '@/core/application/dto/organization.dto';
import { getOrganizationInfoDTO } from '@/core/application/dto/organization.dto';
import { DoctocOrganizationRepository } from '@/infrastructure/repositories';
import { SpecialtyMapper, LocationMapper, type SerializedSpecialty, type SerializedLocation } from '@/core/application/mappers';
import type { OrganizationInfo } from '@/core/domain/repositories/IOrganizationRepository';
import type { AppointmentTypeResponseDTO } from '@/core/application/dto/doctor.dto';

const orgRepo = new DoctocOrganizationRepository();

type ActionResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

export async function getOrganizationInfo(
  input: GetOrganizationInfoDTO
): ActionResult<OrganizationInfo> {
  try {
    const validated = getOrganizationInfoDTO.parse(input);
    
    const useCase = new GetOrganizationInfoUseCase(orgRepo);
    const info = await useCase.execute(validated);
    
    return {
      success: true,
      data: info
    };
  } catch (error) {
    console.error('Error al obtener información de la organización:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener la información de la organización'
    };
  }
}

export async function getLocations(orgID: string): ActionResult<SerializedLocation[]> {
  try {
    const useCase = new GetLocationsUseCase(orgRepo);
    const locations = await useCase.execute({ orgID, sections: ['sedes'] });
    
    const serialized = LocationMapper.toSerializedArray(locations);
    
    return {
      success: true,
      data: serialized
    };
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener las sedes'
    };
  }
}

export async function getSpecialties(orgID: string): ActionResult<SerializedSpecialty[]> {
  try {
    const useCase = new GetSpecialtiesUseCase(orgRepo);
    const specialties = await useCase.execute({ orgID, sections: ['specialties'] });
    
    const serialized = SpecialtyMapper.toSerializedArray(specialties);
    
    return {
      success: true,
      data: serialized
    };
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener las especialidades'
    };
  }
}

export async function getAppointmentTypes(orgID: string): ActionResult<AppointmentTypeResponseDTO[]> {
  try {
    const useCase = new GetAppointmentTypesUseCase();
    const types = await useCase.execute(orgID);
    
    return {
      success: true,
      data: types
    };
  } catch (error) {
    console.error('Error al obtener tipos de cita:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener los tipos de cita'
    };
  }
}
