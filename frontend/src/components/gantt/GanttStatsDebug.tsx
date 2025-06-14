import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { TaskService } from '../../services/taskService';

const GanttStatsDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing backend connection...');
      
      // Probar obtener tareas
      const response = await TaskService.getTasks({}, { page: 1, pageSize: 10 });
      
      const debugData = {
        success: true,
        totalTasks: response.data?.length || 0,
        sampleTask: response.data?.[0] || null,
        pagination: response.pagination,
        timestamp: new Date().toISOString()
      };
      
      console.log('Backend response:', debugData);
      setDebugInfo(debugData);
      
    } catch (err: any) {
      console.error('Backend connection error:', err);
      setError(err.message || 'Error desconocido');
      setDebugInfo({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <Card className="mb-3">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Debug - Conexión Backend</h6>
          <Button 
            size="sm" 
            variant="outline-primary" 
            onClick={testBackendConnection}
            disabled={loading}
          >
            {loading ? 'Probando...' : 'Probar Conexión'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            <strong>Error:</strong> {error}
          </Alert>
        )}
        
        {debugInfo && (
          <div>
            <h6>Información de Debug:</h6>
            <pre style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default GanttStatsDebug; 