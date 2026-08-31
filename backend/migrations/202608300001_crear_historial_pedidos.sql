-- ============================================================
-- Migración: 202608300001_crear_historial_pedidos
-- Descripción: Crea la tabla para registrar el historial de
--              cambios de estado de los pedidos (HU10).
-- ============================================================

CREATE TABLE IF NOT EXISTS historial_pedido (
    id_historial INT UNSIGNED AUTO_INCREMENT,
    id_pedido INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    estado_anterior VARCHAR(50) NOT NULL,
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_historial_pedido 
        PRIMARY KEY (id_historial),

    CONSTRAINT fk_historial_pedido 
        FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) 
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
        
    INDEX idx_historial_pedido (id_pedido),
    INDEX idx_historial_fecha (fecha_cambio)
) ENGINE=InnoDB;