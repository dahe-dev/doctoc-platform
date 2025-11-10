'use server';

import {
  CreatePatientUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  SearchPatientUseCase,
  GetAllPatientsUseCase,
} from '@/core/application/use-cases';
import type {
  CreatePatientDTO,
  UpdatePatientDTO,
  DeletePatientDTO,
  SearchPatientDTO,
  GetAllPatientsDTO,
} from '@/core/application/dto/patient.dto';
import {
  createPatientDTO,
  updatePatientDTO,
  deletePatientDTO,
  searchPatientDTO,
  getAllPatientsDTO,
} from '@/core/application/dto/patient.dto';
import { DoctocPatientRepository } from '@/infrastructure/repositories';
import type { Patient } from '@/core/domain/entities/Patient';
import { revalidatePath } from 'next/cache';

const patientRepo = new DoctocPatientRepository();

type PatientResponse = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  documentId?: string;
  phoneNumber?: string;
  email?: string;
};

type ActionResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

export async function createPatient(
  input: CreatePatientDTO,
): ActionResult<PatientResponse> {
  try {
    const validated = createPatientDTO.parse(input);
    const useCase = new CreatePatientUseCase(patientRepo);
    const patient = await useCase.execute(validated);

    revalidatePath('/patients');

    return {
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        fullName: patient.fullName,
        documentId: patient.documentId.formatted,
        phoneNumber: patient.phoneNumber.value,
        email: patient.email?.value,
      },
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear el paciente',
    };
  }
}

export async function updatePatient(
  input: UpdatePatientDTO,
): ActionResult<PatientResponse> {
  try {
    const validated = updatePatientDTO.parse(input);
    const useCase = new UpdatePatientUseCase(patientRepo);
    const patient = await useCase.execute(validated);

    revalidatePath('/patients');

    return {
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        fullName: patient.fullName,
        documentId: patient.documentId.formatted,
        phoneNumber: patient.phoneNumber.value,
        email: patient.email?.value,
      },
    };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar el paciente',
    };
  }
}

export async function deletePatient(
  input: DeletePatientDTO,
): ActionResult<void> {
  try {
    const validated = deletePatientDTO.parse(input);
    const useCase = new DeletePatientUseCase(patientRepo);
    await useCase.execute(validated);

    revalidatePath('/patients');

    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar el paciente',
    };
  }
}

export async function searchPatients(
  input: SearchPatientDTO,
): ActionResult<Patient[]> {
  try {
    const validated = searchPatientDTO.parse(input);
    const useCase = new SearchPatientUseCase(patientRepo);
    const patients = await useCase.execute(validated);

    return {
      success: true,
      data: patients,
    };
  } catch (error) {
    console.error('Error searching patients:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al buscar pacientes',
    };
  }
}

export async function getAllPatients(
  input: GetAllPatientsDTO,
): ActionResult<Patient[]> {
  try {
    const validated = getAllPatientsDTO.parse(input);
    const useCase = new GetAllPatientsUseCase(patientRepo);
    const patients = await useCase.execute(validated);

    return {
      success: true,
      data: patients,
    };
  } catch (error) {
    console.error('Error getting all patients:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener los pacientes',
    };
  }
}
