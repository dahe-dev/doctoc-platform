# 🏥 Doctoc Platform

Plataforma de agendamiento médico construida con Next.js 15 y arquitectura limpia, que permite la gestión de citas médicas, perfiles de doctores y pacientes.

## 📋 Descripción del Proyecto

Doctoc Platform es una aplicación web moderna para la gestión de citas médicas que implementa:

- **Clean Architecture**: Separación clara entre capas de dominio, aplicación, infraestructura y presentación
- **Validación con Zod**: Validación de datos robusta en todas las capas de la aplicación
- **Gestión de Estado**: React Query para manejo eficiente de estado del servidor
- **Autenticación**: Firebase Authentication para gestión segura de usuarios
- **UI/UX Moderna**: Componentes con Radix UI y Tailwind CSS
- **Type Safety**: TypeScript en todo el proyecto

## 🛠️ Tecnologías Principales

### Frontend & Framework

- **Next.js 15.3.4** - Framework React con App Router
- **React 19.1.0** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Tipado estático con configuración estricta
- **Tailwind CSS 4** - Framework de estilos utility-first

### Gestión de Estado & Datos

- **@tanstack/react-query 5.90.6** - Gestión de estado del servidor y caché
- **Zod 4.1.12** - Validación de schemas y tipos
- **Axios 1.13.1** - Cliente HTTP

### Autenticación & Backend

- **Firebase 12.5.0** - Autenticación y Firestore
- **Doctoc API** - API REST para gestión de citas y usuarios

### UI Components

- **Radix UI** - Componentes accesibles sin estilos
- **Lucide React 0.548.0** - Iconos
- **@lottiefiles/dotlottie-react** - Animaciones
- **Sonner 2.0.7** - Notificaciones toast

### Formularios

- **React Hook Form 7.66.0** - Gestión de formularios
- **@hookform/resolvers 5.2.2** - Integración con Zod

### Herramientas de Desarrollo

- **ESLint 9** - Linter de código
- **Prettier 3.6.2** - Formateador de código
- **@tanstack/react-query-devtools** - Herramientas de desarrollo

## ⚙️ Configuración TypeScript Estricta

El proyecto utiliza una configuración **altamente estricta** de TypeScript para garantizar máxima seguridad de tipos y calidad de código:

### Strict Mode Completo

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "noImplicitThis": true,
  "alwaysStrict": true
}
```

### Validaciones Adicionales

- **`noUnusedLocals`**: Previene variables no utilizadas
- **`noUnusedParameters`**: Detecta parámetros sin usar
- **`forceConsistentCasingInFileNames`**: Consistencia en nombres de archivos

### Beneficios Obtenidos

- ✅ **Cero valores null/undefined implícitos**: Todos los tipos nullable deben ser explícitos
- ✅ **Sin tipos `any` implícitos**: Tipado explícito requerido en todas partes
- ✅ **Detección temprana de errores**: Errores de tipo capturados en compilación
- ✅ **Código más limpio**: Sin variables o parámetros sin usar
- ✅ **Mejor IntelliSense**: Autocompletado más preciso en el IDE
- ✅ **Refactoring seguro**: Los cambios de tipo se propagan correctamente

### Path Aliases Configurados

```typescript
"@/*"              → "./src/*"
"@/app/*"          → "./src/app/*"
"@/core/*"         → "./src/core/*"
"@/infrastructure/*" → "./src/infrastructure/*"
"@/presentation/*"   → "./src/presentation/*"
"@/config/*"       → "./src/config/*"
```

Esto permite imports limpios:

```typescript
// En lugar de: import { User } from '../../../core/domain/entities/User'
import { User } from '@/core/domain/entities/User';
```

## 📦 Instalación

### Prerrequisitos

- Node.js 20 o superior
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd doctoc-platform
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Configurar variables de entorno**

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_firebase_app_id

# Doctoc API Configuration
NEXT_PUBLIC_API_URL=https://us-central1-doctoc-main.cloudfunctions.net
NEXT_PUBLIC_DOCTOC_API_TOKEN=tu_api_token
NEXT_PUBLIC_ORG_ID=tu_organization_id
```

## 🚀 Comandos Disponibles

### Desarrollo

Inicia el servidor de desarrollo con Turbopack:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Producción

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas autenticadas
│   ├── (public)/            # Rutas públicas
│   └── actions/             # Server Actions
├── core/                     # Lógica de negocio (Clean Architecture)
│   ├── domain/              # Entidades, Value Objects, Repositorios
│   ├── application/         # Casos de uso, DTOs, Mappers
│   └── index.ts
├── infrastructure/           # Implementaciones técnicas
│   ├── api/                 # Clientes API
│   ├── auth/                # Firebase Auth
│   └── repositories/        # Implementación de repositorios
├── presentation/             # Componentes UI
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layouts
│   └── providers/           # Context Providers
└── config/                   # Configuración
```

## 📚 Documentación Adicional

Para más información detallada, consulta:

- **[Documentación de API](./docs/API.md)** - Endpoints, modelos de datos y ejemplos de uso
- **[Proceso de Desarrollo](./docs/PROCESO.md)** - Decisiones técnicas, retos y soluciones

## 🔑 Características Principales

- ✅ Autenticación de usuarios con Firebase
- ✅ Búsqueda y filtrado de doctores por especialidad
- ✅ Agendamiento de citas médicas
- ✅ Visualización de disponibilidad en tiempo real
- ✅ Gestión de perfil de usuario
- ✅ Dashboard personalizado
- ✅ Validación de datos con Zod
- ✅ TypeScript estricto (strict mode completo)
- ✅ Responsive design
- ✅ Dark/Light mode

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🔗 Links Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Firebase](https://firebase.google.com)
