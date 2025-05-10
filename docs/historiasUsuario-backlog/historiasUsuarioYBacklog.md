# Historias de Usuario y Backlog del Producto - TaskDistributor

## Historias de Usuario

<!-- GRUPO: GESTIÓN DE TAREAS -->

### US-01: Creación de tarea por usuario de negocio

**Como** usuario de negocio,  
**quiero** crear una nueva tarea en el sistema,  
**para que** pueda solicitar desarrollos al departamento de tecnología.

#### Criterios de Aceptación
- El formulario debe incluir todos los campos obligatorios (asunto, descripción, prioridad, responsable, funcional)
- Al crear la tarea, debe sincronizarse automáticamente con Redmine
- La tarea creada debe aparecer en el listado de tareas pendientes de planificación
- El usuario debe recibir confirmación visual de que la tarea se ha creado correctamente
- Se debe poder seleccionar cualquier usuario con rol de negocio como responsable
- El responsable asignado debe recibir una notificación
- Se debe poder adjuntar documentos o proporcionar enlaces a documentos funcionales
- El sistema debe validar los formatos de archivo permitidos para documentos funcionales

#### Notas Adicionales
- La interfaz debe seguir las guías de diseño establecidas para TaskDistributor
- Los campos requeridos son: asunto, descripción, prioridad, departamento y responsable
- Debe existir un buscador predictivo para facilitar la selección de usuarios responsables
- La tarea debe marcarse visualmente como "con responsable asignado"
- Formatos permitidos para documentos funcionales: PDF, DOC, DOCX, URL
- Tamaño máximo de archivo: 10MB
- La creación no debe tardar más de 2 segundos en completarse

#### Historias de Usuario Relacionadas
- US-02: Edición de tarea por usuario de negocio
- US-03: Priorización de tareas en backlog
- US-08: Visualización de tareas pendientes de planificar

#### Tareas
- Diseñar interfaz de formulario de creación
- Implementar validaciones de campos
- Implementar selector de usuarios con filtrado por rol negocio
- Implementar componente de carga/referencia de documentos funcionales
- Desarrollar validaciones de formato y tamaño para documentos
- Desarrollar integración con API de Redmine para creación
- Implementar sistema de notificaciones
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-01: Creación de tarea | Alto | Alta | Alta (8) | Medio - Depende de disponibilidad de API Redmine |

---

### US-02: Edición de tarea por usuario de negocio

**Como** usuario de negocio,  
**quiero** editar una tarea existente,  
**para que** pueda actualizar su información o corregir errores.

#### Criterios de Aceptación
- Se deben poder editar todos los campos permitidos para el rol negocio, incluyendo responsable y funcional
- Los cambios deben sincronizarse automáticamente con Redmine
- El usuario debe recibir confirmación visual de que la tarea se ha actualizado correctamente
- No debe permitir editar los campos exclusivos de tecnología (equipo asignado, fechas de inicio/fin)
- Al cambiar el responsable, el nuevo responsable debe recibir una notificación
- Se debe poder actualizar o añadir documentos funcionales
- El sistema debe validar los formatos de archivo permitidos

#### Notas Adicionales
- La interfaz debe mostrar claramente qué campos son editables y cuáles no
- Debe existir un buscador predictivo para facilitar la selección de usuarios responsables
- Formatos permitidos para documentos funcionales: PDF, DOC, DOCX, URL
- Tamaño máximo de archivo: 10MB

#### Historias de Usuario Relacionadas
- US-01: Creación de tarea por usuario de negocio
- US-03: Priorización de tareas en backlog

#### Tareas
- Diseñar interfaz de formulario de edición
- Implementar permisos según rol
- Implementar selector de usuarios con filtrado por rol negocio
- Implementar componente de actualización de documentos funcionales
- Desarrollar validaciones de formato y tamaño para documentos
- Desarrollar integración con API de Redmine para actualización
- Implementar sistema de notificaciones
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-02: Edición de tarea | Alto | Alta | Media (6) | Bajo |

---

### US-03: Priorización de tareas en backlog

**Como** usuario de negocio,  
**quiero** priorizar las tareas en el backlog,  
**para que** el equipo de tecnología sepa qué tareas debe abordar primero.

#### Criterios de Aceptación
- Se debe poder reordenar tareas mediante drag & drop
- El sistema debe guardar y mantener el orden de prioridad definido
- La priorización debe sincronizarse con Redmine
- El sistema debe mostrar claramente el orden de prioridad actual

