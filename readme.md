## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Nombre completo:** Leonardo Benítez Núñez

### **0.2. Nombre del proyecto:** TaskDistributor

### **0.3. Descripción breve del proyecto:**

TaskDistributor es una aplicación web que mejora la planificación de proyectos tecnológicos, superando las limitaciones del sistema actual basado en Redmine. La herramienta centraliza la gestión de tareas, proporciona un innovador sistema de recomendación para la asignación óptima de equipos, y ofrece visualización en tiempo real mediante KPIs y diagramas Gantt. Permite diferenciar roles entre usuarios de negocio y tecnología, con permisos específicos para cada uno. El sistema se integra con Redmine y proporciona alertas automatizadas para facilitar la gestión proactiva de los proyectos, mejorando la comunicación entre departamentos y optimizando el uso de recursos de desarrollo.

### **0.4. URL del proyecto:**

> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio

> Puedes tenerlo alojado en público o en privado, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/). También puedes compartir por correo un archivo zip con el contenido


---

## 1. Descripción general del producto

### **1.1. Objetivo:**

Task Distributor es una herramienta destinada a mejorar la planificación de proyectos de tecnología, haciéndola más ágil y efectiva. Su propósito principal es cubrir la necesidad que tiene la compañía de disponer de un sistema de planificación que supere las limitaciones del sistema actual basado en Redmine.

**Valor que aporta:**
- Centraliza la gestión de planificación de proyectos en una única herramienta
- Proporciona visibilidad en tiempo real del estado de los proyectos
- Facilita la comunicación entre los equipos de negocio y tecnología
- Optimiza la asignación de recursos mediante un sistema de recomendación

**Problemas que soluciona:**
- Falta de visibilidad sobre el estado de las tareas
- Dificultades en la gestión mediante Redmine por parte de negocio
- Deficiente actualización de tareas por los equipos de desarrollo
- Planificación de tareas sin visibilidad completa de las cargas de trabajo
- Cambios constantes en prioridades y necesidades

**Usuarios objetivo:**
- Equipos de negocio (rol "negocio")
- Equipos de tecnología (rol "tecnología")

### **1.2. Características y funcionalidades principales:**

**Gestión de tareas:**
- Creación de tareas con sincronización automática con Redmine
- Edición de información de tareas
- Asignación de tareas a equipos (exclusivo rol tecnología)
- Planificación de fechas de inicio y fin (exclusivo rol tecnología)
- Borrado de tareas según permisos por rol

**Sistema de recomendación de asignación de tareas:**
- Algoritmo que propone el mejor equipo para cada tarea
- Evaluación de métricas como carga de trabajo, estimación en sprints y capacidad de equipos
- Cálculo de posibles fechas de inicio y fin para cada asignación posible
- Priorización basada en matriz de afinidad entre equipos y departamentos

**Visualización de información:**
- KPIs generales, para negocio y para tecnología
- Visualización gráfica tipo Gantt de la planificación en tiempo real
- Código de colores para identificar el estado de las tareas
- Vista de proyectos planificados y pendientes de planificar

**Sistema de alertas:**
- Notificaciones sobre fechas de fin próximas o sobrepasadas
- Alertas sobre tareas sin responsable o funcional asignado
- Notificaciones de tareas sin estimación inicial
- Alertas sobre modificaciones de fechas
- Avisos sobre necesidad de proyectos en departamentos o equipos

**Gestión de capacidades:**
- Configuración de equipos de desarrollo internos y externos
- Definición de capacidades y afinidades de equipos
- Matriz de asignación entre equipos y departamentos
- Control de carga de trabajo por equipo

### **1.3. Diseño y experiencia de usuario:**

> Proporciona imágenes y/o videotutorial mostrando la experiencia del usuario desde que aterriza en la aplicación, pasando por todas las funcionalidades principales.

