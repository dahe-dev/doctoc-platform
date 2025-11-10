import { z } from 'zod';

export const getOrganizationInfoDTO = z.object({
  orgID: z.string().min(1),
  sections: z.array(z.enum(['basic', 'gallery', 'sedes', 'services', 'specialties', 'users', 'stats'])),
});

export type GetOrganizationInfoDTO = z.infer<typeof getOrganizationInfoDTO>;

export type OrganizationBasicResponseDTO = {
  name: string;
  businessName?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
};

export type LocationResponseDTO = {
  id: string;
  nombre: string;
  direccion?: string;
  distrito?: string;
  departamento?: string;
  pais?: string;
  correo?: string;
  celular?: {
    phoneNumber: string;
    isValidNumber: boolean;
  };
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  default?: boolean;
  expanded?: boolean;
};

export type SpecialtyResponseDTO = {
  name: string;
  description?: string;
  photo?: string | null;
};

export type UserSummaryResponseDTO = {
  uid: string;
  name: string;
  email?: string;
  role?: string;
  specialty?: string;
  profileImage?: string;
};

export type OrganizationStatsResponseDTO = {
  totalUsers: number;
  totalPatients: number;
  totalAppointments: number;
};

export type OrganizationInfoResponseDTO = {
  success: boolean;
  basic?: OrganizationBasicResponseDTO;
  sedes?: LocationResponseDTO[];
  specialties?: Record<string, SpecialtyResponseDTO>;
  users?: Record<string, UserSummaryResponseDTO>;
  stats?: OrganizationStatsResponseDTO;
};
