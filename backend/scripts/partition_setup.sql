-- Script de configuración para el particionamiento de tablas en PostgreSQL
-- Este script configura el particionamiento por rango de fechas para la tabla historial_estimaciones

-- Verificar si la tabla historial_estimaciones existe y si no está particionada aún
DO $$ 
DECLARE
    table_exists BOOLEAN;
    is_partitioned BOOLEAN;
BEGIN
    -- Verificar si la tabla existe
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'historial_estimaciones'
    ) INTO table_exists;

    -- Si la tabla existe, verificar si ya está particionada
    IF table_exists THEN
        SELECT EXISTS (
            SELECT FROM pg_partitioned_table pt
            JOIN pg_class c ON c.oid = pt.partrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public' AND c.relname = 'historial_estimaciones'
        ) INTO is_partitioned;
    ELSE
        is_partitioned := FALSE;
    END IF;

    -- Si la tabla existe pero no está particionada, renombrarla
    IF table_exists AND NOT is_partitioned THEN
        RAISE NOTICE 'La tabla historial_estimaciones existe y no está particionada. Renombrando a historial_estimaciones_old...';
        EXECUTE 'ALTER TABLE historial_estimaciones RENAME TO historial_estimaciones_old';
    END IF;
END $$;

-- Crear la tabla particionada si no existe o si se renombró la anterior
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Verificar si la tabla particionada existe
    SELECT EXISTS (
        SELECT FROM pg_partitioned_table pt
        JOIN pg_class c ON c.oid = pt.partrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = 'historial_estimaciones'
    ) INTO table_exists;

    -- Si la tabla particionada no existe, crearla
    IF NOT table_exists THEN
        RAISE NOTICE 'Creando tabla particionada historial_estimaciones...';
        
        -- Crear la tabla particionada
        EXECUTE '
        CREATE TABLE historial_estimaciones (
            id SERIAL,
            tarea_id INTEGER NOT NULL,
            estimacion_anterior INTEGER,
            estimacion_nueva INTEGER,
            factor_carga_anterior FLOAT,
            factor_carga_nueva FLOAT,
            usuario_id INTEGER NOT NULL,
            fecha_cambio TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            PRIMARY KEY (id, fecha_cambio)
        ) PARTITION BY RANGE (fecha_cambio)';
        
        -- Crear índices
        EXECUTE 'CREATE INDEX historial_estimaciones_tarea_id_idx ON historial_estimaciones(tarea_id)';
        EXECUTE 'CREATE INDEX historial_estimaciones_usuario_id_idx ON historial_estimaciones(usuario_id)';
        EXECUTE 'CREATE INDEX historial_estimaciones_fecha_cambio_idx ON historial_estimaciones(fecha_cambio)';
        
        -- Crear restricciones
        EXECUTE 'ALTER TABLE historial_estimaciones ADD CONSTRAINT historial_estimaciones_tarea_id_fkey 
                 FOREIGN KEY (tarea_id) REFERENCES tareas_extended(id) ON DELETE CASCADE';
    END IF;
END $$;

-- Función para crear particiones automáticamente para un año específico
CREATE OR REPLACE FUNCTION crear_particion_historial_estimaciones(p_año INTEGER)
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
    partition_exists BOOLEAN;
BEGIN
    partition_name := 'historial_estimaciones_y' || p_año;
    start_date := p_año || '-01-01';
    end_date := (p_año + 1) || '-01-01';
    
    -- Verificar si la partición ya existe
    SELECT EXISTS (
        SELECT FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = partition_name
    ) INTO partition_exists;
    
    -- Si la partición no existe, crearla
    IF NOT partition_exists THEN
        EXECUTE 'CREATE TABLE ' || partition_name || 
                ' PARTITION OF historial_estimaciones 
                 FOR VALUES FROM (''' || start_date || ''') TO (''' || end_date || ''')';
        
        RAISE NOTICE 'Partición % creada exitosamente para el rango % a %', 
                     partition_name, start_date, end_date;
    ELSE
        RAISE NOTICE 'La partición % ya existe', partition_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Crear particiones para años actuales y futuros
DO $$
DECLARE
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    year_to_create INTEGER;
BEGIN
    -- Crear particiones para el año actual y los próximos 2 años
    FOR year_to_create IN current_year..(current_year + 2) LOOP
        PERFORM crear_particion_historial_estimaciones(year_to_create);
    END LOOP;
END $$;

-- Función de trigger para crear particiones automáticamente si no existen
CREATE OR REPLACE FUNCTION verificar_particion_historial_estimaciones()
RETURNS TRIGGER AS $$
DECLARE
    year_of_date INTEGER;
    partition_name TEXT;
    partition_exists BOOLEAN;
BEGIN
    year_of_date := EXTRACT(YEAR FROM NEW.fecha_cambio);
    partition_name := 'historial_estimaciones_y' || year_of_date;
    
    -- Verificar si la partición existe
    SELECT EXISTS (
        SELECT FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = partition_name
    ) INTO partition_exists;
    
    -- Si la partición no existe, crearla
    IF NOT partition_exists THEN
        PERFORM crear_particion_historial_estimaciones(year_of_date);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trig_verificar_particion_historial_estimaciones ON historial_estimaciones;
CREATE TRIGGER trig_verificar_particion_historial_estimaciones
    BEFORE INSERT ON historial_estimaciones
    FOR EACH ROW EXECUTE FUNCTION verificar_particion_historial_estimaciones();

-- Migrar datos si existe la tabla antigua
DO $$
DECLARE
    old_table_exists BOOLEAN;
BEGIN
    -- Verificar si existe la tabla antigua
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'historial_estimaciones_old'
    ) INTO old_table_exists;
    
    -- Si existe la tabla antigua, migrar los datos
    IF old_table_exists THEN
        RAISE NOTICE 'Migrando datos de historial_estimaciones_old a la tabla particionada...';
        
        EXECUTE '
        INSERT INTO historial_estimaciones (
            id, tarea_id, estimacion_anterior, estimacion_nueva, 
            factor_carga_anterior, factor_carga_nueva, usuario_id, 
            fecha_cambio, created_at, updated_at
        )
        SELECT 
            id, tarea_id, estimacion_anterior, estimacion_nueva, 
            factor_carga_anterior, factor_carga_nueva, usuario_id, 
            fecha_cambio, created_at, updated_at
        FROM historial_estimaciones_old';
        
        RAISE NOTICE 'Migración completada. La tabla antigua queda como historial_estimaciones_old';
    END IF;
END $$; 