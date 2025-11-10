'use server';

import { 
  GetUserProfileUseCase,
  UpdateUserCalendarUseCase,
  SearchDoctorsUseCase 
} from '@/core/application/use-cases';
import type { 
  GetUserProfileDTO,
  UpdateCalendarInfoDTO
} from '@/core/application/dto/doctor.dto';
import { 
  getUserProfileDTO,
  updateCalendarInfoDTO
} from '@/core/application/dto/doctor.dto';
import type { GetOrganizationInfoDTO } from '@/core/application/dto/organization.dto';
import { getOrganizationInfoDTO } from '@/core/application/dto/organization.dto';
import { DoctocUserRepository } from '@/infrastructure/repositories';
import { UserMapper, type SerializedUser } from '@/core/application/mappers';
import { revalidatePath } from 'next/cache';

const userRepo = new DoctocUserRepository();

type ActionResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

export async function getUserProfile(input: GetUserProfileDTO): ActionResult<SerializedUser | null> {
  try {
    const validated = getUserProfileDTO.parse(input);
    const useCase = new GetUserProfileUseCase(userRepo);
    const profile = await useCase.execute(validated);
    
    if (!profile) {
      return {
        success: true,
        data: null
      };
    }

    return {
      success: true,
      data: UserMapper.toSerialized(profile)
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener el perfil del usuario'
    };
  }
}

export async function getDoctorById(userId: string, orgID: string): ActionResult<SerializedUser | null> {
  try {
    const useCase = new GetUserProfileUseCase(userRepo);
    const profile = await useCase.execute({ 
      action: 'get',
      uid: userId, 
      orgID, 
      type: 'user',
      sections: ['basic', 'professional', 'calendarInfo'] 
    });
    
    if (!profile) {
      return {
        success: true,
        data: null
      };
    }

    return {
      success: true,
      data: UserMapper.toSerialized(profile)
    };
  } catch (error) {
    console.error('Error getting doctor by id:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener el doctor'
    };
  }
}

export async function updateUserCalendar(input: UpdateCalendarInfoDTO): ActionResult<void> {
  try {
    const validated = updateCalendarInfoDTO.parse(input);
    const useCase = new UpdateUserCalendarUseCase(userRepo);
    await useCase.execute(validated);
    
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user calendar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el calendario'
    };
  }
}

export async function searchDoctors(input: GetOrganizationInfoDTO): ActionResult<SerializedUser[]> {
  try {
    const validated = getOrganizationInfoDTO.parse(input);
    const useCase = new SearchDoctorsUseCase(userRepo);
    const doctors = await useCase.execute(validated);
    
    return {
      success: true,
      data: UserMapper.toSerializedArray(doctors)
    };
  } catch (error) {
    console.error('Error searching doctors:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al buscar doctores'
    };
  }
}
