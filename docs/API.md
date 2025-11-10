# 📡 Documentación de API - Doctoc Platform

Esta documentación describe los endpoints de la API de Doctoc utilizados en la plataforma y cómo se integran con la arquitectura limpia del proyecto.

## 🏗️ Arquitectura de Integración

La integración con la API de Doctoc sigue el patrón de **Clean Architecture**:

```
Server Actions (app/actions)
    ↓
Use Cases (core/application/use-cases)
    ↓
Repositories (infrastructure/repositories)
    ↓
API Clients (infrastructure/api/clients)
    ↓
Base API Client (infrastructure/api/base)
    ↓
Doctoc API
```

## 🔧 Configuración Base

### BaseApiClient

Todas las llamadas a la API utilizan el cliente base ubicado en `src/infrastructure/api/base/BaseApiClient.ts`:

```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL
Authorization: Bearer ${DOCTOC_API_TOKEN}
Content-Type: application/json
Timeout: 15000ms
```

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_API_URL=https://us-central1-doctoc-main.cloudfunctions.net
NEXT_PUBLIC_DOCTOC_API_TOKEN=tu_token_de_api
NEXT_PUBLIC_ORG_ID=tu_organization_id
```

---

## 📋 Endpoints de Gestión de Usuarios

### 1. Obtener Perfil de Usuario

**Cliente**: `UserApiClient.getUserProfile()`

**Endpoint**: `POST /manageUserInfoAPIV2`

**Request Body**:

```json
{
  "action": "get",
  "orgID": "string",
  "uid": "string",
  "type": "user",
  "sections": ["basic", "professional", "calendarInfo"]
}
```

**Response**:

```json
{
  "uid": "string",
  "basic": {
    "profile_name": "string",
    "profile_lastname": "string",
    "profile_email": "string",
    "profile_image": "string"
  },
  "professional": {
    "specialty": "string",
    "license": "string"
  },
  "calendarInfo": {
    "schedule": {
      "monday": {
        "isActive": true,
        "ranges": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ]
      }
    },
    "slotDuration": 30,
    "maxOverbooking": 2
  }
}
```

**Uso en el Código**:

- **Repository**: `DoctocUserRepository.findById()`
- **Use Case**: `GetUserProfileUseCase`
- **Server Action**: `getUserProfile()`, `getDoctorById()`

### 2. Actualizar Perfil de Usuario

**Cliente**: `UserApiClient.updateUserProfile()`

**Endpoint**: `POST /manageUserInfoAPIV2`

**Request Body**:

```json
{
  "action": "update",
  "orgID": "string",
  "uid": "string",
  "type": "user",
  "data": {
    "calendarInfo": {
      "schedule": { ... },
      "slotDuration": 30,
      "maxOverbooking": 2
    }
  }
}
```

**Response**:

```json
{
  "success": true,
  "message": "Usuario actualizado correctamente"
}
```

**Uso en el Código**:

- **Repository**: `DoctocUserRepository.updateCalendarInfo()`
- **Use Case**: `UpdateUserCalendarUseCase`
- **Server Action**: `updateUserCalendar()`

---

## 👥 Endpoints de Organización

### 3. Obtener Información de Organización

**Cliente**: `OrganizationApiClient.getOrganizationInfo()`

**Endpoint**: `POST /getOrgInfoAPIV2`

**Request Body**:

```json
{
  "action": "get",
  "orgID": "string",
  "sections": ["users", "specialties", "locations"]
}
```

**Response**:

```json
{
  "orgID": "string",
  "name": "string",
  "users": [
    {
      "uid": "string",
      "name": "string",
      "email": "string",
      "role": "doctor",
      "specialty": "string",
      "disabled": false,
      "photo": "string",
      "gender": "M"
    }
  ],
  "specialties": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "locations": [
    {
      "id": "string",
      "name": "string",
      "address": "string"
    }
  ]
}
```

**Uso en el Código**:

- **Repository**: `DoctocOrganizationRepository.getOrganization()`
- **Use Case**: `GetOrganizationUseCase`
- **Server Action**: `getOrganizationInfo()`

### 4. Búsqueda de Doctores

**Cliente**: `UserApiClient` + filtrado local

**Proceso**:

1. Obtener organización con sección "users"
2. Filtrar usuarios con `role: "doctor"` y `disabled: false`
3. Aplicar filtros adicionales (especialidad, nombre, etc.)

**Uso en el Código**:

- **Repository**: `DoctocUserRepository.findAll()`, `findBySpecialty()`
- **Use Case**: `SearchDoctorsUseCase`
- **Server Action**: `searchDoctors()`

---

## 📅 Endpoints de Citas (Appointments)

### 5. Crear Cita

**Cliente**: `AppointmentApiClient.manageAppointment()`

**Endpoint**: `POST /manageQuotesAPIV2`

**Request Body**:

```json
{
  "action": "create",
  "orgID": "string",
  "dayKey": "2025-11-10",
  "scheduledStart": "2025-11-10T09:00:00.000Z",
  "scheduledEnd": "2025-11-10T09:30:00.000Z",
  "patient": "patientId",
  "userId": "doctorId",
  "type": "consultation",
  "typeId": "typeId",
  "motive": "Consulta general",
  "status": "confirmada",
  "version": "v2",
  "locationId": "locationId",
  "recipeID": "",
  "category": "cita",
  "personaEjecutante": "System"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Cita creada correctamente",
  "quote": {
    "id": "quoteId",
    "orgID": "string",
    "dayKey": "2025-11-10",
    "scheduledStart": "2025-11-10T09:00:00.000Z",
    "scheduledEnd": "2025-11-10T09:30:00.000Z",
    "patient": "patientId",
    "userId": "doctorId",
    "status": "confirmada"
  }
}
```

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.create()`
- **Use Case**: `CreateAppointmentUseCase`
- **Server Action**: `createAppointment()`

