import { Team } from '../../types';

export const mockTeams: Team[] = [
  // Equipos internos
  { id: 1, name: 'Dev 01', capacity: 2, currentLoad: 1.5, isExternal: false },
  { id: 2, name: 'Dev 03', capacity: 2, currentLoad: 2, isExternal: false },
  { id: 3, name: 'Dev 04', capacity: 2, currentLoad: 1.2, isExternal: false },
  { id: 4, name: 'Dev 05', capacity: 2, currentLoad: 1.8, isExternal: false },
  { id: 5, name: 'Dev 06', capacity: 2, currentLoad: 0.8, isExternal: false },
  { id: 6, name: 'Dev 07', capacity: 2, currentLoad: 1.6, isExternal: false },
  { id: 7, name: 'Dev 08', capacity: 2, currentLoad: 1.3, isExternal: false },
  { id: 8, name: 'Dev 09', capacity: 2, currentLoad: 1.9, isExternal: false },
  { id: 9, name: 'Dev 10', capacity: 2, currentLoad: 1.1, isExternal: false },
  { id: 10, name: 'Dev 11', capacity: 2, currentLoad: 1.4, isExternal: false },
  
  // Equipos externos
  { id: 11, name: 'Equipo Externo 1', capacity: 2, currentLoad: 1.7, isExternal: true },
  { id: 12, name: 'Equipo Externo 2', capacity: 2, currentLoad: 1.2, isExternal: true },
  { id: 13, name: 'Equipo Externo 3', capacity: 2, currentLoad: 2, isExternal: true },
  { id: 14, name: 'Equipo Externo 4', capacity: 2, currentLoad: 0.9, isExternal: true },
  { id: 15, name: 'Equipo Externo 5', capacity: 2, currentLoad: 1.5, isExternal: true },
  { id: 16, name: 'Equipo Externo 6', capacity: 2, currentLoad: 1.8, isExternal: true },
  { id: 17, name: 'Equipo Externo 7', capacity: 2, currentLoad: 1.3, isExternal: true },
  { id: 18, name: 'Equipo Externo 8', capacity: 2, currentLoad: 1.6, isExternal: true },
  { id: 19, name: 'Equipo Externo 9', capacity: 2, currentLoad: 1.1, isExternal: true },
  { id: 20, name: 'Equipo Externo 10', capacity: 2, currentLoad: 1.9, isExternal: true }
];

export const getTeamById = (id: number): Team | undefined => {
  return mockTeams.find(team => team.id === id);
};

export const getTeamName = (id: number): string => {
  const team = getTeamById(id);
  return team ? team.name : 'Sin asignar';
};

export const getAvailableTeams = (): Team[] => {
  return mockTeams.filter(team => team.currentLoad < team.capacity);
};

export const getTeamUtilization = (teamId: number): number => {
  const team = getTeamById(teamId);
  if (!team) return 0;
  return Math.round((team.currentLoad / team.capacity) * 100);
}; 