### **1.4. Instrucciones de instalación:**
> Documenta de manera precisa las instrucciones para instalar y poner en marcha el proyecto en local (librerías, backend, frontend, servidor, base de datos, migraciones y semillas de datos, etc.)

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**
La información detallada sobre el diagrama de arquitectura, la justificación de la arquitectura elegida, los beneficios y las limitaciones se encuentra en [Diseño del Sistema a Alto Nivel - Diagrama de Arquitectura](docs/prd/prd.md#3-diseño-del-sistema-a-alto-nivel).

### **2.2. Descripción de componentes principales:**
Para una descripción completa de los componentes principales del sistema, incluyendo las tecnologías utilizadas y sus responsabilidades, consulte [Diseño del Sistema a Alto Nivel - Componentes Principales](docs/prd/prd.md#componentes-principales).

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**
La información sobre la estructura del proyecto se basa en la arquitectura descrita en [Diseño del Sistema a Alto Nivel](docs/prd/prd.md#3-diseño-del-sistema-a-alto-nivel), siguiendo un patrón de microservicios que separa claramente las responsabilidades entre los diferentes componentes.

### **2.4. Infraestructura y despliegue**

> Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue

### **2.5. Seguridad**

> Enumera y describe las prácticas de seguridad principales que se han implementado en el proyecto, añadiendo ejemplos si procede

### **2.6. Tests**

> Describe brevemente algunos de los tests realizados

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

El diagrama entidad-relación completo del sistema TaskDistributor se encuentra en [Diagrama del Modelo de Datos](docs/modeloDatos/modeloDatos.md#1-diagrama-del-modelo-de-datos).

### **3.2. Descripción de entidades principales:**

La descripción detallada de cada entidad, sus atributos, relaciones y restricciones se encuentra en [Descripción de Entidades](docs/modeloDatos/modeloDatos.md#2-descripción-de-entidades).

Las entidades principales del sistema son:

- **TAREA_EXTENDED**: Almacena la información adicional que complementa las tareas de Redmine, como orden de prioridad, factor de carga y estimaciones.
- **EQUIPO**: Gestiona la información de los equipos de desarrollo disponibles.
- **DEPARTAMENTO**: Almacena los departamentos de negocio.
- **MATRIZ_AFINIDAD**: Establece la relación de afinidad entre equipos y departamentos para el sistema de recomendación.
- **ASIGNACION**: Registra la asignación histórica de tareas a equipos.
- **HISTORIAL_ESTIMACION**: Almacena el historial de cambios en estimaciones para auditoría.

El modelo ha sido diseñado específicamente para complementar la información existente en Redmine sin duplicarla, centrándose en almacenar solo los datos adicionales que necesita TaskDistributor para su funcionamiento.

Para implementación y consideraciones adicionales, consulte [Notas de Implementación](docs/modeloDatos/modeloDatos.md#3-notas-de-implementación).

---

## 4. Especificación de la API

> Si tu backend se comunica a través de API, describe los endpoints principales (máximo 3) en formato OpenAPI. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad

---

## 5. Historias de Usuario

Las historias de usuario principales a desarrollar para el MVP del proyecto TaskDistributor son:

1. [US-08: Visualización y gestión de tareas](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-08-visualización-y-gestión-de-tareas) - Proporciona un listado configurable para visualizar y gestionar todas las tareas.

2. [US-05: Estimación de tarea por tecnología](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-05-estimación-de-tarea-por-tecnología) - Facilita a los usuarios de tecnología estimar el tiempo necesario para cada tarea.

3. [US-06: Asignación de equipo y planificación de tarea](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-06-asignación-de-equipo-y-planificación-de-tarea) - Implementa el sistema de recomendación para asignar equipos a tareas.

Adicionalmente, en función del tiempo disponible, sería interesante abordar las historias:

4. [US-03: Priorización de tareas en backlog](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-03-priorización-de-tareas-en-backlog) - Permite a los usuarios de negocio establecer el orden de prioridad de las tareas.

5. [US-10: Visualización de capacidad de equipos](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-10-visualización-de-capacidad-de-equipos) - Muestra la capacidad y carga actual de los equipos.

6. [US-11: Visualización de tareas planificadas en Gantt](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md#us-11-visualización-de-tareas-planificadas-en-gantt) - Permite visualizar las tareas planificadas en formato Gantt.

Para ver todas las historias de usuario y su priorización en el backlog, consulte el [documento completo de Historias de Usuario y Backlog](docs/historiasUsuario-backlog/historiasUsuarioYBacklog.md).

## 6. Tickets de Trabajo

Los tickets de trabajo detallados para las principales historias de usuario se encuentran en los siguientes enlaces:

- [Tickets para US-08: Visualización y gestión de tareas](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-08.md) - Incluye implementación de interfaz, filtros avanzados y funcionalidades de búsqueda.
- [Tickets para US-05: Estimación de tarea por tecnología](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-05.md) - Describe la persistencia de estimaciones y factor de carga.
- [Tickets para US-06: Asignación de equipo y planificación de tarea](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-06.md) - Detalla la implementación del sistema de recomendación.

Adicionalmente, en función del tiempo disponible, sería interesante abordar los tickets:

- [Tickets para US-03: Priorización de tareas en backlog](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-03.md) - Incluye el desarrollo del mecanismo de drag & drop y persistencia del orden.
- [Tickets para US-10: Visualización de capacidad de equipos](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-10.md) - Incluye el desarrollo del cálculo y almacenamiento de capacidad.
- [Tickets para US-11: Visualización de tareas planificadas en Gantt](docs/historiasUsuario-backlog/ticketsTrabajo/ticketsTrabajo-US-11.md) - Detalla la implementación del diagrama Gantt y sus controles.



---

## 7. Pull Requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto

**Pull Request 1**

**Título:** No se realizó Pull Request para la Entrega 1

**Descripción:** 
Para la primera entrega del proyecto no se realizó pull request debido a que no se conocía el formato de entrega requerido. En su lugar, se realizó la entrega de todo el trabajo desarrollado hasta ese momento de la aplicación TaskDistributor a través del formulario correspondiente proporcionado para la entrega.

**Cambios incluidos en la entrega 1:**
- Documentación inicial del proyecto (PRD, modelo de datos, historias de usuario)

**Pull Request 2**

**Título:** Implementación de la estructura base del proyecto TaskDistributor

**Descripción:** 
Esta pull request establece la arquitectura fundamental del proyecto TaskDistributor, implementando la estructura completa del frontend y backend, el modelo de datos definitivo y la configuración del entorno de desarrollo con Redmine local.

**Frontend (@frontend):**
- **Tecnologías implementadas:** React 19.1.0 con TypeScript, React Router DOM para navegación, Bootstrap 5.3.6 para estilos
- **Arquitectura:** Estructura modular organizada en `components/`, `pages/`, `services/`, `hooks/`, `context/`, `types/` y `utils/`
- **Componentes desarrollados:** 
  - Estructura base en `components/layout/` para la navegación y layout principal
  - Módulo `components/tasks/` para la gestión de tareas
  - Módulo `components/gantt/` para visualización de diagramas Gantt
- **Librerías integradas:** 
  - Axios para comunicación con API
  - Formik + Yup para manejo de formularios y validaciones
  - Recharts para gráficos y visualizaciones
  - FontAwesome para iconografía
  - JWT-decode para manejo de autenticación
- **Configuración:** Setup completo de TypeScript con tipos personalizados, configuración de testing con Jest y React Testing Library

**Backend (@backend):**
- **Tecnologías implementadas:** Node.js 18+ con Express.js 4.21.2, Prisma ORM 6.8.2, PostgreSQL
- **Arquitectura:** Estructura de API REST organizada en `routes/`, `controllers/`, `services/`, `middlewares/`, `models/` y `utils/`
- **Funcionalidades base:**
  - Sistema de autenticación con JWT y bcrypt
  - Middleware de seguridad (Helmet, CORS, rate limiting)
  - Logging con Morgan
  - Configuración de entorno con dotenv
- **Scripts automatizados:**
  - `db:setup`: Pipeline completo de configuración de base de datos
  - `db:partition`: Scripts para particionamiento de tablas de historial
  - `db:seed`: Población inicial de datos de prueba
  - `prisma:*`: Gestión completa del schema y migraciones

**Schema Prisma (@schema.prisma):**
- **Modelo de datos implementado:** 6 entidades principales con relaciones completas
  - `TareaExtended`: Almacena información adicional de tareas de Redmine (orden prioridad, factor carga, estimaciones)
  - `Equipo`: Gestión de equipos internos/externos con capacidades y tipos
  - `Departamento`: Departamentos de negocio con estados activo/inactivo
  - `MatrizAfinidad`: Relaciones de afinidad equipo-departamento para el sistema de recomendación
  - `Asignacion`: Historial de asignaciones de tareas a equipos
  - `HistorialEstimacion`: Auditoría de cambios en estimaciones (preparado para particionamiento)
  - `User`: Sistema de autenticación con roles (NEGOCIO, TECNOLOGIA, ADMIN)
- **Optimizaciones implementadas:**
  - Índices estratégicos en campos de búsqueda frecuente
  - Constraints únicos para integridad de datos
  - Mapeo personalizado de nombres de tablas y campos
  - Preparación para particionamiento por fechas en tabla de historial

**Entorno de desarrollo (@redmine-docker):**
- **Servidor Redmine local:** Configuración completa con Docker Compose para desarrollo y testing
- **Servicios incluidos:**
  - Redmine con base de datos PostgreSQL dedicada
  - Nginx como reverse proxy
  - Scripts de inicialización automática
  - Configuración de plugins y personalización
- **Integración:** Variables de entorno configuradas para conexión con el backend de TaskDistributor
- **Beneficios:** Entorno aislado y reproducible para pruebas sin dependencia de sistemas externos

**Cambios técnicos destacados:**
- Configuración de TypeScript estricta en frontend
- Implementación de middleware de seguridad y validación en backend
- Sistema de migraciones automáticas con Prisma
- Configuración de testing y linting en ambos proyectos
- Variables de entorno documentadas y ejemplos incluidos

**Estado del proyecto:**
La estructura base está completamente funcional y preparada para el desarrollo de las historias de usuario principales. El entorno permite desarrollo local independiente (por ahora no están interconectadas entre si) con todas las herramientas necesarias para testing e integración.
Se han implementado las funcionalidades de algunos casos de uso principales, pero aún falta la integración completa entre Redmine y TaskDistributor.

**Pull Request 3**

