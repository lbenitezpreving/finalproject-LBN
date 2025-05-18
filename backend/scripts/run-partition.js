/**
 * Script para ejecutar el particionamiento de la tabla historial_estimaciones
 * 
 * Este script lee el archivo SQL de configuración de particionamiento y
 * lo ejecuta en la base de datos.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de Prisma
const prisma = new PrismaClient();

async function main() {
  console.log('Configurando particionamiento para la tabla historial_estimaciones...');
  
  try {
    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, 'partition_setup.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar el script SQL directamente en la base de datos
    const result = await prisma.$executeRawUnsafe(sqlScript);
    
    console.log('Particionamiento configurado correctamente');
  } catch (error) {
    console.error('Error al configurar el particionamiento:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  });

/**
 * Nota: Este script debe ejecutarse después de que las migraciones de Prisma
 * hayan sido aplicadas, ya que requiere que la tabla exista.
 * 
 * Uso:
 * npm run db:partition
 * 
 * Esto creará la estructura de particionamiento por años para la tabla
 * historial_estimaciones, lo que mejorará el rendimiento de las consultas
 * y facilitará el mantenimiento de datos históricos.
 */ 