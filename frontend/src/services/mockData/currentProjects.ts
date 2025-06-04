import { CurrentProject } from '../../types';

// Mock data de proyectos actuales por equipo
export const mockCurrentProjectsByTeam: Record<number, CurrentProject[]> = {
  // Dev 01 (carga: 1.5/2)
  1: [
    {
      id: 101,
      name: 'Portal Cliente v2.1',
      startDate: new Date('2025-01-05'),
      endDate: new Date('2025-02-15'),
      status: 'in_progress',
      loadFactor: 1.0,
      department: 'Comercial'
    },
    {
      id: 102,
      name: 'API Pagos Móviles',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-02-28'),
      status: 'starting_soon',
      loadFactor: 0.5,
      department: 'Finanzas'
    }
  ],

  // Dev 03 (carga: 2/2 - completamente ocupado)
  2: [
    {
      id: 103,
      name: 'Migración Base Datos',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2025-02-10'),
      status: 'in_progress',
      loadFactor: 1.5,
      department: 'IT'
    },
    {
      id: 104,
      name: 'Dashboard Ejecutivo',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-31'),
      status: 'finishing_soon',
      loadFactor: 0.5,
      department: 'Dirección'
    }
  ],

  // Dev 04 (carga: 1.2/2)
  3: [
    {
      id: 105,
      name: 'App Móvil Empleados',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2025-03-15'),
      status: 'in_progress',
      loadFactor: 1.2,
      department: 'RRHH'
    }
  ],

  // Dev 05 (carga: 1.8/2)
  4: [
    {
      id: 106,
      name: 'Sistema Inventario',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-02-20'),
      status: 'in_progress',
      loadFactor: 1.0,
      department: 'Operaciones'
    },
    {
      id: 107,
      name: 'Integración CRM',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-05'),
      status: 'finishing_soon',
      loadFactor: 0.8,
      department: 'Comercial'
    }
  ],

  // Dev 06 (carga: 0.8/2 - disponibilidad alta)
  5: [
    {
      id: 108,
      name: 'Prototipo IoT',
      startDate: new Date('2025-01-08'),
      endDate: new Date('2025-03-10'),
      status: 'in_progress',
      loadFactor: 0.8,
      department: 'Innovación'
    }
  ],

  // Dev 07 (carga: 1.6/2)
  6: [
    {
      id: 109,
      name: 'Plataforma E-learning',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2025-02-28'),
      status: 'in_progress',
      loadFactor: 1.0,
      department: 'RRHH'
    },
    {
      id: 110,
      name: 'Optimización Web',
      startDate: new Date('2025-01-22'),
      endDate: new Date('2025-02-12'),
      status: 'starting_soon',
      loadFactor: 0.6,
      department: 'Marketing'
    }
  ],

  // Dev 08 (carga: 1.3/2)
  7: [
    {
      id: 111,
      name: 'Sistema Facturación',
      startDate: new Date('2024-12-10'),
      endDate: new Date('2025-02-25'),
      status: 'in_progress',
      loadFactor: 1.3,
      department: 'Finanzas'
    }
  ],

  // Dev 09 (carga: 1.9/2)
  8: [
    {
      id: 112,
      name: 'Marketplace B2B',
      startDate: new Date('2024-11-20'),
      endDate: new Date('2025-01-30'),
      status: 'finishing_soon',
      loadFactor: 1.2,
      department: 'Comercial'
    },
    {
      id: 113,
      name: 'API Analytics',
      startDate: new Date('2025-01-05'),
      endDate: new Date('2025-03-20'),
      status: 'in_progress',
      loadFactor: 0.7,
      department: 'Marketing'
    }
  ],

  // Dev 10 (carga: 1.1/2)
  9: [
    {
      id: 114,
      name: 'Portal Proveedores',
      startDate: new Date('2025-01-03'),
      endDate: new Date('2025-03-01'),
      status: 'in_progress',
      loadFactor: 1.1,
      department: 'Compras'
    }
  ],

  // Dev 11 (carga: 1.4/2)
  10: [
    {
      id: 115,
      name: 'Sistema Reservas',
      startDate: new Date('2024-12-05'),
      endDate: new Date('2025-02-15'),
      status: 'in_progress',
      loadFactor: 0.9,
      department: 'Operaciones'
    },
    {
      id: 116,
      name: 'Chat Bot IA',
      startDate: new Date('2025-01-12'),
      endDate: new Date('2025-02-28'),
      status: 'starting_soon',
      loadFactor: 0.5,
      department: 'Atención Cliente'
    }
  ],

  // Equipos Externos - proyectos típicos de tercerización
  
  // Equipo Externo 1 (carga: 1.7/2)
  11: [
    {
      id: 117,
      name: 'Desarrollo Frontend',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-02-10'),
      status: 'in_progress',
      loadFactor: 1.2,
      department: 'IT'
    },
    {
      id: 118,
      name: 'Testing Automatizado',
      startDate: new Date('2025-01-18'),
      endDate: new Date('2025-03-05'),
      status: 'starting_soon',
      loadFactor: 0.5,
      department: 'Calidad'
    }
  ],

  // Equipo Externo 2 (carga: 1.2/2)
  12: [
    {
      id: 119,
      name: 'Migración Cloud',
      startDate: new Date('2024-11-25'),
      endDate: new Date('2025-03-15'),
      status: 'in_progress',
      loadFactor: 1.2,
      department: 'IT'
    }
  ],

  // Equipo Externo 3 (carga: 2/2 - ocupado completo)
  13: [
    {
      id: 120,
      name: 'ERP Customización',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2025-01-30'),
      status: 'finishing_soon',
      loadFactor: 1.5,
      department: 'Finanzas'
    },
    {
      id: 121,
      name: 'Seguridad Audit',
      startDate: new Date('2025-01-08'),
      endDate: new Date('2025-02-20'),
      status: 'in_progress',
      loadFactor: 0.5,
      department: 'IT'
    }
  ],

  // Resto de equipos externos con proyectos variados
  14: [
    {
      id: 122,
      name: 'UX/UI Redesign',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-04-15'),
      status: 'in_progress',
      loadFactor: 0.9,
      department: 'Marketing'
    }
  ],

  15: [
    {
      id: 123,
      name: 'Data Warehouse',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2025-03-30'),
      status: 'in_progress',
      loadFactor: 1.5,
      department: 'BI'
    }
  ],

  16: [
    {
      id: 124,
      name: 'API Gateway',
      startDate: new Date('2024-11-30'),
      endDate: new Date('2025-01-25'),
      status: 'finishing_soon',
      loadFactor: 1.0,
      department: 'IT'
    },
    {
      id: 125,
      name: 'Microservicios',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-04-10'),
      status: 'starting_soon',
      loadFactor: 0.8,
      department: 'IT'
    }
  ],

  17: [
    {
      id: 126,
      name: 'Blockchain POC',
      startDate: new Date('2025-01-05'),
      endDate: new Date('2025-03-20'),
      status: 'in_progress',
      loadFactor: 1.3,
      department: 'Innovación'
    }
  ],

  18: [
    {
      id: 127,
      name: 'DevOps Pipeline',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2025-02-28'),
      status: 'in_progress',
      loadFactor: 1.0,
      department: 'IT'
    },
    {
      id: 128,
      name: 'Monitoring Setup',
      startDate: new Date('2025-01-25'),
      endDate: new Date('2025-02-15'),
      status: 'starting_soon',
      loadFactor: 0.6,
      department: 'IT'
    }
  ],

  19: [
    {
      id: 129,
      name: 'Machine Learning',
      startDate: new Date('2025-01-02'),
      endDate: new Date('2025-05-30'),
      status: 'in_progress',
      loadFactor: 1.1,
      department: 'BI'
    }
  ],

  20: [
    {
      id: 130,
      name: 'Legacy Modernization',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-01-28'),
      status: 'finishing_soon',
      loadFactor: 1.4,
      department: 'IT'
    },
    {
      id: 131,
      name: 'Performance Tuning',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-15'),
      status: 'starting_soon',
      loadFactor: 0.5,
      department: 'IT'
    }
  ]
};