#### Notas Adicionales
- Se debe mostrar un indicador visual de la prioridad de cada tarea
- Solo se pueden priorizar tareas que tengan responsable y funcional asignados

#### Historias de Usuario Relacionadas
- US-01: Creación de tarea por usuario de negocio
- US-08: Visualización de tareas pendientes de planificar

#### Tareas
- Implementar interfaz de drag & drop para reordenación
- Desarrollar mecanismo de persistencia de orden de prioridad
- Integrar con API de Redmine para actualización
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-03: Priorización de tareas | Alto | Alta | Media (5) | Bajo |

---

### US-04: Borrado de tareas

**Como** usuario de negocio o tecnología,  
**quiero** borrar tareas según mis permisos,  
**para que** pueda eliminar tareas que ya no son relevantes.

#### Criterios de Aceptación
- Los usuarios de negocio solo pueden borrar tareas sin planificar
- Los usuarios de tecnología pueden borrar cualquier tarea sin tiempo imputado
- La operación debe pedir confirmación antes de proceder
- El borrado debe sincronizarse con Redmine

#### Notas Adicionales
- Se debe mantener un registro de las tareas borradas
- Debe mostrar claramente si una tarea puede ser borrada o no según permisos

#### Historias de Usuario Relacionadas
- US-01: Creación de tarea por usuario de negocio
- US-02: Edición de tarea por usuario de negocio

#### Tareas
- Implementar lógica de permisos de borrado
- Desarrollar interfaz de confirmación
- Integrar con API de Redmine
- Implementar registro de borrados
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-04: Borrado de tareas | Medio | Media | Baja (2) | Bajo |

---

<!-- GRUPO: GESTIÓN DE PLANIFICACIÓN -->

### US-05: Estimación de tarea por tecnología

**Como** usuario de tecnología,  
**quiero** estimar el tiempo necesario para una tarea en sprints y definir su factor de carga,  
**para que** pueda planificarse adecuadamente en el calendario.

#### Criterios de Aceptación
- Se debe poder ingresar un número de sprints estimados para la tarea
- Se debe poder definir el factor de carga de la tarea (1-5)
- El sistema debe validar que los valores sean números positivos
- La estimación y factor de carga deben sincronizarse con Redmine
- Se debe crear un campo personalizado en Redmine para el factor de carga

#### Notas Adicionales
- La interfaz debe mostrar una guía para la estimación (ej: 1 sprint = 2 semanas)
- Debe mostrar un historial de estimaciones si ha habido cambios
- El factor de carga representa la complejidad o esfuerzo relativo de la tarea

#### Historias de Usuario Relacionadas
- US-06: Asignación de equipo y planificación de tarea
- US-10: Visualización de capacidad de equipos

#### Tareas
- Implementar componente de entrada de estimación
- Implementar componente para factor de carga
- Desarrollar validaciones de valores
- Crear campo personalizado en Redmine para factor de carga
- Integrar con API de Redmine para actualización
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-05: Estimación de tarea | Alto | Alta | Media (4) | Medio - Requiere modificación en Redmine |

---

### US-06: Asignación de equipo y planificación de tarea

**Como** usuario de tecnología,  
**quiero** utilizar el sistema de recomendación para asignar un equipo a una tarea y planificar sus fechas,  
**para que** pueda elegir la opción más eficiente y establecer un calendario adecuado.

#### Criterios de Aceptación
- El sistema debe mostrar todos los equipos disponibles ordenados según la recomendación
- Para cada equipo debe mostrar métricas relevantes (carga actual, afinidad con el departamento, etc.)
- Al seleccionar un equipo, debe permitir asignar fechas de inicio y fin
- El sistema debe validar que la fecha fin sea posterior a la fecha inicio
- Las fechas deben sincronizarse con Redmine
- El sistema debe mostrar advertencias si hay conflictos con otras tareas del mismo equipo
- Debe permitir filtrar equipos por diversos criterios

#### Notas Adicionales
- El algoritmo de recomendación debe considerar: matriz de afinidad, capacidad actual, factor de carga
- La interfaz debe mostrar claramente por qué se recomienda cada equipo (transparencia del algoritmo)
- La interfaz debe incluir un calendario para facilitar la selección de fechas
- Debe respetar la disponibilidad del equipo seleccionado

#### Historias de Usuario Relacionadas
- US-05: Estimación de tarea por tecnología
- US-10: Visualización de capacidad de equipos
- US-11: Visualización de tareas planificadas en Gantt
- US-07: Definición de matriz de afinidad entre equipos y departamentos

