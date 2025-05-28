const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./api/routes/authRoutes');
const taskRoutes = require('./api/routes/taskRoutes');

// Importar configuración de base de datos
const { disconnectDatabase } = require('./config/database');

const app = express();

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] // Cambiar por tu dominio en producción
    : ['http://localhost:3000', 'http://localhost:5173'], // Para desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskDistributor API está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta para documentación de la API (futuro)
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Documentación de la API',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout'
      },
      tasks: {
        list: 'GET /api/tasks',
        detail: 'GET /api/tasks/:id',
        stats: 'GET /api/tasks/stats',
        filterOptions: 'GET /api/tasks/filter-options'
      }
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  // Error de validación de Prisma
  if (error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un registro con estos datos únicos'
    });
  }
  
  // Error de registro no encontrado en Prisma
  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro no encontrado'
    });
  }
  
  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición'
    });
  }
  
  // Error genérico
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Manejo elegante del cierre del servidor
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

module.exports = app; 