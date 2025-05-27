import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { TaskFilters, TaskStage, UserRole } from '../../types';
import { mockDepartments } from '../../services/mockData/departments';
import { mockTeams } from '../../services/mockData/teams';
import { mockUsers } from '../../services/mockData/users';

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  userRole?: UserRole;
  userDepartment?: number;
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  userRole,
  userDepartment
}) => {
  
  const handleFilterChange = (field: keyof TaskFilters, value: any) => {
    onChange({
      ...filters,
      [field]: value === '' ? undefined : value
    });
  };
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onChange({
      ...filters,
      [field]: value ? new Date(value) : undefined
    });
  };
  
  // Filtrar departamentos según el rol del usuario
  const availableDepartments = userRole === UserRole.NEGOCIO && userDepartment
    ? mockDepartments.filter(dept => dept.id === userDepartment)
    : mockDepartments;
  
  // Filtrar usuarios según el rol
  const availableUsers = userRole === UserRole.NEGOCIO && userDepartment
    ? mockUsers.filter(user => user.department === userDepartment || user.role === UserRole.TECNOLOGIA)
    : mockUsers;
  
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="task-filters">
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Departamento</Form.Label>
            <Form.Select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', parseInt(e.target.value) || undefined)}
            >
              <option value="">Todos los departamentos</option>
              {availableDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={filters.stage || ''}
              onChange={(e) => handleFilterChange('stage', e.target.value || undefined)}
            >
              <option value="">Todos los estados</option>
              <option value={TaskStage.BACKLOG}>Backlog</option>
              <option value={TaskStage.PENDING_PLANNING}>Pendiente Planificación</option>
              <option value={TaskStage.PLANNED}>Planificada</option>
              <option value={TaskStage.IN_PROGRESS}>En Progreso</option>
              <option value={TaskStage.COMPLETED}>Completada</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', parseInt(e.target.value) || undefined)}
            >
              <option value="">Todas las prioridades</option>
              <option value={1}>Prioridad 1 (Alta)</option>
              <option value={2}>Prioridad 2 (Media)</option>
              <option value={3}>Prioridad 3 (Baja)</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Responsable</Form.Label>
            <Form.Select
              value={filters.assignedTo || ''}
              onChange={(e) => handleFilterChange('assignedTo', parseInt(e.target.value) || undefined)}
            >
              <option value="">Todos los responsables</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Equipo</Form.Label>
            <Form.Select
              value={filters.team || ''}
              onChange={(e) => handleFilterChange('team', parseInt(e.target.value) || undefined)}
            >
              <option value="">Todos los equipos</option>
              {mockTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.isExternal ? '(Externo)' : '(Interno)'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de inicio (desde)</Form.Label>
            <Form.Control
              type="date"
              value={formatDateForInput(filters.startDate)}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de fin (hasta)</Form.Label>
            <Form.Control
              type="date"
              value={formatDateForInput(filters.endDate)}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <Form.Check
            type="checkbox"
            label="Solo tareas sin responsable"
            checked={filters.hasResponsible === false}
            onChange={(e) => handleFilterChange('hasResponsible', e.target.checked ? false : undefined)}
          />
        </Col>
        
        <Col md={4}>
          <Form.Check
            type="checkbox"
            label="Solo tareas sin funcional"
            checked={filters.hasFunctional === false}
            onChange={(e) => handleFilterChange('hasFunctional', e.target.checked ? false : undefined)}
          />
        </Col>
        
        <Col md={4}>
          <Form.Check
            type="checkbox"
            label="Solo tareas sin estimación"
            checked={filters.hasEstimation === false}
            onChange={(e) => handleFilterChange('hasEstimation', e.target.checked ? false : undefined)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TaskFiltersComponent; 