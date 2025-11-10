export const getDoctorTitle = (gender?: string, role?: string): string => {
  if (role !== 'doctor') return '';

  if (gender === 'Masculino' || gender === 'masculino' || gender === 'M') {
    return 'Dr.';
  }

  if (gender === 'Femenino' || gender === 'femenino' || gender === 'F') {
    return 'Dra.';
  }

  return 'Dr.';
};

export const formatDoctorName = (
  firstName: string,
  lastName: string,
  gender?: string,
  role?: string,
): string => {
  const title = getDoctorTitle(gender, role);
  const fullName = `${firstName} ${lastName}`.trim();

  return title ? `${title} ${fullName}` : fullName;
};