### 6. Actualizar Cita

**Cliente**: `AppointmentApiClient.manageAppointment()`

**Endpoint**: `POST /manageQuotesAPIV2`

**Request Body**:

```json
{
  "action": "update",
  "orgID": "string",
  "quoteID": "appointmentId",
  "dayKey": "2025-11-10",
  "oldDayKey": "2025-11-09",
  "scheduledStart": "2025-11-10T10:00:00.000Z",
  "scheduledEnd": "2025-11-10T10:30:00.000Z",
  "patient": "patientId",
  "userId": "doctorId",
  "type": "consultation",
  "status": "confirmada",
  "personaEjecutante": "System"
}
```

**Response**: Similar a crear cita

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.update()`
- **Use Case**: `UpdateAppointmentUseCase`
- **Server Action**: `updateAppointment()`

### 7. Cancelar Cita

**Cliente**: `AppointmentApiClient.manageAppointment()`

**Endpoint**: `POST /manageQuotesAPIV2`

**Request Body**:

```json
{
  "action": "cancel",
  "orgID": "string",
  "dayKey": "2025-11-10",
  "userId": "doctorId",
  "quoteID": "appointmentId",
  "cancelReason": "Motivo de cancelación",
  "personaEjecutante": "System"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Cita cancelada correctamente"
}
```

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.cancel()`
- **Use Case**: `CancelAppointmentUseCase`
- **Server Action**: `cancelAppointment()`

### 8. Obtener Citas del Día

**Cliente**: `AppointmentApiClient.getAppointmentsByDay()`

**Endpoint**: `POST /getDayQuotesAPIV2`

**Request Body**:

```json
{
  "orgID": "string",
  "dayKey": "2025-11-10"
}
```

**Response**:

```json
{
  "success": true,
  "appointments": [
    {
      "id": "string",
      "orgID": "string",
      "dayKey": "2025-11-10",
      "scheduledStart": "2025-11-10T09:00:00.000Z",
      "scheduledEnd": "2025-11-10T09:30:00.000Z",
      "patient": "patientId",
      "userId": "doctorId",
      "status": "confirmada"
    }
  ]
}
```

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.findByDay()`
- **Use Case**: `GetAppointmentsByDayUseCase`
- **Server Action**: `getAppointmentsByDay()`

### 9. Obtener Citas del Paciente

**Cliente**: `AppointmentApiClient.getAppointmentsByPatient()`

**Endpoint**: `POST /getPatientQuoteAPIV2`

**Request Body**:

```json
{
  "orgID": "string",
  "patientID": "string"
}
```

**Response**:

```json
{
  "status": "success",
  "total": 5,
  "quotes": [...]
}
```

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.findByPatient()`
- **Use Case**: `GetAppointmentsByPatientUseCase`
- **Server Action**: `getAppointmentsByPatient()`

### 10. Obtener Horarios Ocupados (Busy Slots)

**Cliente**: `AppointmentApiClient.getBusySlots()`

**Endpoint**: `POST /getDayQuotesAPIV2`

**Request Body**:

```json
{
  "orgID": "string",
  "dayKey": "2025-11-10",
  "userId": "doctorId",
  "format": "busy_ranges"
}
```

**Response**:

```json
{
  "status": "success",
  "total": 3,
  "busy_ranges": [
    {
      "start": "2025-11-10T09:00:00.000Z",
      "end": "2025-11-10T09:30:00.000Z"
    },
    {
      "start": "2025-11-10T10:00:00.000Z",
      "end": "2025-11-10T10:30:00.000Z"
    }
  ]
}
```

