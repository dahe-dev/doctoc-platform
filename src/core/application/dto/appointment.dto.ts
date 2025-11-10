import { z } from 'zod';

const dayKeyRegex = /^\d{2}-\d{2}-\d{4}$/;

const baseAppointmentDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(dayKeyRegex),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  patient: z.string().min(1),
  userId: z.string().min(1),
  type: z.string().min(1),
  typeId: z.string().min(1),
  motive: z.string().min(1),
  status: z.enum(['pendiente', 'confirmada', 'completada', 'cancelada']),
  locationId: z.string().min(1),
  recipeID: z.string().default(''),
  category: z.string().default('cita'),
  personaEjecutante: z.string().min(1),
});

export const createAppointmentDTO = baseAppointmentDTO.extend({
  version: z.string().default('v2'),
});

export const updateAppointmentDTO = baseAppointmentDTO.extend({
  quoteID: z.string().min(1),
  oldDayKey: z.string().regex(dayKeyRegex).optional(),
});

export const cancelAppointmentDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(dayKeyRegex),
  userId: z.string().min(1),
  quoteID: z.string().min(1),
  cancelReason: z.string().default(''),
  personaEjecutante: z.string().min(1),
});

export const getAppointmentsByPatientDTO = z.object({
  orgID: z.string().min(1),
  patientID: z.string().min(1),
});

export const getAppointmentsByDayDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(dayKeyRegex),
});

export const getAppointmentByIdDTO = getAppointmentsByDayDTO.extend({
  citaID: z.string().min(1),
});

export const getAppointmentsByUserDayDTO = getAppointmentsByDayDTO.extend({
  userId: z.string().min(1),
});

export const getBusySlotsDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(dayKeyRegex),
  userId: z.string().optional(),
  format: z.literal('busy_ranges').default('busy_ranges'),
});

export type CreateAppointmentDTO = z.infer<typeof createAppointmentDTO>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentDTO>;
export type CancelAppointmentDTO = z.infer<typeof cancelAppointmentDTO>;
export type GetAppointmentsByPatientDTO = z.infer<typeof getAppointmentsByPatientDTO>;
export type GetAppointmentsByDayDTO = z.infer<typeof getAppointmentsByDayDTO>;
export type GetAppointmentByIdDTO = z.infer<typeof getAppointmentByIdDTO>;
export type GetAppointmentsByUserDayDTO = z.infer<typeof getAppointmentsByUserDayDTO>;
export type GetBusySlotsDTO = z.infer<typeof getBusySlotsDTO>;

export type HistoryEntry = {
  action: string;
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId: string;
};

export type AppointmentResponseDTO = {
  id: string;
  patientId: string;
  userId: string;
  date: string;
  startDate: string;
  endDate: string;
  type: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  version: string;
  locationId: string;
  history?: HistoryEntry[];
};

export type BusyRangeResponseDTO = {
  start: string;
  end: string;
};

export type CreateAppointmentResponseDTO = {
  status: 'success' | 'error';
  action: 'create';
  quote?: AppointmentResponseDTO;
  message?: string;
};

export type UpdateAppointmentResponseDTO = {
  status: 'success' | 'error';
  action: 'update';
  quote?: AppointmentResponseDTO;
  message?: string;
};

export type CancelAppointmentResponseDTO = {
  status: 'success' | 'error';
  action: 'cancel';
  message?: string;
};

export type GetAppointmentsResponseDTO = {
  success: boolean;
  appointments: AppointmentResponseDTO[];
};

export type GetBusySlotsResponseDTO = {
  success: boolean;
  busyRanges: BusyRangeResponseDTO[];
};
