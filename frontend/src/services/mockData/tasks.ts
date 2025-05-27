import { Task, TaskStatus, TaskStage } from '../../types';

export const mockTasks: Task[] = [
  // Tareas en backlog
  {
    id: 1,
    subject: 'Implementar sistema de notificaciones push',
    description: 'Desarrollar funcionalidad para enviar notificaciones push a usuarios móviles cuando se actualice el estado de sus tareas.',
    status: TaskStatus.PENDING,
    priority: 1,
    assignedTo: 4, // Carlos Martínez (Marketing)
    functional: 'https://docs.company.com/notificaciones-push.pdf',
    department: 2, // Marketing
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    priorityOrder: 1
  },
  {
    id: 2,
    subject: 'Optimización de base de datos de clientes',
    description: 'Mejorar el rendimiento de las consultas de la base de datos de clientes para reducir tiempos de carga.',
    status: TaskStatus.PENDING,
    priority: 2,
    assignedTo: 6, // David Hernández (Ventas)
    functional: 'https://docs.company.com/optimizacion-bd.pdf',
    department: 3, // Ventas
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
    sprints: 3,
    loadFactor: 2,
    priorityOrder: 2
  },
  {
    id: 3,
    subject: 'Dashboard de métricas de RRHH',
    description: 'Crear dashboard para visualizar métricas clave de recursos humanos como rotación, satisfacción y productividad.',
    status: TaskStatus.PENDING,
    priority: 3,
    assignedTo: 8, // Roberto Moreno (RRHH)
    functional: 'https://docs.company.com/dashboard-rrhh.pdf',
    department: 4, // RRHH
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    priorityOrder: 3
  },

  // Tareas planificadas
  {
    id: 4,
    subject: 'Integración con sistema de facturación',
    description: 'Conectar el sistema actual con el nuevo sistema de facturación para automatizar el proceso.',
    status: TaskStatus.PENDING,
    priority: 1,
    assignedTo: 9, // Patricia Jiménez (Finanzas)
    functional: 'https://docs.company.com/integracion-facturacion.pdf',
    department: 5, // Finanzas
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-12'),
    sprints: 5,
    loadFactor: 3,
    team: 1, // Dev 01
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-03-03'),
    priorityOrder: 1
  },
  {
    id: 5,
    subject: 'Portal de autoservicio para empleados',
    description: 'Desarrollar portal donde los empleados puedan gestionar sus datos personales, solicitar vacaciones y consultar nóminas.',
    status: TaskStatus.PENDING,
    priority: 2,
    assignedTo: 8, // Roberto Moreno (RRHH)
    functional: 'https://docs.company.com/portal-empleados.pdf',
    department: 4, // RRHH
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-11'),
    sprints: 8,
    loadFactor: 2,
    team: 3, // Dev 04
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-26'),
    priorityOrder: 2
  },

  // Tareas en progreso
  {
    id: 6,
    subject: 'Módulo de gestión de inventario',
    description: 'Implementar módulo para gestión completa de inventario con alertas de stock mínimo y reportes.',
    status: TaskStatus.IN_PROGRESS,
    priority: 1,
    assignedTo: 10, // Fernando Ruiz (Operaciones)
    functional: 'https://docs.company.com/gestion-inventario.pdf',
    department: 6, // Operaciones
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-13'),
    sprints: 6,
    loadFactor: 2,
    team: 2, // Dev 03
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-02-26'),
    priorityOrder: 1
  },
  {
    id: 7,
    subject: 'Sistema de tickets de soporte',
    description: 'Desarrollar sistema completo de gestión de tickets de soporte al cliente con asignación automática.',
    status: TaskStatus.IN_PROGRESS,
    priority: 1,
    assignedTo: 11, // Mónica Vázquez (Atención al Cliente)
    functional: 'https://docs.company.com/tickets-soporte.pdf',
    department: 7, // Atención al Cliente
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2025-01-13'),
    sprints: 4,
    loadFactor: 1,
    team: 4, // Dev 05
    startDate: new Date('2024-12-20'),
    endDate: new Date('2025-02-14'),
    priorityOrder: 1
  },

  // Tareas completadas
  {
    id: 8,
    subject: 'Migración a nueva versión de framework',
    description: 'Actualizar el framework principal de la aplicación a la última versión estable.',
    status: TaskStatus.COMPLETED,
    priority: 1,
    assignedTo: 1, // Juan Pérez (Tecnología)
    functional: 'https://docs.company.com/migracion-framework.pdf',
    department: 1, // Tecnología
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-20'),
    sprints: 3,
    loadFactor: 2,
    team: 5, // Dev 06
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-12-20'),
    priorityOrder: 1
  },

  // Más tareas para tener variedad
  {
    id: 9,
    subject: 'API de integración con redes sociales',
    description: 'Desarrollar API para integrar publicaciones automáticas en redes sociales.',
    status: TaskStatus.PENDING,
    priority: 3,
    assignedTo: 5, // Laura Rodríguez (Marketing)
    department: 2, // Marketing
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
    priorityOrder: 4
  },
  {
    id: 10,
    subject: 'Módulo de análisis de ventas',
    description: 'Crear módulo para análisis detallado de ventas con gráficos y reportes personalizables.',
    status: TaskStatus.PENDING,
    priority: 2,
    assignedTo: 7, // Sara González (Ventas)
    functional: 'https://docs.company.com/analisis-ventas.pdf',
    department: 3, // Ventas
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
    sprints: 4,
    loadFactor: 1,
    team: 11, // Equipo Externo 1
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-04-11'),
    priorityOrder: 3
  },
  {
    id: 11,
    subject: 'Sistema de evaluación de desempeño',
    description: 'Implementar sistema digital para evaluaciones de desempeño de empleados.',
    status: TaskStatus.IN_PROGRESS,
    priority: 2,
    assignedTo: 8, // Roberto Moreno (RRHH)
    functional: 'https://docs.company.com/evaluacion-desempeno.pdf',
    department: 4, // RRHH
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-10'),
    sprints: 5,
    loadFactor: 2,
    team: 6, // Dev 07
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-03-07'),
    priorityOrder: 2
  },
  {
    id: 12,
    subject: 'Automatización de reportes financieros',
    description: 'Automatizar la generación de reportes financieros mensuales y trimestrales.',
    status: TaskStatus.COMPLETED,
    priority: 1,
    assignedTo: 9, // Patricia Jiménez (Finanzas)
    functional: 'https://docs.company.com/reportes-financieros.pdf',
    department: 5, // Finanzas
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-12-10'),
    sprints: 4,
    loadFactor: 1,
    team: 7, // Dev 08
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-12-10'),
    priorityOrder: 1
  }
];

// Función para obtener el stage de una tarea basado en su estado y datos
export const getTaskStage = (task: Task): TaskStage => {
  if (task.status === TaskStatus.COMPLETED) {
    return TaskStage.COMPLETED;
  }
  
  if (task.status === TaskStatus.IN_PROGRESS) {
    return TaskStage.IN_PROGRESS;
  }
  
  if (task.team && task.startDate && task.endDate) {
    return TaskStage.PLANNED;
  }
  
  if (task.assignedTo && task.functional && task.sprints) {
    return TaskStage.PENDING_PLANNING;
  }
  
  return TaskStage.BACKLOG;
};

// Función para obtener tareas con su stage calculado
export const getTasksWithStage = (): (Task & { stage: TaskStage })[] => {
  return mockTasks.map(task => ({
    ...task,
    stage: getTaskStage(task)
  }));
}; 