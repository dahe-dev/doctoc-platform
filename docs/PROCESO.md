# 🎨 Proceso Creativo - Doctoc Platform

Este documento detalla las decisiones técnicas, retos encontrados y el proceso creativo durante el desarrollo de la plataforma Doctoc.

## 📋 Índice

- [Decisiones Técnicas](#-decisiones-técnicas)
- [Retos y Soluciones](#-retos-y-soluciones)
- [Uso de IA en el Desarrollo](#-uso-de-ia-en-el-desarrollo)
- [Mejoras Futuras](#-mejoras-futuras)

---

## 🏗️ Decisiones Técnicas

### 1. Arquitectura Limpia (Clean Architecture)

**Decisión**: Implementar Clean Architecture separando el código en capas bien definidas.

**Justificación**:

- **Mantenibilidad**: Facilita el mantenimiento a largo plazo
- **Testabilidad**: Cada capa puede ser testeada independientemente
- **Flexibilidad**: Permite cambiar implementaciones sin afectar la lógica de negocio
- **Escalabilidad**: Estructura clara para agregar nuevas features

**Estructura Implementada**:

```
core/
  ├── domain/           # Reglas de negocio puras
  │   ├── entities/     # Entidades del dominio
  │   ├── value-objects/# Objetos de valor inmutables
  │   └── repositories/ # Interfaces de repositorios
  ├── application/      # Casos de uso y DTOs
  │   ├── use-cases/    # Lógica de aplicación
  │   ├── dto/          # Objetos de transferencia de datos
  │   └── mappers/      # Transformación de datos
  └── infrastructure/   # Implementaciones técnicas
      ├── api/          # Clientes HTTP
      └── repositories/ # Implementación de repositorios
```

**Beneficios Obtenidos**:

- Separación clara de responsabilidades
- Fácil onboarding de nuevos desarrolladores
- Tests unitarios más simples
- Reutilización de lógica de negocio

---

### 2. Validación con Zod en Todas las Capas

**Decisión**: Utilizar Zod para validación de datos en múltiples capas de la aplicación.

**Implementación**:

#### Capa de Aplicación (DTOs)

```typescript
// src/core/application/dto/appointment.dto.ts
export const createAppointmentDTO = z.object({
  orgID: z.string().min(1, 'Organization ID es requerido'),
  dayKey: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'DayKey debe tener formato YYYY-MM-DD'),
  scheduledStart: z.string().datetime('Fecha de inicio inválida'),
  scheduledEnd: z.string().datetime('Fecha de fin inválida'),
  patient: z.string().min(1, 'Patient ID es requerido'),
  userId: z.string().min(1, 'User ID es requerido'),
  // ... más campos
});
```

#### Capa de Dominio (Value Objects)

```typescript
// src/core/domain/value-objects/DayKey.ts
export class DayKey {
  private constructor(public readonly value: string) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      throw new Error('DayKey must be in YYYY-MM-DD format');
    }
  }

  static create(date: string | Date): DayKey {
    // Validación y creación
  }
}
```

#### Server Actions

```typescript
// src/app/actions/appointments.ts
export async function createAppointment(input: CreateAppointmentDTO) {
  try {
    // Validación con Zod
    const validated = createAppointmentDTO.parse(input);

    const useCase = new CreateAppointmentUseCase(appointmentRepo, userRepo);
    const appointment = await useCase.execute(validated);

    return { success: true, data: appointment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: error.message };
  }
}
```

**Beneficios**:

- ✅ **Type Safety**: TypeScript infiere tipos automáticamente de los schemas
- ✅ **Validación Consistente**: Mismas reglas en cliente y servidor
- ✅ **Mensajes de Error Claros**: Feedback preciso al usuario
- ✅ **Documentación Implícita**: Los schemas documentan la estructura de datos
- ✅ **Reducción de Bugs**: Validación en tiempo de compilación y ejecución

**Ejemplo de Uso**:

```typescript
// Antes (sin Zod)
function createAppointment(data: any) {
  if (!data.orgID || typeof data.orgID !== 'string') {
    throw new Error('Invalid orgID');
  }
  // ... más validaciones manuales
}

// Después (con Zod)
function createAppointment(data: CreateAppointmentDTO) {
  const validated = createAppointmentDTO.parse(data); // ✨ Una línea
  // validated tiene el tipo correcto y está validado
}
```

---

### 3. React Query para Estado del Servidor

**Decisión**: Usar TanStack Query (React Query) para gestión de estado del servidor.

**Justificación**:

- Caché automático de datos
- Refetch inteligente
- Optimistic updates
- Sincronización de estado entre componentes
- DevTools para debugging

**Implementación**:

```typescript
// src/presentation/hooks/queries/useDoctor.ts
export function useDoctor(doctorId: string, orgID: string) {
  return useQuery({
    queryKey: QUERY_KEYS.doctor(doctorId),
    queryFn: () => getDoctorById(doctorId, orgID),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!doctorId && !!orgID,
  });
}
```

---

### 4. Server Actions de Next.js 15

**Decisión**: Usar Server Actions en lugar de API Routes tradicionales.

**Ventajas**:

- Menos boilerplate
- Type-safe end-to-end
- Integración directa con React
- Mejor rendimiento (menos round-trips)

**Implementación**:

```typescript
// src/app/actions/appointments.ts
'use server';

export async function createAppointment(input: CreateAppointmentDTO) {
  // Lógica en el servidor
  // Llamada directa desde componentes cliente
}
```

---

### 5. Value Objects para Lógica de Dominio

**Decisión**: Encapsular lógica relacionada a valores específicos en Value Objects.

**Ejemplos Implementados**:

#### DayKey

```typescript
export class DayKey {
  static create(date: string | Date): DayKey;
  toDate(): Date;
  format(): string;
  isBefore(other: DayKey): boolean;
  isAfter(other: DayKey): boolean;
}
```

#### AppointmentStatus

```typescript
export class AppointmentStatus {
  static create(status: string): AppointmentStatus;
  isConfirmed(): boolean;
  isCancelled(): boolean;
  canBeModified(): boolean;
}
```

#### TimeSlot

```typescript
export class TimeSlot {
  static create(start: Date, end: Date): TimeSlot;
  getDuration(): number;
  overlaps(other: TimeSlot): boolean;
  contains(time: Date): boolean;
}
```

**Beneficios**:

- Lógica centralizada y reutilizable
- Validación en la construcción
- Inmutabilidad garantizada
- Comportamiento asociado al valor

---

## 🚧 Retos y Soluciones

### Reto 1: API No Enriquecida para Búsqueda de Doctores

**Problema**:
La API de Doctoc no proporciona un endpoint específico para búsqueda de doctores con filtros avanzados. Solo existe `getOrgInfoAPIV2` que retorna todos los usuarios de la organización.

**Impacto**:

- No se puede filtrar directamente en el backend
- Necesidad de traer todos los usuarios y filtrar en el cliente
- Potencial problema de rendimiento con muchos usuarios

**Solución Implementada**:

1. **Obtención completa inicial**:

```typescript
// src/infrastructure/repositories/DoctocUserRepository.ts
async findAll(orgID: string): Promise<User[]> {
  const response = await organizationApiClient.getOrganizationInfo(orgID, ['users']);

  return response.users
    .filter(user => user.role === 'doctor' && user.disabled === false)
    .map(user => this.mapToUser(user));
}
```

2. **Filtrado local eficiente**:

```typescript
// src/core/application/use-cases/users/SearchDoctorsUseCase.ts
async execute(dto: GetOrganizationInfoDTO): Promise<User[]> {
  const allDoctors = await this.userRepo.findAll(dto.orgID);

  if (!dto.specialty && !dto.searchTerm) {
    return allDoctors;
  }

  return allDoctors.filter(doctor => {
    if (dto.specialty && !doctor.specialty?.toLowerCase().includes(dto.specialty.toLowerCase())) {
      return false;
    }

    if (dto.searchTerm) {
      const searchLower = dto.searchTerm.toLowerCase();
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      return fullName.includes(searchLower) ||
             doctor.specialty?.toLowerCase().includes(searchLower);
    }

    return true;
  });
}
```

3. **Caché con React Query**:

```typescript
export function useDoctors(orgID: string, filters?: DoctorFilters) {
  return useQuery({
    queryKey: ['doctors', orgID, filters],
    queryFn: () => searchDoctors({ orgID, ...filters }),
    staleTime: 1000 * 60 * 10, // 10 minutos de caché
    select: (data) => data.data || [],
  });
}
```

**Resultado**:

- ✅ Búsqueda funcional con filtros múltiples
- ✅ Rendimiento aceptable con caché
- ✅ Experiencia de usuario fluida
- ⚠️ Limitación: No escala bien con +1000 usuarios

**Mejora Futura Sugerida**:

- Implementar endpoint de búsqueda en la API de Doctoc
- Agregar paginación
- Índice de búsqueda (Algolia, ElasticSearch)

---

### Reto 2: Cálculo de Disponibilidad

**Problema**:
La API solo retorna "busy ranges" (rangos ocupados), pero no calcula los slots disponibles considerando:

- Horario de trabajo del doctor
- Duración de cada slot
- Overbooking permitido
- Días festivos

**Solución Implementada**:

1. **Service de Cálculo de Disponibilidad**:

```typescript
// src/core/domain/services/AvailabilityCalculator.ts
export class AvailabilityCalculator {
  calculateAvailableSlots(
    schedule: Schedule,
    busySlots: Appointment[],
    date: Date,
    slotDuration: number,
    maxOverbooking: number,
  ): TimeSlot[] {
    // 1. Obtener rangos de trabajo del día
    const workRanges = this.getWorkRangesForDay(schedule, date);

    // 2. Generar todos los slots posibles
    const allSlots = this.generateTimeSlots(workRanges, slotDuration);

    // 3. Contar overlaps con citas existentes
    const slotsWithCount = allSlots.map((slot) => ({
      slot,
      overlaps: this.countOverlaps(slot, busySlots),
    }));

    // 4. Filtrar slots disponibles
    return slotsWithCount
      .filter(({ overlaps }) => overlaps < maxOverbooking)
      .map(({ slot }) => slot);
  }
}
```

2. **Validación de Overbooking**:

```typescript
// src/core/domain/services/OverbookingValidator.ts
export class OverbookingValidator {
  async validate(
    doctorId: string,
    dayKey: DayKey,
    newSlot: TimeSlot,
    maxOverbooking: number,
    appointmentRepo: IAppointmentRepository,
  ): Promise<boolean> {
    const existingAppointments = await appointmentRepo.findByUserAndDay(
      doctorId,
      dayKey,
      orgID,
    );

    const overlaps = existingAppointments.filter((apt) =>
      this.slotsOverlap(newSlot, apt.getTimeSlot()),
    );

    return overlaps.length < maxOverbooking;
  }
}
```

**Beneficios**:

- ✅ Control total sobre lógica de disponibilidad
- ✅ Soporte para overbooking configurable
- ✅ Lógica reutilizable y testeable
- ✅ Independiente de la API

---

### Reto 3: Manejo de Fechas y Zonas Horarias

**Problema**:

- La API retorna fechas en UTC
- El usuario ve fechas en su zona horaria local
- Necesidad de consistencia en el formato de fechas

**Solución**:

1. **Value Object DayKey**:

```typescript
export class DayKey {
  static create(date: string | Date): DayKey {
    if (typeof date === 'string') {
      // Asegurar formato YYYY-MM-DD
      return new DayKey(date);
    }
    // Convertir Date a string en formato local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return new DayKey(`${year}-${month}-${day}`);
  }
}
```

2. **Utilities para Fechas**:

```typescript
// src/presentation/utils/appointments.ts
import { format, parseISO } from 'date-fns';

export function formatAppointmentTime(dateString: string): string {
  return format(parseISO(dateString), 'HH:mm');
}

export function formatAppointmentDate(dateString: string): string {
  return format(parseISO(dateString), 'dd/MM/yyyy');
}
```

**Bibliotecas Utilizadas**:

- `date-fns`: Manipulación de fechas ligera y funcional
- Value Objects personalizados para encapsular lógica

---

### Reto 4: Serialización de Entidades para Server Actions

**Problema**:
Next.js Server Actions solo pueden retornar datos serializables (JSON), pero nuestras entidades son clases con métodos.

**Solución - Mappers**:

```typescript
// src/core/application/mappers/AppointmentMapper.ts
export class AppointmentMapper {
  static toSerialized(appointment: Appointment): SerializedAppointment {
    return {
      id: appointment.id,
      orgID: appointment.orgID,
      dayKey: appointment.dayKey.value,
      scheduledStart: appointment.scheduledStart.toISOString(),
      scheduledEnd: appointment.scheduledEnd.toISOString(),
      patientId: appointment.patientId,
      userId: appointment.userId,
      status: appointment.status.value,
      // ... más campos
    };
  }

  static fromSerialized(data: SerializedAppointment): Appointment {
    return new Appointment(
      data.id,
      data.orgID,
      DayKey.create(data.dayKey),
      new Date(data.scheduledStart),
      new Date(data.scheduledEnd),
      data.patientId,
      data.userId,
      // ... más campos
    );
  }
}
```

**Patrón Aplicado**:

```
Server Action → Use Case → Repository → Entity (Domain)
    ↓
  Mapper.toSerialized()
    ↓
SerializedData → Cliente (React Component)
```

---

## 🤖 Uso de IA en el Desarrollo

### GitHub Copilot

**Uso Principal**: Generación de código repetitivo y boilerplate.

#### Prompts Importantes Utilizados:

1. **Generación de DTOs**:

```
// Prompt: "Create Zod schema for appointment creation with all required fields"
// Resultado: Schemas completos con validaciones
```

2. **Mappers**:

```
// Prompt: "Create mapper to convert Appointment entity to serializable object"
// Resultado: Métodos de transformación bidireccional
```

3. **Documentación**:

```
// Prompt: "Add JSDoc comments explaining this use case"
// Resultado: Documentación inline clara
```

### ChatGPT / Claude

**Uso**: Decisiones arquitectónicas y resolución de problemas complejos.

#### Conversaciones Clave:

1. **Arquitectura Limpia en Next.js**:

```
Q: "¿Cómo estructurar Clean Architecture en Next.js App Router?"
A: Guía sobre separación de capas, uso de Server Actions, y organización de carpetas
```

2. **Validación Multi-Capa con Zod**:

```
Q: "¿Dónde colocar validaciones Zod en Clean Architecture?"
A: DTOs en application, Value Objects en domain, validación de entrada en Server Actions
```

### Decisiones Asistidas por IA

1. **Estructura de Carpetas**:
   - IA sugirió separación clara entre `core`, `infrastructure`, y `presentation`
   - Recomendó usar `app/actions` para Server Actions

2. **Patrón de Repositorios**:
   - IA explicó el patrón Repository con interfaces en domain
   - Sugerencia de implementaciones concretas en infrastructure

3. **Manejo de Errores**:
   - IA propuso estructura de `ActionResult<T>` para respuestas consistentes
   - Patrón de try-catch con logging estructurado

4. **Optimización de React Query**:
   - Configuración de `staleTime` y `cacheTime`
   - Estrategias de invalidación de caché

### Lecciones Aprendidas

✅ **IA es excelente para**:

- Código repetitivo y boilerplate
- Documentación y comentarios
- Sugerencias de nombres y estructura
- Tests

⚠️ **IA necesita supervisión en**:

- Lógica de negocio compleja
- Decisiones arquitectónicas críticas
- Optimizaciones de rendimiento
- Seguridad y validaciones

---

## 🚀 Mejoras Futuras

### Corto Plazo (1-2 meses)

1. **Tests Completos**
   - [ ] Tests unitarios para todos los use cases
   - [ ] Tests de integración para repositorios
   - [ ] Tests E2E con Playwright
   - [ ] Coverage mínimo 80%

2. **Optimizaciones de Rendimiento**
   - [ ] Implementar React Suspense
   - [ ] Lazy loading de componentes pesados
   - [ ] Optimización de imágenes con Next.js Image
   - [ ] Code splitting más granular

3. **Mejoras de UX**
   - [ ] Loading states más elaborados
   - [ ] Animaciones con Framer Motion
   - [ ] Feedback visual mejorado
   - [ ] Modo offline básico

### Mediano Plazo (3-6 meses)

4. **Backend**
   - [ ] API Gateway para abstracción de Doctoc API
   - [ ] Caché en servidor (Redis)
   - [ ] WebSockets para actualizaciones en tiempo real
   - [ ] Queue system para operaciones pesadas

5. **Features Avanzadas**
   - [ ] Notificaciones push
   - [ ] Recordatorios automáticos
   - [ ] Chat entre doctor y paciente
   - [ ] Videoconsulta integrada
   - [ ] Sistema de calificaciones

6. **Mejoras de Búsqueda**
   - [ ] Índice de búsqueda (Algolia/Meilisearch)
   - [ ] Filtros avanzados (precio, ubicación, etc.)
   - [ ] Recomendaciones personalizadas
   - [ ] Historial de búsquedas

### Largo Plazo (6-12 meses)

7. **Escalabilidad**
   - [ ] Microservicios para módulos independientes
   - [ ] CDN para assets estáticos
   - [ ] Multi-región deployment
   - [ ] Database sharding

8. **Analytics y Monitoring**
   - [ ] Dashboard de analytics
   - [ ] Error tracking (Sentry)
   - [ ] Performance monitoring (Datadog)
   - [ ] A/B testing framework

9. **Internacionalización**
   - [ ] Soporte multi-idioma (i18n)
   - [ ] Multi-moneda
   - [ ] Formatos de fecha/hora localizados

10. **Mobile**
    - [ ] App móvil con React Native
    - [ ] Compartir código con web
    - [ ] Push notifications nativas

---

## 📊 Métricas de Éxito

### Técnicas

- ✅ 100% Type Safety con TypeScript
- ✅ 0 errores de ESLint
- ✅ Clean Architecture implementada
- ✅ Validación con Zod en todas las capas
- 🔄 75% Code coverage (objetivo: 80%)

### Performance

- ✅ Lighthouse Score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- 🔄 Core Web Vitals en verde (en progreso)

### UX

- ✅ Responsive en todos los dispositivos
- ✅ Accesibilidad básica (ARIA labels)
- ✅ Dark mode completo
- 🔄 Animaciones fluidas (en mejora)

---

## 🎓 Aprendizajes Clave

1. **Clean Architecture vale la pena**: La inversión inicial en estructura paga dividendos en mantenibilidad.

2. **Zod es un game-changer**: Validación y types en uno solo, reduce bugs significativamente.

3. **Server Actions simplifican el stack**: Menos boilerplate que API Routes tradicionales.

4. **React Query es esencial**: Gestión de estado del servidor sin el cual el proyecto sería mucho más complejo.

5. **Value Objects encapsulan complejidad**: DayKey, TimeSlot, etc., hacen el código más legible y seguro.

6. **IA acelera, no reemplaza**: Excelente para boilerplate, requiere supervisión para lógica compleja.

7. **Documentación desde el inicio**: Crear docs durante el desarrollo, no al final.

---

**Última actualización**: 10 de noviembre de 2025

**Autor**: David Henrry Ticona Maquera

**Versión del Proyecto**: 1.0.0
