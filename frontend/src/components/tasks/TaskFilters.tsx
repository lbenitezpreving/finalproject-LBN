import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { TaskFilters, TaskStage, TaskStatus, UserRole } from '../../types';
import { mockDepartments } from '../../services/mockData/departments';
import { mockTeams } from '../../services/mockData/teams';

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
  
  // Filtrar departamentos según el rol del usuario
  const availableDepartments = userRole === UserRole.NEGOCIO && userDepartment
    ? mockDepartments.filter(dept => dept.id === userDepartment)
    : mockDepartments;
  
  return (
    <div className="task-filters">
      <Row>
        <Col md={6}>
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
        
        <Col md={6}>
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
        
        <Col md={6}>
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
        
        <Col md={6}>
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