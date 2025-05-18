# Frontend TaskDistributor

Este proyecto contiene el frontend de la aplicación TaskDistributor, una herramienta para la planificación y gestión de proyectos de tecnología.

## Tecnologías utilizadas

- React 19.1.0
- TypeScript
- React Router DOM para el enrutamiento
- Axios para las peticiones HTTP
- Bootstrap y React-Bootstrap para los componentes UI
- Font Awesome para los iconos
- Recharts para gráficos
- Formik y Yup para formularios y validación

## Estructura del proyecto

```
frontend/
├── public/             # Archivos públicos
├── src/                # Código fuente
│   ├── assets/         # Recursos estáticos (imágenes, estilos globales)
│   ├── components/     # Componentes reutilizables
│   │   └── layout/     # Componentes de layout (Navbar, Sidebar)
│   ├── context/        # Contextos de React (Auth, etc.)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas/vistas de la aplicación
│   ├── services/       # Servicios para API y lógica externa
│   ├── types/          # Definiciones de TypeScript
│   └── utils/          # Utilidades y funciones auxiliares
├── package.json        # Dependencias
└── tsconfig.json       # Configuración de TypeScript
```

## Características principales

- **Autenticación:** Sistema de autenticación basado en JWT con roles diferenciados (negocio/tecnología/admin)
- **Dashboard:** Panel principal con KPIs y visión general del sistema
- **Gestión de tareas:** Vista de listado y detalle de tareas con filtros avanzados
- **Planificación Gantt:** Visualización y gestión de tareas planificadas en formato Gantt
- **Gestión de equipos:** Vista de equipos y su capacidad
- **Alertas:** Sistema de notificaciones y alertas

## Inicio rápido

Para iniciar el proyecto en modo desarrollo:

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Integración con el backend

El frontend se comunica con el backend a través de una API REST. La configuración de la URL del API se puede modificar mediante variables de entorno:

- `REACT_APP_API_URL`: URL base del API (por defecto: http://localhost:3001/api)

## Roles de usuario

La aplicación contempla los siguientes roles:

- **Negocio:** Acceso a creación y priorización de tareas, visualización de KPIs relevantes para negocio
- **Tecnología:** Acceso a estimación, asignación y planificación de tareas, gestión de equipos
- **Admin:** Acceso total a la aplicación, incluyendo configuración avanzada

## Seguridad

- Implementación de JWT para autenticación
- Protección de rutas basada en roles
- Validación de formularios en el cliente
- Sanitización de datos antes de enviarlos al backend

## Desarrollo futuro

- Implementación de pruebas unitarias y de integración
- Soporte para PWA (Progressive Web App)
- Mejorar la accesibilidad (WCAG)
- Soporte para temas claro/oscuro
