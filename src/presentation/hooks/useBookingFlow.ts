'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { ROUTES } from '@/config/constants';

export interface BookingState {
  doctorId: string;
  doctorName: string;
  specialty?: string;
  selectedDate: string;
  selectedSlot: {
    start: string;
    end: string;
  };
  typeId: string;
  locationId: string;
  motive: string;
}

export function useBookingFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookingState, setBookingState] = useState<Partial<BookingState>>({});

  const startBooking = useCallback((doctorId: string, doctorName: string, specialty?: string) => {
    setBookingState({
      doctorId,
      doctorName,
      specialty,
    });
  }, []);

  const selectDateTime = useCallback((date: string, slot: { start: string; end: string }) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      selectedSlot: slot,
    }));
  }, []);

  const proceedToConfirmation = useCallback((typeId: string, locationId: string, motive: string) => {
    if (!bookingState.doctorId || !bookingState.selectedDate || !bookingState.selectedSlot) {
      console.error('Booking state incomplete');
      return;
    }

    const fullBookingState: BookingState = {
      doctorId: bookingState.doctorId,
      doctorName: bookingState.doctorName!,
      specialty: bookingState.specialty,
      selectedDate: bookingState.selectedDate,
      selectedSlot: bookingState.selectedSlot,
      typeId,
      locationId,
      motive,
    };

    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('booking_state', JSON.stringify(fullBookingState));
        sessionStorage.setItem('return_url', '/appointments/confirm');
      }
      router.push(ROUTES.public.login + '?redirect=booking');
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('booking_state', JSON.stringify(fullBookingState));
    }
    router.push('/appointments/confirm');
  }, [bookingState, user, router]);

  const getBookingState = useCallback((): BookingState | null => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('booking_state');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const clearBookingState = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('booking_state');
      sessionStorage.removeItem('return_url');
    }
    setBookingState({});
  }, []);

  return {
    bookingState,
    startBooking,
    selectDateTime,
    proceedToConfirmation,
    getBookingState,
    clearBookingState,
  };
}
