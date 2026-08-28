-- ============================================================
-- Migración: 202608270001_add_responsable_fk
-- Descripción: Convierte el campo "responsable" de la tabla
--              sucursal (texto libre) a una relación con la
--              tabla usuario, asignando como responsable a un
--              usuario con rol ENCARGADO_SUCURSAL.
--
-- Operaciones (todas idempotentes respecto a la existencia de
-- las columnas):
--   1. Añade la columna id_responsable (FK -> usuario).
--   2. Conserva los responsables existentes que coincidan por
--      nombre con un usuario ENCARGADO_SUCURSAL.
--   3. Añade UNIQUE (un encargado -> una sucursal) e índice.
--   4. Elimina la columna "responsable" de texto.
-- ============================================================

SET @has_responsable_col := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'sucursal'
      AND COLUMN_NAME = 'responsable'
);

SET @has_id_responsable_col := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'sucursal'
      AND COLUMN_NAME = 'id_responsable'
);

-- 1) Añadir id_responsable si no existe
SET @ddl := IF(
    @has_id_responsable_col = 0,
    'ALTER TABLE sucursal ADD COLUMN id_responsable INT UNSIGNED NULL AFTER telefono',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) Migrar responsables de texto a usuarios ENCARGADO_SUCURSAL
SET @migrate := IF(
    @has_responsable_col = 1 AND @has_id_responsable_col = 1,
    'UPDATE sucursal s LEFT JOIN usuario u ON u.rol = ''ENCARGADO_SUCURSAL'' AND LOWER(CONCAT(u.nombre, '' '', u.apellido)) = LOWER(TRIM(s.responsable)) AND u.estado = 1 SET s.id_responsable = u.id_usuario',
    'SELECT 1'
);
PREPARE stmt FROM @migrate;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3) Añadir FK, UNIQUE e índice (si aún no existen)
SET @fk := IF(
    @has_id_responsable_col = 0,
    'ALTER TABLE sucursal ADD CONSTRAINT fk_sucursal_responsable FOREIGN KEY (id_responsable) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL, ADD CONSTRAINT uq_sucursal_responsable UNIQUE (id_responsable), ADD INDEX idx_sucursal_responsable (id_responsable)',
    'SELECT 1'
);
PREPARE stmt FROM @fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4) Eliminar la columna responsable si existe
SET @drop_old := IF(
    @has_responsable_col = 1,
    'ALTER TABLE sucursal DROP COLUMN responsable',
    'SELECT 1'
);
PREPARE stmt FROM @drop_old;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
