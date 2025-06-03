import { AffinityMatrix } from '../../types';

// Matriz de afinidad entre equipos y departamentos
// Nivel de afinidad: 1 (baja) - 5 (alta)
export const mockAffinityMatrix: AffinityMatrix[] = [
  // Dev 01 - Especializado en departamentos 1 y 2
  { id: 1, teamId: 1, departmentId: 1, affinityLevel: 5 },
  { id: 2, teamId: 1, departmentId: 2, affinityLevel: 4 },
  { id: 3, teamId: 1, departmentId: 3, affinityLevel: 2 },
  { id: 4, teamId: 1, departmentId: 4, affinityLevel: 2 },
  { id: 5, teamId: 1, departmentId: 5, affinityLevel: 1 },

  // Dev 03 - Especializado en departamento 3
  { id: 6, teamId: 2, departmentId: 1, affinityLevel: 2 },
  { id: 7, teamId: 2, departmentId: 2, affinityLevel: 3 },
  { id: 8, teamId: 2, departmentId: 3, affinityLevel: 5 },
  { id: 9, teamId: 2, departmentId: 4, affinityLevel: 3 },
  { id: 10, teamId: 2, departmentId: 5, affinityLevel: 2 },

  // Dev 04 - Polivalente
  { id: 11, teamId: 3, departmentId: 1, affinityLevel: 3 },
  { id: 12, teamId: 3, departmentId: 2, affinityLevel: 3 },
  { id: 13, teamId: 3, departmentId: 3, affinityLevel: 3 },
  { id: 14, teamId: 3, departmentId: 4, affinityLevel: 4 },
  { id: 15, teamId: 3, departmentId: 5, affinityLevel: 3 },

  // Dev 05 - Especializado en departamentos 1 y 5
  { id: 16, teamId: 4, departmentId: 1, affinityLevel: 5 },
  { id: 17, teamId: 4, departmentId: 2, affinityLevel: 2 },
  { id: 18, teamId: 4, departmentId: 3, affinityLevel: 2 },
  { id: 19, teamId: 4, departmentId: 4, affinityLevel: 3 },
  { id: 20, teamId: 4, departmentId: 5, affinityLevel: 5 },

  // Dev 06 - Especializado en departamento 2
  { id: 21, teamId: 5, departmentId: 1, affinityLevel: 2 },
  { id: 22, teamId: 5, departmentId: 2, affinityLevel: 5 },
  { id: 23, teamId: 5, departmentId: 3, affinityLevel: 3 },
  { id: 24, teamId: 5, departmentId: 4, affinityLevel: 2 },
  { id: 25, teamId: 5, departmentId: 5, affinityLevel: 2 },

  // Dev 07 - Especializado en departamento 4
  { id: 26, teamId: 6, departmentId: 1, affinityLevel: 2 },
  { id: 27, teamId: 6, departmentId: 2, affinityLevel: 2 },
  { id: 28, teamId: 6, departmentId: 3, affinityLevel: 3 },
  { id: 29, teamId: 6, departmentId: 4, affinityLevel: 5 },
  { id: 30, teamId: 6, departmentId: 5, affinityLevel: 3 },

  // Dev 08 - Especializado en departamentos 1 y 5 (como Dev 05)
  { id: 31, teamId: 7, departmentId: 1, affinityLevel: 5 },
  { id: 32, teamId: 7, departmentId: 2, affinityLevel: 2 },
  { id: 33, teamId: 7, departmentId: 3, affinityLevel: 2 },
  { id: 34, teamId: 7, departmentId: 4, affinityLevel: 3 },
  { id: 35, teamId: 7, departmentId: 5, affinityLevel: 5 },

  // Dev 09 - Especializado en departamento 3
  { id: 36, teamId: 8, departmentId: 1, affinityLevel: 2 },
  { id: 37, teamId: 8, departmentId: 2, affinityLevel: 3 },
  { id: 38, teamId: 8, departmentId: 3, affinityLevel: 5 },
  { id: 39, teamId: 8, departmentId: 4, affinityLevel: 2 },
  { id: 40, teamId: 8, departmentId: 5, affinityLevel: 2 },

  // Dev 10 - Polivalente
  { id: 41, teamId: 9, departmentId: 1, affinityLevel: 3 },
  { id: 42, teamId: 9, departmentId: 2, affinityLevel: 4 },
  { id: 43, teamId: 9, departmentId: 3, affinityLevel: 3 },
  { id: 44, teamId: 9, departmentId: 4, affinityLevel: 3 },
  { id: 45, teamId: 9, departmentId: 5, affinityLevel: 4 },

  // Dev 11 - Especializado en departamento 2
  { id: 46, teamId: 10, departmentId: 1, affinityLevel: 2 },
  { id: 47, teamId: 10, departmentId: 2, affinityLevel: 5 },
  { id: 48, teamId: 10, departmentId: 3, affinityLevel: 3 },
  { id: 49, teamId: 10, departmentId: 4, affinityLevel: 2 },
  { id: 50, teamId: 10, departmentId: 5, affinityLevel: 2 },

  // Equipos Externos - Generalmente menor afinidad pero pueden trabajar en cualquier departamento
  // Equipo Externo 1 - Polivalente
  { id: 51, teamId: 11, departmentId: 1, affinityLevel: 3 },
  { id: 52, teamId: 11, departmentId: 2, affinityLevel: 3 },
  { id: 53, teamId: 11, departmentId: 3, affinityLevel: 3 },
  { id: 54, teamId: 11, departmentId: 4, affinityLevel: 3 },
  { id: 55, teamId: 11, departmentId: 5, affinityLevel: 3 },

  // Equipo Externo 2 - Especializado en departamentos 1 y 2
  { id: 56, teamId: 12, departmentId: 1, affinityLevel: 4 },
  { id: 57, teamId: 12, departmentId: 2, affinityLevel: 4 },
  { id: 58, teamId: 12, departmentId: 3, affinityLevel: 2 },
  { id: 59, teamId: 12, departmentId: 4, affinityLevel: 2 },
  { id: 60, teamId: 12, departmentId: 5, affinityLevel: 2 },

  // Equipos Externos 3-10 (afinidad básica para todos los departamentos)
  ...Array.from({ length: 8 }, (_, i) => {
    const teamId = 13 + i; // Teams 13-20 (Externos 3-10)
    return Array.from({ length: 5 }, (_, j) => ({
      id: 61 + (i * 5) + j,
      teamId,
      departmentId: j + 1,
      affinityLevel: 2 + Math.floor(Math.random() * 2) // Afinidad 2-3 aleatoria
    }));
  }).flat()
];

export const getAffinityByTeamAndDepartment = (teamId: number, departmentId: number): number => {
  const affinity = mockAffinityMatrix.find(
    a => a.teamId === teamId && a.departmentId === departmentId
  );
  return affinity ? affinity.affinityLevel : 1; // Default afinidad baja
};

export const getTeamAffinities = (teamId: number): AffinityMatrix[] => {
  return mockAffinityMatrix.filter(a => a.teamId === teamId);
};

export const getDepartmentAffinities = (departmentId: number): AffinityMatrix[] => {
  return mockAffinityMatrix.filter(a => a.departmentId === departmentId);
}; 