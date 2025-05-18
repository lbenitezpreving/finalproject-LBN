import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faExclamationTriangle, 
  faCheck, 
  faHourglass
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Datos simulados para mostrar en el dashboard
  const dashboardData = {
    totalTasks: 48,
    pendingTasks: 15,
    inProgressTasks: 20,
    completedTasks: 13,
    criticalAlerts: 3,
    teamUtilization: 75, // porcentaje
  };
  
  // Determina qué elementos mostrar según el rol
  const isNegocio = user?.role === UserRole.NEGOCIO;
  const isTecnologia = user?.role === UserRole.TECNOLOGIA;

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Total Tareas</h6>
                  <h2 className="mt-2 mb-0">{dashboardData.totalTasks}</h2>
                </div>
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faTasks} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Pendientes</h6>
                  <h2 className="mt-2 mb-0">{dashboardData.pendingTasks}</h2>
                </div>
                <div className="dashboard-icon warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">En Progreso</h6>
                  <h2 className="mt-2 mb-0">{dashboardData.inProgressTasks}</h2>
                </div>
                <div className="dashboard-icon info">
                  <FontAwesomeIcon icon={faHourglass} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Completadas</h6>
                  <h2 className="mt-2 mb-0">{dashboardData.completedTasks}</h2>
                </div>
                <div className="dashboard-icon success">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {isNegocio && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>Tareas por departamento</Card.Header>
              <Card.Body>
                <p className="text-muted">
                  Aquí se mostrará un gráfico con la distribución de tareas por departamento.
                </p>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {isTecnologia && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>Utilización de equipos</Card.Header>
              <Card.Body>
                <div className="utilization-wrapper">
                  <div className="utilization-bar">
                    <div 
                      className="utilization-progress" 
                      style={{ width: `${dashboardData.teamUtilization}%` }}
                    >
                      {dashboardData.teamUtilization}%
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        <Col md={isTecnologia || isNegocio ? 6 : 12} className="mb-4">
          <Card>
            <Card.Header>Alertas críticas ({dashboardData.criticalAlerts})</Card.Header>
            <Card.Body>
              <ul className="alert-list">
                <li className="alert-item">
                  <span className="alert-icon">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </span>
                  <span className="alert-text">Tarea #124 - Fecha límite superada</span>
                </li>
                <li className="alert-item">
                  <span className="alert-icon">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </span>
                  <span className="alert-text">Equipo Frontend - Capacidad superada (110%)</span>
                </li>
                <li className="alert-item">
                  <span className="alert-icon">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </span>
                  <span className="alert-text">Tarea #145 - Sin responsable asignado</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 