import { User } from '../entities/User';
import { Appointment } from '../entities/Appointment';
import { TimeSlot } from '../value-objects/TimeSlot';

export class OverbookingValidator {
  static canScheduleAppointment(
    user: User,
    requestedSlot: TimeSlot,
    existingAppointments: Appointment[]
  ): ValidationResult {
    if (user.allowsOverbooking()) {
      return {
        allowed: true,
        reason: 'Overbooking enabled'
      };
    }

    const hasConflict = existingAppointments.some(apt => {
      const aptSlot = this.appointmentToTimeSlot(apt);
      return requestedSlot.overlapsWith(aptSlot);
    });

    if (hasConflict) {
      return {
        allowed: false,
        reason: 'Time slot already occupied and overbooking is disabled'
      };
    }

    return {
      allowed: true,
      reason: 'Time slot available'
    };
  }

  static validateAppointmentUpdate(
    user: User,
    updatedAppointment: Appointment,
    existingAppointments: Appointment[]
  ): ValidationResult {
    const otherAppointments = existingAppointments.filter(
      apt => apt.id !== updatedAppointment.id
    );

    const requestedSlot = this.appointmentToTimeSlot(updatedAppointment);
    return this.canScheduleAppointment(user, requestedSlot, otherAppointments);
  }

  private static appointmentToTimeSlot(appointment: Appointment): TimeSlot {
    const start = this.dateToTimeString(appointment.scheduledStart);
    const end = this.dateToTimeString(appointment.scheduledEnd);
    return TimeSlot.create(start, end);
  }

  private static dateToTimeString(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

interface ValidationResult {
  allowed: boolean;
  reason: string;
}
