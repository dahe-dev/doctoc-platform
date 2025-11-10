import { z } from 'zod';

const patientDataDTO = z.object({
  names: z.string().min(1),
  surnames: z.string().min(1),
  dni: z.string().min(1),
  birth_date: z.string().optional(),
  gender: z.enum(['Masculino', 'Femenino']).optional(),
  phone: z.string().min(1),
  mail: z.string().email().optional(),
});

export const createPatientDTO = z.object({
  action: z.literal('create'),
  orgID: z.string().min(1),
  names: z.string().min(1),
  surnames: z.string().min(1),
  dni: z.string().min(1),
  birth_date: z.string(),
  gender: z.enum(['Masculino', 'Femenino']),
  phone: z.string().min(1),
  mail: z.string().email(),
});

export const updatePatientDTO = z.object({
  orgID: z.string().min(1),
  action: z.literal('update'),
  patientID: z.string().min(1),
  patientData: patientDataDTO.partial(),
});

export const deletePatientDTO = z.object({
  orgID: z.string().min(1),
  action: z.literal('delete'),
  patientID: z.string().min(1),
});

export const searchPatientDTO = z.object({
  orgID: z.string().min(1),
  action: z.literal('search'),
  type: z.enum(['nombre', 'dni', 'telefono', 'pasaporte', 'cedula_identidad', 'carnet_extranjeria', 'otro', 'id']),
  text: z.string().min(1),
  limit: z.number().min(1).max(100).default(10),
});

export const getAllPatientsDTO = z.object({
  orgID: z.string().min(1),
  action: z.literal('getAll'),
  limit: z.number().min(1).max(100).optional(),
  startAfter: z.string().optional(),
});

export type CreatePatientDTO = z.infer<typeof createPatientDTO>;
export type UpdatePatientDTO = z.infer<typeof updatePatientDTO>;
export type DeletePatientDTO = z.infer<typeof deletePatientDTO>;
export type SearchPatientDTO = z.infer<typeof searchPatientDTO>;
export type GetAllPatientsDTO = z.infer<typeof getAllPatientsDTO>;

export type PatientResponseDTO = {
  id: string;
  uid?: string;
  names: string;
  surnames: string;
  dni: string;
  birth_date?: string;
  gender?: string;
  phone: string;
  mail?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SearchPatientsResponseDTO = {
  success: boolean;
  patients: PatientResponseDTO[];
  total: number;
};

export type CreatePatientResponseDTO = {
  status: string;
  action: string;
  patient_id: string;
  message: string;
};

export type UpdatePatientResponseDTO = {
  success: boolean;
  patient?: PatientResponseDTO;
  message?: string;
};

export type DeletePatientResponseDTO = {
  success: boolean;
  message?: string;
};
