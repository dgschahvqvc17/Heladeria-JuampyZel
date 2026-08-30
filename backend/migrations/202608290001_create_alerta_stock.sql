-- ============================================================
-- Migración: 202608290001_create_alerta_stock
-- Descripción: Crea la tabla para registrar las alertas de
--              stock bajo según la HU11.
-- ============================================================

CREATE TABLE IF NOT EXISTS alerta_stock (
    id_alerta INT UNSIGNED AUTO_INCREMENT,
    id_inventario INT UNSIGNED NOT NULL,
    fecha_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'ATENDIDA') NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT pk_alerta_stock
        PRIMARY KEY (id_alerta),

    CONSTRAINT fk_alerta_inventario
        FOREIGN KEY (id_inventario)
        REFERENCES inventario(id_inventario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;