**Uso en el Código**:

- **Repository**: `DoctocAppointmentRepository.findByUserAndDay()`
- **Use Case**: `GetBusySlotsUseCase`
- **Server Action**: `getBusySlots()`, `getAvailability()`

---

## 📊 Modelos de Datos

### Usuario (User)

**Entidad de Dominio**: `src/core/domain/entities/User.ts`

```typescript
class User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  calendarInfo: CalendarInfo | null;
  photo?: string;
  gender?: string;
}
```

**DTO**: `src/core/application/dto/doctor.dto.ts`

```typescript
// GET User Profile
const getUserProfileDTO = z.object({
  action: z.literal('get'),
  uid: z.string(),
  orgID: z.string(),
  type: z.literal('user'),
  sections: z.array(z.string()),
});

// Update Calendar Info
const updateCalendarInfoDTO = z.object({
  action: z.literal('update'),
  uid: z.string(),
  orgID: z.string(),
  type: z.literal('user'),
  data: z.object({
    calendarInfo: z.unknown(),
  }),
});
```

### Cita (Appointment)

**Entidad de Dominio**: `src/core/domain/entities/Appointment.ts`

```typescript
class Appointment {
  id: string;
  orgID: string;
  dayKey: DayKey;
  scheduledStart: Date;
  scheduledEnd: Date;
  patientId: string;
  userId: string;
  type: string;
  typeId: string;
  motive: string;
  locationId: string;
  status: AppointmentStatus;
  category: string;
  recipeID?: string;
}
```

**DTOs**: `src/core/application/dto/appointment.dto.ts`

```typescript
// Create Appointment
const createAppointmentDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  patient: z.string().min(1),
  userId: z.string().min(1),
  type: z.string(),
  typeId: z.string(),
  motive: z.string(),
  locationId: z.string(),
  recipeID: z.string().optional(),
  category: z.string().optional(),
});

// Get Busy Slots
const getBusySlotsDTO = z.object({
  orgID: z.string().min(1),
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  userId: z.string().min(1),
});
```

### Value Objects

**DayKey**: `src/core/domain/value-objects/DayKey.ts`

```typescript
class DayKey {
  value: string; // Format: YYYY-MM-DD

  static create(date: string | Date): DayKey;
  toDate(): Date;
}
```

**AppointmentStatus**: `src/core/domain/value-objects/AppointmentStatus.ts`

```typescript
class AppointmentStatus {
  value: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

  static create(status: string): AppointmentStatus;
  isConfirmed(): boolean;
  isCancelled(): boolean;
}
```

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear una Cita

```
1. Usuario hace clic en "Agendar Cita" (UI Component)
   ↓
2. Se llama a createAppointment() (Server Action)
   ↓
3. Validación con createAppointmentDTO (Zod)
   ↓
4. CreateAppointmentUseCase.execute()
   - Valida disponibilidad
   - Valida overbooking
   ↓
5. DoctocAppointmentRepository.create()
   ↓
6. AppointmentApiClient.manageAppointment()
   ↓
7. POST a /manageQuotesAPIV2
   ↓
8. Respuesta de la API
   ↓
9. Mapeo a entidad Appointment
   ↓
10. Revalidación de rutas (Next.js)
    ↓
11. Respuesta al cliente con datos serializados
```

---

## 🛡️ Validación y Seguridad

### Validación con Zod

Todas las operaciones pasan por validación Zod en tres niveles:

1. **DTOs de Entrada**: Validación en Server Actions
2. **Value Objects**: Validación en capa de dominio
3. **Respuestas de API**: Parsing y validación de datos externos

### Autenticación

- Firebase Authentication para usuarios
- Bearer Token para API de Doctoc
- Middleware de Next.js para protección de rutas

---

## 🔍 Notas Importantes

### Limitaciones de la API

1. **Búsqueda de Doctores**: No existe endpoint directo, se obtiene mediante `getOrgInfoAPIV2` con sección "users" y se filtra en el frontend.

2. **Formato de Fechas**: La API espera formato ISO 8601 para fechas (`2025-11-10T09:00:00.000Z`).

3. **DayKey**: Siempre debe estar en formato `YYYY-MM-DD`.

4. **Busy Ranges**: El endpoint retorna solo rangos ocupados, el cálculo de disponibilidad se hace en el frontend usando `AvailabilityCalculator`.

### Mejoras Futuras

- Implementar caché más agresivo con React Query
- Agregar paginación para listas grandes
- Implementar retry logic con exponential backoff
- Agregar tests de integración para los clientes API
- Implementar webhooks para actualizaciones en tiempo real

---

## 📞 Soporte

Para dudas sobre la implementación en este proyecto, revisar la [documentación del proceso](./PROCESO.md).