/**
 * Obtener proyectos actuales de un equipo
 */
export const getCurrentProjectsByTeam = (teamId: number): CurrentProject[] => {
  return mockCurrentProjectsByTeam[teamId] || [];
};

/**
 * Obtener el estado visual del proyecto basado en las fechas
 */
export const getProjectStatus = (startDate: Date, endDate: Date): CurrentProject['status'] => {
  const now = new Date();
  const daysDiff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (now < startDate) {
    return 'starting_soon';
  } else if (daysDiff <= 7) {
    return 'finishing_soon';
  } else {
    return 'in_progress';
  }
};

/**
 * Verificar si hay conflictos específicos con proyectos existentes
 */
export const getProjectConflicts = (
  teamId: number, 
  proposedStartDate: Date, 
  proposedEndDate: Date
): { conflictingProjects: CurrentProject[]; overlapDetails: string[] } => {
  const currentProjects = getCurrentProjectsByTeam(teamId);
  const conflictingProjects: CurrentProject[] = [];
  const overlapDetails: string[] = [];

  currentProjects.forEach(project => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);

    // Verificar solapamiento
    if (
      (proposedStartDate >= projectStart && proposedStartDate <= projectEnd) ||
      (proposedEndDate >= projectStart && proposedEndDate <= projectEnd) ||
      (proposedStartDate <= projectStart && proposedEndDate >= projectEnd)
    ) {
      conflictingProjects.push(project);
      overlapDetails.push(
        `Conflicto con "${project.name}" (${projectStart.toLocaleDateString('es-ES')} - ${projectEnd.toLocaleDateString('es-ES')})`
      );
    }
  });

  return { conflictingProjects, overlapDetails };
}; 