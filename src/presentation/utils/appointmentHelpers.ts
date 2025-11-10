import { getDoctorById } from '@/app/actions/doctors';
import { DOCTOC_CONFIG } from '@/config/constants';
import { formatDoctorName } from './doctors';
import type { SerializedUser } from '@/core/application/mappers';

export const getDoctorInfo = async (
  userId: string,
): Promise<SerializedUser | null> => {
  try {
    const result = await getDoctorById(userId, DOCTOC_CONFIG.orgID);
    return result.success && result.data ? result.data : null;
  } catch (error) {
    console.error('Error getting doctor info:', error);
    return null;
  }
};

export const formatDoctorDisplayName = (
  doctor: SerializedUser | null,
): string => {
  if (!doctor) return 'Doctor';

  return formatDoctorName(
    doctor.firstName,
    doctor.lastName,
    doctor.gender,
    doctor.role,
  );
};
