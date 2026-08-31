-- ============================================================
-- Migración: 202608290001_crear_movimiento_inventario
-- Descripción: Crea la tabla movimiento_inventario para el
--              control de entradas, salidas y ajustes de stock
--              (HU09 - Gestionar inventario).
--
-- La operación es idempotente:
--   1. Crea la tabla si no existe.
--   2. Si la tabla preexistía sin la columna "stock_anterior",
--      la agrega para conservar el historial completo.
-- ============================================================

CREATE TABLE IF NOT EXISTS movimiento_inventario (
    id_movimiento INT UNSIGNED AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    id_sucursal INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    tipo ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT UNSIGNED NOT NULL DEFAULT 0,
    stock_resultante INT UNSIGNED NOT NULL,
    motivo VARCHAR(255) NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_movimiento_inventario
        PRIMARY KEY (id_movimiento),

    CONSTRAINT fk_movimiento_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_movimiento_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_movimiento_cantidad
        CHECK (
            (tipo = 'ENTRADA' AND cantidad >= 0)
            OR (tipo = 'SALIDA' AND cantidad < 0)
            OR (tipo = 'AJUSTE')
        ),

    CONSTRAINT chk_movimiento_stock_resultante
        CHECK (stock_resultante >= 0),

    INDEX idx_movimiento_producto (id_producto),
    INDEX idx_movimiento_sucursal (id_sucursal),
    INDEX idx_movimiento_usuario (id_usuario),
    INDEX idx_movimiento_fecha (fecha_movimiento)
) ENGINE=InnoDB;

-- Agregar stock_anterior si la tabla preexistía sin esa columna
SET @has_stock_anterior := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'movimiento_inventario'
      AND COLUMN_NAME = 'stock_anterior'
);

SET @ddl := IF(
    @has_stock_anterior = 0,
    'ALTER TABLE movimiento_inventario ADD COLUMN stock_anterior INT UNSIGNED NOT NULL DEFAULT 0 AFTER cantidad',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;