#### Tareas
- Implementar algoritmo de recomendación
- Desarrollar interfaz de visualización de recomendaciones
- Implementar selector de fechas con validaciones
- Desarrollar lógica de verificación de conflictos
- Integrar con datos de equipos y cargas
- Implementar mecanismo de asignación y sincronización
- Integrar con API de Redmine para actualización
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-06: Asignación y planificación | Alto | Alta | Alta (10) | Alto - Requiere algoritmo complejo e integración con planificación |

---

### US-07: Definición de matriz de afinidad entre equipos y departamentos

**Como** administrador del sistema,  
**quiero** definir la afinidad entre equipos y departamentos,  
**para que** el sistema de recomendación pueda priorizar adecuadamente.

#### Criterios de Aceptación
- Se debe poder asignar un nivel de afinidad (1-5) entre cada equipo y departamento
- La interfaz debe permitir una configuración ágil tipo matriz
- Los cambios deben reflejarse inmediatamente en el sistema de recomendación
- Se debe mantener un historial de cambios

#### Notas Adicionales
- Debe incluir una visualización gráfica de la matriz para facilitar su configuración
- Debe permitir importar/exportar la configuración via CSV

#### Historias de Usuario Relacionadas
- US-06: Asignación de equipo y planificación de tarea
- US-09: Configuración de equipos de desarrollo

#### Tareas
- Implementar interfaz de matriz de configuración
- Desarrollar mecanismo de persistencia
- Implementar importación/exportación
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-07: Matriz de afinidad | Alto | Alta | Media (5) | Bajo |

---

<!-- GRUPO: GESTIÓN DE VISUALIZACIÓN -->

### US-08: Visualización de tareas pendientes de planificar

**Como** usuario de tecnología o negocio,  
**quiero** ver un listado de todas las tareas pendientes de planificar,  
**para que** pueda tener una visión clara del backlog.

#### Criterios de Aceptación
- El listado debe mostrar las tareas ordenadas por prioridad
- Se debe poder filtrar por departamento, estado, responsable, etc.
- Cada tarea debe mostrar información relevante (asunto, responsable, prioridad, etc.)
- Si el usuario es de negocio, solo debe ver las tareas de su departamento

#### Notas Adicionales
- Se debe poder exportar el listado a Excel

#### Historias de Usuario Relacionadas
- US-01: Creación de tarea por usuario de negocio
- US-03: Priorización de tareas en backlog

#### Tareas
- Implementar interfaz de listado con filtros
- Desarrollar mecanismo de carga eficiente de datos
- Implementar lógica de filtrado por rol de usuario
- Desarrollar funcionalidad de exportación
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-08: Visualización de backlog | Alto | Alta | Media (5) | Bajo |

---

### US-09: Configuración de equipos de desarrollo

**Como** administrador del sistema,  
**quiero** configurar los equipos de desarrollo disponibles,  
**para que** puedan ser asignados a tareas y considerados en el recomendador.

#### Criterios de Aceptación
- Se debe poder crear, editar y desactivar equipos
- Para cada equipo se debe poder configurar: nombre, tipo (interno/externo), capacidad
- Los cambios deben reflejarse inmediatamente en el sistema
- Se debe mantener un historial de cambios

#### Notas Adicionales
- La desactivación de un equipo no debe afectar a tareas ya asignadas
- Debe validar que no haya duplicados en nombres de equipo

#### Historias de Usuario Relacionadas
- US-06: Asignación de equipo y planificación de tarea
- US-10: Visualización de capacidad de equipos
- US-07: Definición de matriz de afinidad entre equipos y departamentos

#### Tareas
- Implementar CRUD de equipos
- Desarrollar validaciones de datos
- Implementar historial de cambios
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-09: Configuración de equipos | Alto | Alta | Media (5) | Bajo |

---

### US-10: Visualización de capacidad de equipos

**Como** usuario de tecnología,  
**quiero** visualizar la capacidad y carga actual de los equipos,  
**para que** pueda tomar mejores decisiones de asignación.

#### Criterios de Aceptación
- Se debe mostrar para cada equipo: capacidad total, carga actual y disponibilidad futura
- La información debe estar actualizada en tiempo real
- Se debe poder filtrar por periodo de tiempo, equipo, departamento, etc.
- Debe incluir visualización gráfica de ocupación

