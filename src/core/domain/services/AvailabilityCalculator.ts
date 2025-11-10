import { TimeSlot } from '../value-objects/TimeSlot';
import { Appointment } from '../entities/Appointment';

export interface BusyRange {
  start: string;
  end: string;
}

export class AvailabilityCalculator {
  static calculateAvailableSlots(
    workingSlots: TimeSlot[],
    busyAppointments: Appointment[],
    slotDuration: number
  ): TimeSlot[] {
    const availableSlots: TimeSlot[] = [];

    for (const workSlot of workingSlots) {
      const slots = this.generateSlotsFromBlock(workSlot, slotDuration);
      
      for (const slot of slots) {
        if (!this.isSlotOccupied(slot, busyAppointments)) {
          availableSlots.push(slot);
        }
      }
    }

    return availableSlots;
  }

  static mergeBusyRanges(appointments: Appointment[]): BusyRange[] {
    if (appointments.length === 0) return [];

    const sorted = [...appointments].sort(
      (a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime()
    );

    const merged: BusyRange[] = [];
    let current = this.appointmentToBusyRange(sorted[0]);

    for (let i = 1; i < sorted.length; i++) {
      const next = this.appointmentToBusyRange(sorted[i]);

      if (this.rangesOverlap(current, next)) {
        current = this.mergeRanges(current, next);
      } else {
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
    return merged;
  }

  private static generateSlotsFromBlock(block: TimeSlot, duration: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = block.startTime.split(':').map(Number);
    const [endHour, endMinute] = block.endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + duration <= endMinutes) {
      const slotStart = this.minutesToTime(currentMinutes);
      const slotEnd = this.minutesToTime(currentMinutes + duration);
      
      slots.push(TimeSlot.create(slotStart, slotEnd));
      currentMinutes += duration;
    }

    return slots;
  }

  private static isSlotOccupied(slot: TimeSlot, appointments: Appointment[]): boolean {
    const slotStart = this.timeToMinutes(slot.startTime);
    const slotEnd = this.timeToMinutes(slot.endTime);

    return appointments.some(apt => {
      const aptStart = this.dateToMinutes(apt.scheduledStart);
      const aptEnd = this.dateToMinutes(apt.scheduledEnd);
      return slotStart < aptEnd && slotEnd > aptStart;
    });
  }

  private static appointmentToBusyRange(appointment: Appointment): BusyRange {
    return {
      start: this.dateToTimeString(appointment.scheduledStart),
      end: this.dateToTimeString(appointment.scheduledEnd)
    };
  }

  private static rangesOverlap(a: BusyRange, b: BusyRange): boolean {
    const aStart = this.timeToMinutes(a.start);
    const aEnd = this.timeToMinutes(a.end);
    const bStart = this.timeToMinutes(b.start);
    const bEnd = this.timeToMinutes(b.end);

    return aStart < bEnd && aEnd > bStart;
  }

  private static mergeRanges(a: BusyRange, b: BusyRange): BusyRange {
    const aStart = this.timeToMinutes(a.start);
    const aEnd = this.timeToMinutes(a.end);
    const bStart = this.timeToMinutes(b.start);
    const bEnd = this.timeToMinutes(b.end);

    const mergedStart = Math.min(aStart, bStart);
    const mergedEnd = Math.max(aEnd, bEnd);

    return {
      start: this.minutesToTime(mergedStart),
      end: this.minutesToTime(mergedEnd)
    };
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  private static dateToMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

  private static dateToTimeString(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
