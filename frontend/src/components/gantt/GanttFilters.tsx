import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUndo } from '@fortawesome/free-solid-svg-icons';
import { GanttFilters, GanttService } from '../../services/ganttService';
import { Department, Team, TaskStatus } from '../../types';

interface GanttFiltersProps {
  filters: GanttFilters;
  onFiltersChange: (filters: GanttFilters) => void;
  loading?: boolean;
}

const GanttFiltersComponent: React.FC<GanttFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false
}) => {
  // Estados locales para las opciones de filtros
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [statuses, setStatuses] = useState<{ value: TaskStatus; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Estados para el formulario
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>(filters.departments || []);
  const [selectedTeams, setSelectedTeams] = useState<number[]>(filters.teams || []);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status || []);
  const [startDate, setStartDate] = useState<string>(
    filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState<string>(
    filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''
  );

  // Cargar opciones de filtros
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoadingOptions(true);
      const options = await GanttService.getFilterOptions();
      setDepartments(options.departments);
      setTeams(options.teams);
      setStatuses(options.statuses);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters: GanttFilters = {
      departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
      teams: selectedTeams.length > 0 ? selectedTeams : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses as TaskStatus[] : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    onFiltersChange(newFilters);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedDepartments([]);
    setSelectedTeams([]);
    setSelectedStatuses([]);
    setStartDate('');
    setEndDate('');
    onFiltersChange({});
  };

  // Manejar cambios en departamentos
  const handleDepartmentChange = (departmentId: number, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, departmentId]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(id => id !== departmentId));
    }
  };

  // Manejar cambios en equipos
  const handleTeamChange = (teamId: number, checked: boolean) => {
    if (checked) {
      setSelectedTeams([...selectedTeams, teamId]);
    } else {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    }
  };

  // Manejar cambios en estados
  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    }
  };

  // Calcular número de filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedDepartments.length > 0) count++;
    if (selectedTeams.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (startDate) count++;
    if (endDate) count++;
    return count;
  };

  if (loadingOptions) {
    return (
      <Card>
        <Card.Header>
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          Filtros
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <Spinner animation="border" size="sm" />
            <p className="mt-2 mb-0">Cargando filtros...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          Filtros
          {getActiveFiltersCount() > 0 && (
            <Badge bg="primary" className="ms-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Form>
          {/* Filtro por Departamentos */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Departamentos</Form.Label>
            {departments.map(department => (
              <Form.Check
                key={department.id}
                type="checkbox"
                id={`dept-${department.id}`}
                label={department.name}
                checked={selectedDepartments.includes(department.id)}
                onChange={(e) => handleDepartmentChange(department.id, e.target.checked)}
              />
            ))}
          </Form.Group>

          {/* Filtro por Equipos */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Equipos</Form.Label>
            {teams.map(team => (
              <Form.Check
                key={team.id}
                type="checkbox"
                id={`team-${team.id}`}
                label={`${team.name} ${team.isExternal ? '(Externo)' : '(Interno)'}`}
                checked={selectedTeams.includes(team.id)}
                onChange={(e) => handleTeamChange(team.id, e.target.checked)}
              />
            ))}
          </Form.Group>

          {/* Filtro por Estados */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Estados</Form.Label>
            {statuses.map(status => (
              <Form.Check
                key={status.value}
                type="checkbox"
                id={`status-${status.value}`}
                label={status.label}
                checked={selectedStatuses.includes(status.value)}
                onChange={(e) => handleStatusChange(status.value, e.target.checked)}
              />
            ))}
          </Form.Group>

          {/* Filtro por Fechas */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Rango de Fechas</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Fecha de inicio"
              className="mb-2"
            />
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Fecha de fin"
            />
          </Form.Group>

          {/* Botones de acción */}
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={handleApplyFilters}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Aplicar Filtros
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={handleClearFilters}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faUndo} className="me-2" />
              Limpiar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GanttFiltersComponent; 