#### Notas Adicionales
- Se debe distinguir visualmente entre equipos internos y externos
- Debe indicar cuando un equipo está sobrecargado

#### Historias de Usuario Relacionadas
- US-06: Asignación de equipo y planificación de tarea
- US-09: Configuración de equipos de desarrollo

#### Tareas
- Implementar cálculo de capacidad y carga de equipos
- Desarrollar interfaz gráfica de visualización
- Implementar filtros y opciones de visualización
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-10: Visualización de capacidad | Alto | Alta | Media (5) | Medio - Requiere datos precisos |

---

### US-11: Visualización de tareas planificadas en Gantt

**Como** usuario de tecnología o negocio,  
**quiero** visualizar las tareas planificadas en un diagrama Gantt,  
**para que** pueda tener una visión clara de la planificación y los plazos.

#### Criterios de Aceptación
- El Gantt debe mostrar todas las tareas planificadas con sus fechas
- Se debe poder filtrar por departamento, equipo, periodo, etc.
- Debe usar códigos de colores para indicar el estado de las tareas
- Si el usuario es de negocio, solo debe ver las tareas de su departamento

#### Notas Adicionales
- La visualización debe ser interactiva permitiendo zoom y scroll
- Debe permitir exportar el Gantt a PDF

#### Historias de Usuario Relacionadas
- US-06: Asignación de equipo y planificación de tarea
- US-12: Visualización de KPIs

#### Tareas
- Implementar componente de visualización Gantt
- Desarrollar mecanismo de carga eficiente de datos
- Implementar filtros y controles de visualización
- Implementar exportación a PDF
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-11: Visualización Gantt | Alto | Alta | Alta (8) | Medio - Complejidad de visualización |

---

<!-- GRUPO: GESTIÓN DE KPIs -->

### US-12: Visualización de KPIs

**Como** usuario de tecnología o negocio,  
**quiero** visualizar KPIs relevantes sobre las tareas y proyectos,  
**para que** pueda tener una visión general del estado actual.

#### Criterios de Aceptación
- Se deben mostrar KPIs relevantes según el rol del usuario
- La información debe estar actualizada en tiempo real
- Se debe poder filtrar por departamento, periodo, equipo, etc.
- Los KPIs deben incluir visualizaciones gráficas

#### Notas Adicionales
- Debe permitir personalizar los KPIs visibles
- Debe incluir opción para exportar a PDF

#### Historias de Usuario Relacionadas
- US-08: Visualización de tareas pendientes de planificar
- US-11: Visualización de tareas planificadas en Gantt

#### Tareas
- Implementar cálculo de KPIs
- Desarrollar componentes de visualización gráfica
- Implementar filtros y personalización
- Implementar exportación
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-12: Visualización de KPIs | Alto | Alta | Alta (8) | Medio - Requiere datos de múltiples fuentes |

---

<!-- GRUPO: GESTIÓN DE ALERTAS -->

### US-13: Configuración de sistema de alertas

**Como** administrador del sistema,  
**quiero** configurar los parámetros de las alertas automáticas,  
**para que** se generen según las necesidades del negocio.

#### Criterios de Aceptación
- Se debe poder activar/desactivar cada tipo de alerta
- Para cada alerta se debe poder configurar: frecuencia, destinatarios, condiciones
- Los cambios deben aplicarse inmediatamente
- Se debe poder probar el envío de alertas desde la configuración

#### Notas Adicionales
- Debe permitir personalizar el contenido de las alertas

#### Historias de Usuario Relacionadas
- US-14: Recepción de alertas por correo

#### Tareas
- Implementar interfaz de configuración
- Desarrollar mecanismo de persistencia
- Implementar funcionalidad de prueba
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-13: Configuración de alertas | Medio | Media | Media (5) | Bajo |

---

### US-14: Recepción de alertas por correo

**Como** usuario del sistema,  
**quiero** recibir alertas por correo sobre eventos relevantes,  
**para que** pueda estar informado sin necesidad de entrar al sistema.

#### Criterios de Aceptación
- Las alertas deben enviarse automáticamente según la configuración del sistema
- El correo debe incluir información relevante y enlaces directos a las tareas

#### Notas Adicionales
- Debe respetar la frecuencia configurada para evitar spam

#### Historias de Usuario Relacionadas
- US-13: Configuración de sistema de alertas

#### Tareas
- Implementar servicio de envío de correos
- Desarrollar plantillas HTML para los correos
- Implementar lógica de agrupación de alertas
- Implementar preferencias de usuario
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-14: Alertas por correo | Alto | Media | Media (5) | Bajo |

