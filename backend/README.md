# TaskDistributor Backend

Backend para la aplicación TaskDistributor, un sistema de planificación y asignación de tareas que mejora la gestión de proyectos tecnológicos.

## Estructura del Proyecto

```
backend/
├── node_modules/        # Dependencias instaladas
├── prisma/              # Configuración y migraciones de Prisma
│   ├── migrations/      # Migraciones generadas por Prisma
│   └── schema.prisma    # Esquema de base de datos
├── src/                 # Código fuente
│   ├── api/             # Módulos de la API
│   │   ├── controllers/ # Controladores de la API
│   │   ├── middlewares/ # Middlewares
│   │   ├── models/      # Modelos (interfaces/tipos)
│   │   ├── routes/      # Definición de rutas
│   │   ├── services/    # Servicios
│   │   └── utils/       # Funciones de utilidad
│   ├── config/          # Configuración global
│   ├── database/        # Lógica de interacción con BD (si se necesita además de Prisma)
│   ├── docs/            # Documentación adicional
│   └── server.js        # Punto de entrada de la aplicación
├── .env                 # Variables de entorno (no incluir en control de versiones)
├── .env.example         # Ejemplo de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Este archivo
```

## Requisitos

- Node.js 16.x o superior
- PostgreSQL 13.x o superior

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <repositorio>
   cd <repositorio>/backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo .env basado en .env.example y configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita el archivo .env con los valores correctos
   ```

4. Genera el cliente Prisma:
   ```bash
   npm run prisma:generate
   ```

5. Ejecuta las migraciones de la base de datos:
   ```bash
   npm run prisma:migrate
   ```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## Documentación de la API

Una vez iniciada la aplicación, la documentación de la API estará disponible en:

```
http://localhost:4000/api-docs
```

## Características Principales

- **Autenticación segura con JWT**: Sistema completo con registro, login, recuperación de contraseña
- **Gestión de usuarios con roles**: Administrador, Negocio, Tecnología, Usuario
- **Seguridad**: Implementación de mejores prácticas (rate limiting, helmet, validación de datos)
- **Documentación API**: Generada automáticamente con Swagger
- **ORM con Prisma**: Interacción segura y tipada con la base de datos
- **API RESTful**: Endpoints bien estructurados y documentados

## Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter para verificar la calidad del código
- `npm run format`: Formatea el código siguiendo las convenciones
- `npm run prisma:init`: Inicializa Prisma
- `npm run prisma:migrate`: Ejecuta las migraciones de la base de datos
- `npm run prisma:generate`: Genera el cliente Prisma
- `npm run prisma:studio`: Inicia el explorador visual de la base de datos Prisma 