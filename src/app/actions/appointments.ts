'use server';

import { 
  CreateAppointmentUseCase,
  UpdateAppointmentUseCase,
  CancelAppointmentUseCase,
  GetAppointmentsByPatientUseCase,
  GetAppointmentsByDayUseCase,
  GetBusySlotsUseCase
} from '@/core/application/use-cases';
import type { 
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  CancelAppointmentDTO,
  GetAppointmentsByPatientDTO,
  GetAppointmentsByDayDTO,
  GetBusySlotsDTO
} from '@/core/application/dto/appointment.dto';
import { 
  createAppointmentDTO,
  updateAppointmentDTO,
  cancelAppointmentDTO,
  getAppointmentsByPatientDTO,
  getAppointmentsByDayDTO,
  getBusySlotsDTO
} from '@/core/application/dto/appointment.dto';
import { DoctocAppointmentRepository, DoctocUserRepository } from '@/infrastructure/repositories';
import { AppointmentMapper, type SerializedAppointment } from '@/core/application/mappers';
import { revalidatePath } from 'next/cache';

const appointmentRepo = new DoctocAppointmentRepository();
const userRepo = new DoctocUserRepository();

type AppointmentResponse = {
  id: string;
  dayKey: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status: string;
};

type ActionResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

export async function createAppointment(input: CreateAppointmentDTO): ActionResult<AppointmentResponse> {
  try {
    const validated = createAppointmentDTO.parse(input);
    
    const useCase = new CreateAppointmentUseCase(appointmentRepo, userRepo);
    
    const appointment = await useCase.execute(validated);
    

    revalidatePath('/appointments');
    revalidatePath('/dashboard');
    
    return {
      success: true,
      data: {
        id: appointment.id,
        dayKey: appointment.dayKey.value,
        scheduledStart: appointment.scheduledStart,
        scheduledEnd: appointment.scheduledEnd,
        status: appointment.status.value
      }
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear la cita'
    };
  }
}

export async function updateAppointment(input: UpdateAppointmentDTO): ActionResult<AppointmentResponse> {
  try {
    const validated = updateAppointmentDTO.parse(input);
    const useCase = new UpdateAppointmentUseCase(appointmentRepo);
    const appointment = await useCase.execute(validated);
    
    revalidatePath('/appointments');
    revalidatePath('/dashboard');
    
    return {
      success: true,
      data: {
        id: appointment.id,
        dayKey: appointment.dayKey.value,
        scheduledStart: appointment.scheduledStart,
        scheduledEnd: appointment.scheduledEnd,
        status: appointment.status.value
      }
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar la cita'
    };
  }
}

export async function cancelAppointment(input: CancelAppointmentDTO): ActionResult<void> {
  try {
    const validated = cancelAppointmentDTO.parse(input);
    const useCase = new CancelAppointmentUseCase(appointmentRepo);
    await useCase.execute(validated);
    
    revalidatePath('/appointments');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error canceling appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cancelar la cita'
    };
  }
}

export async function getAppointmentsByPatient(input: GetAppointmentsByPatientDTO): ActionResult<SerializedAppointment[]> {
  try {
    const validated = getAppointmentsByPatientDTO.parse(input);
    const useCase = new GetAppointmentsByPatientUseCase(appointmentRepo);
    const appointments = await useCase.execute(validated);
    
    const plainAppointments = AppointmentMapper.toSerializedArray(appointments);
    
    return {
      success: true,
      data: plainAppointments
    };
  } catch (error) {
    console.error('Error getting appointments by patient:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener las citas'
    };
  }
}

export async function getAppointmentsByDay(input: GetAppointmentsByDayDTO): ActionResult<SerializedAppointment[]> {
  try {
    const validated = getAppointmentsByDayDTO.parse(input);
    const useCase = new GetAppointmentsByDayUseCase(appointmentRepo);
    const appointments = await useCase.execute(validated);
    
    const plainAppointments = AppointmentMapper.toSerializedArray(appointments);
    
    return {
      success: true,
      data: plainAppointments
    };
  } catch (error) {
    console.error('Error getting appointments by day:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener las citas del día'
    };
  }
}

type BusySlotResponse = {
  start: string;
  end: string;
};

export async function getBusySlots(input: GetBusySlotsDTO): ActionResult<{ busyRanges: BusySlotResponse[] }> {
  try {
    const validated = getBusySlotsDTO.parse(input);
    const useCase = new GetBusySlotsUseCase(appointmentRepo);
    const result = await useCase.execute(validated);
    
    const mapped = result.map(slot => ({
      start: slot.startTime,
      end: slot.endTime
    }));
    return {
      success: true,
      data: {
        busyRanges: mapped
      }
    };
  } catch (error) {
    console.error('Error getting busy slots:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener horarios ocupados'
    };
  }
}

export async function getAvailability(input: GetBusySlotsDTO): ActionResult<{ busyRanges: BusySlotResponse[] }> {
  try {
    const validated = getBusySlotsDTO.parse(input);
    const useCase = new GetBusySlotsUseCase(appointmentRepo);
    const busySlots = await useCase.execute(validated);
    
    return {
      success: true,
      data: {
        busyRanges: busySlots.map(slot => ({
          start: slot.startTime,
          end: slot.endTime
        }))
      }
    };
  } catch (error) {
    console.error('Error getting availability:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener disponibilidad'
    };
  }
}