---

<!-- GRUPO: AUTENTICACIÓN -->

### US-15: Autenticación de usuarios

**Como** usuario del sistema,  
**quiero** autenticarme de forma segura,  
**para que** pueda acceder a las funcionalidades según mis permisos.

#### Criterios de Aceptación
- El sistema debe integrarse con las aplicaciones de la compañía siguiendo el sistema de seguridad disponible
- Las sesiones deben expirar tras un periodo de inactividad
- Se deben gestionar adecuadamente los roles y permisos de usuario basados en la información del sistema de seguridad corporativo
- Debe implementar bloqueo tras intentos fallidos

#### Notas Adicionales
- Debe cumplir con estándares de seguridad actuales
- Debe implementar HTTPS para todas las comunicaciones
- La interfaz de login debe ser consistente con la identidad visual de la compañía

#### Historias de Usuario Relacionadas
- Todas las historias de usuario (control de acceso)

#### Tareas
- Implementar sistema de autenticación
- Desarrollar integración con sistema de seguridad corporativo
- Implementar gestión de sesiones
- Implementar mecanismo de roles y permisos basado en el sistema corporativo
- Implementar medidas de seguridad (HTTPS, bloqueo, etc.)
- Crear pruebas unitarias y de integración

#### Estimación
| Item | Impacto en usuario/negocio | Urgencia | Complejidad/Esfuerzo | Riesgos/Dependencias |
|------|----------------------------|----------|----------------------|----------------------|
| US-15: Autenticación | Alto | Alta | Media (5) | Medio - Dependencia de sistemas externos |

---

## Backlog Priorizado

Para priorizar el backlog, utilizaré la metodología MoSCoW combinada con un análisis de dependencias. La metodología MoSCoW divide las historias en:

- **Must have (M)**: Funcionalidades imprescindibles para el MVP
- **Should have (S)**: Importantes pero no críticas para el lanzamiento inicial
- **Could have (C)**: Deseables pero que podrían posponerse
- **Won't have (W)**: Fuera del alcance del proyecto actual

### Backlog de Producto Priorizado

| ID | Historia de Usuario | Prioridad | Dependencias | Esfuerzo | Valor de Negocio |
|----|---------------------|-----------|--------------|----------|------------------|
| US-15 | Autenticación de usuarios | M | Ninguna | 5 | Alto |
| US-01 | Creación de tarea por usuario de negocio | M | US-15 | 8 | Alto |
| US-02 | Edición de tarea por usuario de negocio | M | US-01 | 6 | Alto |
| US-03 | Priorización de tareas en backlog | M | US-01 | 5 | Alto |
| US-08 | Visualización de tareas pendientes de planificar | M | US-01, US-03 | 5 | Alto |
| US-05 | Estimación de tarea por tecnología | M | US-01 | 4 | Alto |
| US-09 | Configuración de equipos de desarrollo | M | US-15 | 5 | Alto |
| US-07 | Definición de matriz de afinidad | M | US-09 | 5 | Alto |
| US-06 | Asignación de equipo y planificación de tarea | M | US-05, US-09, US-07 | 10 | Alto |
| US-10 | Visualización de capacidad de equipos | M | US-09 | 5 | Alto |
| US-11 | Visualización de tareas planificadas en Gantt | S | US-06 | 8 | Alto |
| US-12 | Visualización de KPIs | S | US-08, US-11 | 8 | Alto |
| US-13 | Configuración de sistema de alertas | S | US-15 | 5 | Medio |
| US-14 | Recepción de alertas por correo | S | US-13 | 5 | Alto |
| US-04 | Borrado de tareas | C | US-01, US-15 | 2 | Medio |

### Plan de Entregas Sugerido

**MVP (Sprint 1-3):**
- Autenticación y seguridad
- Gestión básica de tareas (crear, editar)
- Configuración básica de equipos y matriz de afinidad

**Fase 2 (Sprint 4-6):**
- Sistema de recomendación y planificación
- Estimación de tareas con factor de carga
- Visualización de capacidad de equipos
- Priorización de tareas

**Fase 3 (Sprint 7-9):**
- Visualización Gantt
- KPIs
- Sistema de alertas
- Funcionalidades adicionales

Este backlog priorizado asegura que las funcionalidades core estén disponibles en el MVP, permitiendo una entrega progresiva de valor al negocio mientras se mantiene la coherencia del sistema.
