# TaskDistributor - Base de Datos

Este repositorio contiene la configuración de la base de datos para el proyecto TaskDistributor, un sistema de gestión y planificación de proyectos integrado con Redmine.

## Tecnologías utilizadas

- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **Supabase**: Plataforma de base de datos basada en PostgreSQL
- **Prisma**: ORM (Object-Relational Mapping) para Node.js
- **Node.js**: Entorno de ejecución para JavaScript

## Estructura del proyecto

```
taskdistributor-bbdd/
├── prisma/
│   ├── schema.prisma    # Esquema de la base de datos con Prisma
│   └── seed.js          # Script para poblar la base de datos con datos iniciales
├── scripts/
│   ├── partition_setup.sql  # Script SQL para particionamiento
│   └── run-partition.js     # Script para ejecutar el particionamiento
├── .env.example         # Ejemplo de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Este archivo
```

## Requisitos previos

1. Node.js (versión 14 o superior)
2. Cuenta en Supabase
3. Proyecto creado en Supabase

## Configuración inicial

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd taskdistributor
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Actualiza las credenciales de conexión a Supabase en el archivo `.env`:
     ```
     DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres?schema=public"
     SUPABASE_URL="https://[TU_PROJECT_REF].supabase.co"
     SUPABASE_ANON_KEY="[TU_ANON_KEY]"
     SUPABASE_SERVICE_ROLE_KEY="[TU_SERVICE_ROLE_KEY]"
     ```

## Creación de la base de datos

1. **Generar el cliente Prisma**:
   ```bash
   npm run prisma:generate
   ```

2. **Crear las tablas en la base de datos**:
   ```bash
   npm run prisma:migrate
   ```

3. **Configurar particionamiento para la tabla historial_estimaciones**:
   ```bash
   npm run db:partition
   ```

4. **Poblar la base de datos con datos iniciales**:
   ```bash
   npm run db:seed
   ```

## Visualización de la base de datos

Para explorar la base de datos de forma visual, puedes ejecutar Prisma Studio:
```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde podrás ver y editar los datos.

## Estructura de la base de datos

La base de datos sigue el modelo de datos detallado en la documentación del proyecto e incluye:

- **tareas_extended**: Información adicional de tareas que no existe en Redmine
- **equipos**: Equipos de desarrollo disponibles
- **departamentos**: Departamentos de negocio
- **matriz_afinidad**: Relación de afinidad entre equipos y departamentos
- **asignaciones**: Asignación de tareas a equipos
- **historial_estimaciones**: Historial de cambios en estimaciones (tabla particionada)
- **users**: Usuarios del sistema con sus roles

## Particionamiento

La tabla `historial_estimaciones` está particionada por rango de fechas (`fecha_cambio`):
- Cada partición contiene los datos de un año completo
- Las particiones se nombran como `historial_estimaciones_y[AÑO]`
- Se incluye una función para crear nuevas particiones automáticamente

Para crear una nueva partición para un año específico, puedes ejecutar este SQL en Supabase:
```sql
SELECT crear_particion_historial_estimaciones(2026);
```

## Mantenimiento

Para resetear completamente la base de datos:
```bash
npm run db:reset
```

## Troubleshooting

Si encuentras problemas con la conexión a Supabase, verifica:
1. Que las credenciales en el archivo `.env` sean correctas
2. Que la IP desde donde te conectas esté en la lista de permitidas en Supabase
3. Que el usuario tenga permisos suficientes para crear/modificar tablas 