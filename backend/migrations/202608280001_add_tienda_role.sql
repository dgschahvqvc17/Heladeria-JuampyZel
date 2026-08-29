-- ============================================================
-- Migración: 202608280001_add_tienda_role
-- Descripción: Agrega el rol 'TIENDA' al ENUM de la columna
--              rol de la tabla usuario, para permitir que una
--              tienda tenga una cuenta de acceso propia y
--              realice pedidos de abastecimiento (HU08).
-- ============================================================

ALTER TABLE usuario
    MODIFY COLUMN rol ENUM(
        'ADMINISTRADOR',
        'ENCARGADO_SUCURSAL',
        'VENDEDOR',
        'INVENTARIO',
        'TIENDA'
    ) NOT NULL DEFAULT 'VENDEDOR';
