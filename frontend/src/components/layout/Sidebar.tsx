import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faChartGantt, 
  faUsers, 
  faChartLine,
  faClipboardList,
  faCog,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (!user) return null;

  const isNegocio = hasRole([UserRole.NEGOCIO]);
  const isTecnologia = hasRole([UserRole.TECNOLOGIA]);
  const isAdmin = hasRole([UserRole.ADMIN]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5>Menú</h5>
      </div>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/dashboard" className="sidebar-link">
          <FontAwesomeIcon icon={faChartLine} className="sidebar-icon" />
          Dashboard
        </Nav.Link>
        
        {/* Enlaces visibles para todos los roles */}
        <Nav.Link as={NavLink} to="/tasks" className="sidebar-link">
          <FontAwesomeIcon icon={faTasks} className="sidebar-icon" />
          Tareas
        </Nav.Link>
        
        <Nav.Link as={NavLink} to="/gantt" className="sidebar-link">
          <FontAwesomeIcon icon={faChartGantt} className="sidebar-icon" />
          Planificación Gantt
        </Nav.Link>
        
        {/* Enlaces específicos según rol */}
        {isNegocio && (
          <>
            <Nav.Link as={NavLink} to="/backlog" className="sidebar-link">
              <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
              Backlog
            </Nav.Link>
          </>
        )}
        
        {isTecnologia && (
          <>
            <Nav.Link as={NavLink} to="/teams" className="sidebar-link">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
              Equipos
            </Nav.Link>
          </>
        )}
        
        {isAdmin && (
          <>
            <Nav.Link as={NavLink} to="/settings" className="sidebar-link">
              <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
              Configuración
            </Nav.Link>
          </>
        )}
        
        <Nav.Link as={NavLink} to="/alerts" className="sidebar-link">
          <FontAwesomeIcon icon={faBell} className="sidebar-icon" />
          Alertas
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar; 