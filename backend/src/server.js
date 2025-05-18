/**
 * Punto de entrada principal para la aplicación TaskDistributor
 */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const equipoRoutes = require('./api/routes/equipo.routes');
const departamentoRoutes = require('./api/routes/departamento.routes');
const tareaRoutes = require('./api/routes/tarea.routes');
const matrizAfinidadRoutes = require('./api/routes/matrizAfinidad.routes');
const asignacionRoutes = require('./api/routes/asignacion.routes');

// Importar manejador de errores
const { errorHandler } = require('./api/middlewares/error.middleware');

// Crear aplicación Express
const app = express();

// Configuración de seguridad básica con Helmet
app.use(helmet());

// Configuración de CORS
app.use(cors());

// Parsear cuerpo de peticiones a JSON
app.use(express.json());

// Limitar peticiones (protección contra ataques DoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limitar cada IP a 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Configuración de Swagger para documentación de API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TaskDistributor',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de planificación de tareas TaskDistributor'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: ['./src/api/routes/*.js', './src/api/models/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/matriz-afinidad', matrizAfinidadRoutes);
app.use('/api/asignaciones', asignacionRoutes);

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API TaskDistributor funcionando correctamente' });
});

// Middleware para manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware para manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});

// Para pruebas con supertest
module.exports = app; 