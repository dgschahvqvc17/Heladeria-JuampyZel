-- ============================================================
-- Migración: 202608300002_actualizar_enum_pedidos
-- Descripción: Amplía los estados permitidos en la tabla pedido
--              para soportar el flujo de la HU10.
-- ============================================================

ALTER TABLE pedido
    MODIFY COLUMN estado ENUM(
        'PENDIENTE', 
        'CONFIRMADO', 
        'PREPARANDO', 
        'LISTO', 
        'ENTREGADO', 
        'CANCELADO'
    ) NOT NULL DEFAULT 'PENDIENTE';