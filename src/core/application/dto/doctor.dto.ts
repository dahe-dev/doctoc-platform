import { z } from 'zod';

const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

export const timeBlockDTO = z.object({
  id: z.number(),
  start: z.string().regex(timeRegex),
  end: z.string().regex(timeRegex),
});

export const fixedScheduleDTO = z.object({
  Monday: z.array(timeBlockDTO).default([]),
  Tuesday: z.array(timeBlockDTO).default([]),
  Wednesday: z.array(timeBlockDTO).default([]),
  Thursday: z.array(timeBlockDTO).default([]),
  Friday: z.array(timeBlockDTO).default([]),
  Saturday: z.array(timeBlockDTO).default([]),
  Sunday: z.array(timeBlockDTO).default([]),
});

export const daySchedulesDTO = z.record(z.string(), z.array(timeBlockDTO));

export const dynamicScheduleDTO = z.object({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  daySchedules: daySchedulesDTO,
});

export const scheduleConfigDTO = z.object({
  horariesFijo: fixedScheduleDTO.optional(),
  horariesDinamico: z.array(dynamicScheduleDTO).optional(),
});

export const getUserProfileDTO = z.object({
  action: z.literal('get'),
  orgID: z.string().min(1),
  uid: z.string().min(1),
  type: z.literal('user'),
  sections: z.array(z.enum(['basic', 'professional', 'images', 'permissions', 'portalInfo', 'calendarInfo'])),
});

export const getOrganizationTypesDTO = z.object({
  action: z.literal('get'),
  orgID: z.string().min(1),
  sections: z.array(z.literal('tipos')),
});

export const updateCalendarInfoDTO = z.object({
  action: z.literal('update'),
  orgID: z.string().min(1),
  uid: z.string().min(1),
  type: z.literal('user'),
  data: z.object({
    calendarInfo: z.object({
      overschedule: z.boolean().optional(),
      configureByType: z.boolean().optional(),
      horarios: z.record(z.string(), z.record(z.string(), scheduleConfigDTO)).optional(),
      associatedTypes: z.record(z.string(), z.number()).optional(),
    }),
  }),
});

export type TimeBlockDTO = z.infer<typeof timeBlockDTO>;
export type FixedScheduleDTO = z.infer<typeof fixedScheduleDTO>;
export type DynamicScheduleDTO = z.infer<typeof dynamicScheduleDTO>;
export type ScheduleConfigDTO = z.infer<typeof scheduleConfigDTO>;
export type GetUserProfileDTO = z.infer<typeof getUserProfileDTO>;
export type GetOrganizationTypesDTO = z.infer<typeof getOrganizationTypesDTO>;
export type UpdateCalendarInfoDTO = z.infer<typeof updateCalendarInfoDTO>;

export type UserBasicInfoResponseDTO = {
  profile_name: string;
  profile_lastname: string;
  profile_email?: string;
  profile_phone?: string;
  profile_image?: string;
};

export type UserProfessionalInfoResponseDTO = {
  specialty?: string;
  medicalLicense?: string;
  yearsOfExperience?: number;
};

export type CalendarInfoResponseDTO = {
  overschedule: boolean;
  configureByType: boolean;
  horarios?: Record<string, Record<string, ScheduleConfigDTO>>;
  associatedTypes?: Record<string, number>;
};

export type UserProfileResponseDTO = {
  success: boolean;
  uid: string;
  basic?: UserBasicInfoResponseDTO;
  professional?: UserProfessionalInfoResponseDTO;
  calendarInfo?: CalendarInfoResponseDTO;
  images?: {
    profile_image?: string;
    cover_image?: string;
  };
};

export type AppointmentTypeResponseDTO = {
  id: string;
  name: string;
  description?: string;
  appointmentType: string;
  durationMinutes: number;
  price?: number;
  color?: string;
  externalVisibility: boolean;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type OrganizationTypesResponseDTO = {
  tipos: AppointmentTypeResponseDTO[];
};

export type DoctorSummaryDTO = {
  uid: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  gender: string
};
