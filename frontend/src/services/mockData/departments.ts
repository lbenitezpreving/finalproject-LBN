import { Department } from '../../types';

export const mockDepartments: Department[] = [
  { id: 1, name: 'Tecnología' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Ventas' },
  { id: 4, name: 'Recursos Humanos' },
  { id: 5, name: 'Finanzas' },
  { id: 6, name: 'Operaciones' },
  { id: 7, name: 'Atención al Cliente' },
  { id: 8, name: 'Producto' }
];

export const getDepartmentById = (id: number): Department | undefined => {
  return mockDepartments.find(dept => dept.id === id);
};

export const getDepartmentName = (id: number): string => {
  const department = getDepartmentById(id);
  return department ? department.name : 'Desconocido';
}; 