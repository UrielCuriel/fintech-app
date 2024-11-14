# Fintech MFA Frontend

Este es un proyecto de prueba para la empresa [Creze](https://creze.com/), para la posición de desarrollador fullstack.

## Descripción

El objetivo principal de este proyecto es crear una aplicación web que permita a los usuarios registrarse, iniciar sesión utilizando MFA (Multi-Factor Authentication) y ver su perfil. Orientado principalmente a la seguridad de los datos de los usuarios.

## Tecnologías Principales

- [Next.js 15](https://nextjs.org/): Framework de React con soporte para Server Side Rendering
- [React 19 RC](https://react.dev/): Biblioteca para construcción de interfaces
- [TypeScript](https://www.typescriptlang.org/): Superset tipado de JavaScript
- [Tailwind CSS](https://tailwindcss.com/): Framework CSS utility-first
- [HeadlessUI](https://headlessui.com/): Componentes UI accesibles sin estilos
- [Iron Session](https://github.com/vvo/iron-session): Gestión de sesiones encriptadas
- [Framer Motion](https://www.framer.com/motion/): Biblioteca de animaciones
- [Zod](https://zod.dev/): Validación de esquemas TypeScript
- [Vitest](https://vitest.dev/): Framework de testing unitario

## Pre-requisitos

- Node.js v18.0.0 o superior
- pnpm o bun (opcional)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias (elegir uno):
```bash
pnpm install
# o
bun install
```

## Configuración del Entorno

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configurar las siguientes variables en el archivo `.env`:
```bash
NEXT_PUBLIC_API_URL=     # URL de la API backend
SESSION_SECRET=          # Clave secreta para Iron Session
```

## Scripts Disponibles

```bash
# Desarrollo con Turbopack
pnpm dev

# Construcción para producción
pnpm build

# Iniciar en modo producción
pnpm start

# Ejecutar linter
pnpm lint

# Ejecutar tests
pnpm test
```

## Estructura del Proyecto

```
src/
├── actions/              # Server Actions de Next.js
├── app/                  # App Router de Next.js
│   ├── dashboard/       # Rutas del dashboard
│   ├── login/          # Rutas de autenticación
│   └── signup/         # Rutas de registro
├── components/          # Componentes reutilizables
│   ├── login/          # Componentes específicos de login
│   └── signup/         # Componentes específicos de registro
├── context/            # Contextos de React
├── lib/                # Utilidades y configuraciones
└── middleware.ts       # Middleware de Next.js
```

## Componentes UI

El proyecto utiliza componentes personalizados basados en TailwindUI y HeadlessUI, incluyendo:

- Alert
- Avatar
- Badge
- Banner
- Button
- Dialog
- Dropdown
- Forms (Input, Select, Checkbox, etc.)
- Layout Components (Sidebar, StackedLayout)
- Navigation Components
- ... y más

## Testing

Los tests unitarios se realizan con Vitest y React Testing Library. Para ejecutar los tests:

```bash
pnpm test
```

## Linting y Formateo

El proyecto utiliza:
- ESLint con la configuración de Next.js
- Husky para git hooks
- lint-staged para linting automático en commits

## Características Principales

- 🔐 Autenticación MFA
- 🎨 UI Moderna y Responsiva
- ⚡ Rendimiento Optimizado con Turbopack
- 📱 Diseño Mobile-First
- ♿ Componentes Accesibles
- 🔄 Gestión de Estado con Context API
- 🧪 Testing Automatizado
- 🚀 Server Actions para manejo seguro de peticiones al servidor
- 🛡️ Headers de Seguridad Configurados


[Todo el contenido anterior hasta Características Principales se mantiene igual...]

## Características Principales

- 🔐 Autenticación MFA
- 🎨 UI Moderna y Responsiva
- 🌐 Internacionalización (soporte para banderas de MX, US, CA)
- ⚡ Rendimiento Optimizado con Turbopack
- 📱 Diseño Mobile-First
- ♿ Componentes Accesibles
- 🔄 Gestión de Estado con Context API
- 🧪 Testing Automatizado

## Seguridad

El frontend implementa varias medidas de seguridad para proteger los datos y la experiencia del usuario:

### Autenticación y Sesiones
- Implementación de MFA (Multi-Factor Authentication)
- Sesiones encriptadas usando Iron Session
- Tokens de sesión con tiempo de expiración
- Manejo seguro de desconexión y limpieza de sesión

### Protección de Rutas
- Middleware de autenticación en rutas protegidas
- Redirección automática para usuarios no autenticados
- Validación de roles y permisos por ruta

### Manejo de Datos
- Validación de formularios con Zod
- Sanitización de inputs del usuario
- Encriptación de datos sensibles antes de envío
- No almacenamiento de información sensible en localStorage

### Protección contra Ataques Comunes
- Implementación de CSP (Content Security Policy)
- Protección contra XSS con Next.js built-in security
- Prevención de CSRF usando tokens
- Rate limiting en formularios y acciones críticas
