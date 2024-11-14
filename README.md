Este es un proyecto de prueba para la empresa [Creze](https://creze.com/), para la posición de desarrollador fullstack.

## Descripción

El objetivo principal de este proyecto es crear una aplicación web que permita a los usuarios registrarse, iniciar sesión utilizando MFA (Multi-Factor Authentication) y ver su perfil. Orientando principalmente a la seguridad de los datos de los usuarios.


## Tecnologías utilizadas

- [Node.js](https://nodejs.org/) 
- [Next.js](https://nextjs.org/) 
- [TypeScript](https://www.typescriptlang.org/)
- [Iron Session](https://get-iron-session.vercel.app/)
- [FontAwesome](https://fontawesome.com/)
- [Vitest](https://vitest.dev/)

### Pre requisitos para la instalación

- Node.js v18.0.0 or higher
- pnpm or bun (optional)

### Installation of Dependencies

Para instalar las dependencias del proyecto, se puede utilizar `npm`, `pnpm` o `bun`.

```bash
pnpm install
```

```bash
bun install
```

### environment preparation

Antes de ejecutar el proyecto, es necesario crear un archivo `.env` en la raíz del proyecto, con las siguientes variables de entorno.

`NEXT_PUBLIC_API_URL` - URL de la API
`SESSION_SECRET` - Clave secreta para la sesión

también se puede copiar el archivo `.env.example` y renombrarlo a `.env`.

```bash
cp .env.example .env
```

### Ejecutar el proyecto

Para ejecutar el proyecto en modo de desarrollo, se puede utilizar el siguiente comando.

```bash
pnpm dev
```

```bash
bun dev
```

### Pruebas unitarias

Para ejecutar las pruebas unitarias, se puede utilizar el siguiente comando.

```bash
pnpm test
```

```bash
bun run test
```




