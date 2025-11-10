export const DOCTOC_CONFIG = {
  orgID: process.env.NEXT_PUBLIC_ORG_ID || 'rFQpBRoNGiv0V9KnHZV6',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-doctoc-main.cloudfunctions.net',
  apiToken: process.env.NEXT_PUBLIC_DOCTOC_API_TOKEN || 'PRk2P5dbYptiss5w2U8jdVPu9DAHXcoWmFrl3lDmGMthqfgtjePvJk6MacyiPPlK',
} as const;

export const APP_CONFIG = {
  name: 'Doctoc Platform',
  description: 'Sistema de Agendamiento Médico',
  version: '1.0.0',
} as const;

export const ROUTES = {
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    doctors: '/doctors',
    doctorDetail: (id: string) => `/doctors/${id}`,
  },
  auth: {
    dashboard: '/dashboard',
    appointments: '/appointments',
    profile: '/profile',
    appointmentDetail: (id: string) => `/appointments/${id}`,
  },
} as const;

export const ERROR_MESSAGES = {
  generic: 'Algo salió mal. Por favor intenta de nuevo.',
  unauthorized: 'Debes iniciar sesión para acceder.',
  forbidden: 'No tienes permiso para acceder a este recurso.',
  notFound: 'El recurso solicitado no fue encontrado.',
  validation: 'Por favor verifica tu información e intenta de nuevo.',
  network: 'Error de red. Verifica tu conexión.',
} as const;

export const QUERY_KEYS = {
  doctors: 'doctors',
  doctor: (id: string) => ['doctor', id],
  appointments: 'appointments',
  appointment: (id: string) => ['appointment', id],
  schedule: (doctorId: string, date: string) => ['schedule', doctorId, date],
  patient: (id: string) => ['patient', id],
  specialties: 'specialties',
} as const;