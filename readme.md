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

### **0.1. Tu nombre completo:** Leonardo Benítez Núñez

### **0.2. Nombre del proyecto:** TaskDistributor

### **0.3. Descripción breve del proyecto:**

TaskDistributor es una aplicación web que mejora la planificación de proyectos tecnológicos, superando las limitaciones del sistema actual basado en Redmine. La herramienta centraliza la gestión de tareas, proporciona un innovador sistema de recomendación para la asignación óptima de equipos, y ofrece visualización en tiempo real mediante KPIs y diagramas Gantt. Permite diferenciar roles entre usuarios de negocio y tecnología, con permisos específicos para cada uno. El sistema se integra con Redmine y proporciona alertas automatizadas para facilitar la gestión proactiva de los proyectos, mejorando la comunicación entre departamentos y optimizando el uso de recursos de desarrollo.

### **0.4. URL del proyecto:**

> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio

> Puedes tenerlo alojado en público o en privado, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/). También puedes compartir por correo un archivo zip con el contenido


---

## 1. Descripción general del producto

> Describe en detalle los siguientes aspectos del producto:

### **1.1. Objetivo:**

> Propósito del producto. Qué valor aporta, qué soluciona, y para quién.

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

> Enumera y describe las características y funcionalidades específicas que tiene el producto para satisfacer las necesidades identificadas.

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
> Usa el formato que consideres más adecuado para representar los componentes principales de la aplicación y las tecnologías utilizadas. Explica si sigue algún patrón predefinido, justifica por qué se ha elegido esta arquitectura, y destaca los beneficios principales que aportan al proyecto y justifican su uso, así como sacrificios o déficits que implica.


### **2.2. Descripción de componentes principales:**

> Describe los componentes más importantes, incluyendo la tecnología utilizada

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

> Representa la estructura del proyecto y explica brevemente el propósito de las carpetas principales, así como si obedece a algún patrón o arquitectura específica.

### **2.4. Infraestructura y despliegue**

> Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue

### **2.5. Seguridad**

> Enumera y describe las prácticas de seguridad principales que se han implementado en el proyecto, añadiendo ejemplos si procede

### **2.6. Tests**

> Describe brevemente algunos de los tests realizados

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

> Recomendamos usar mermaid para el modelo de datos, y utilizar todos los parámetros que permite la sintaxis para dar el máximo detalle, por ejemplo las claves primarias y foráneas.


### **3.2. Descripción de entidades principales:**

> Recuerda incluir el máximo detalle de cada entidad, como el nombre y tipo de cada atributo, descripción breve si procede, claves primarias y foráneas, relaciones y tipo de relación, restricciones (unique, not null…), etc.

---

## 4. Especificación de la API

> Si tu backend se comunica a través de API, describe los endpoints principales (máximo 3) en formato OpenAPI. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad

---

## 5. Historias de Usuario

> Documenta 3 de las historias de usuario principales utilizadas durante el desarrollo, teniendo en cuenta las buenas prácticas de producto al respecto.

**Historia de Usuario 1**

**Historia de Usuario 2**

**Historia de Usuario 3**

---

## 6. Tickets de Trabajo

> Documenta 3 de los tickets de trabajo principales del desarrollo, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto. 

**Ticket 1**

**Ticket 2**

**Ticket 3**

---

## 7. Pull Requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto

**Pull Request 1**

**Pull Request 2**

**Pull Request 3**

