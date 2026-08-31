-- Seed automatico: usuarios y categorias iniciales solo si las tablas estan vacias (primera ejecucion)

-- Usuarios iniciales
INSERT INTO usuario (nombre, apellido, correo, password, rol)
SELECT tmp.nombre, tmp.apellido, tmp.correo, tmp.password, tmp.rol FROM (
    SELECT 'Administrador' AS nombre, 'JuampyZel' AS apellido, 'admin@juampyzel.com' AS correo, '$2a$10$p8HxevdO7f30sXXiDjylFOfO78TSUxNKLudVm3HlJXrgW62DPJHC.' AS password, 'ADMINISTRADOR' AS rol
    UNION ALL
    SELECT 'Carlos', 'Vendedor', 'vendedor@juampyzel.com', '$2a$10$PR3NEEc.Z.y1HJJmiJQ/4eyYw0QaIsyUs6dAM7jwCtC23GSfg/13e', 'VENDEDOR'
    UNION ALL
    SELECT 'Juan', 'Inventario', 'inventario@juampyzel.com', '$2a$10$j1Bg/089VqiguC4RBinM1eJIYrpsO88Oh4RbE.C.reDAouf96VHvu', 'INVENTARIO'
    UNION ALL
    SELECT 'Lucia', 'Encargada', 'encargado@juampyzel.com', '$2a$10$x5s1Czhd33dbMyNqwCgngeA3V5ICI6SFwyzuuIKvPzRwhqEnoGixC', 'ENCARGADO_SUCURSAL'
    UNION ALL
    SELECT 'Miguel', 'Encargado', 'encargado2@juampyzel.com', '$2a$10$x5s1Czhd33dbMyNqwCgngeA3V5ICI6SFwyzuuIKvPzRwhqEnoGixC', 'ENCARGADO_SUCURSAL'
) AS tmp
WHERE (SELECT COUNT(*) FROM usuario) = 0;

-- Categorias iniciales
INSERT INTO categoria (nombre, descripcion)
SELECT tmp.nombre, tmp.descripcion FROM (
    SELECT 'Helados de crema' AS nombre, 'Helados elaborados a base de crema' AS descripcion
    UNION ALL
    SELECT 'Helados de fruta', 'Helados elaborados con diferentes frutas'
    UNION ALL
    SELECT 'Paletas', 'Paletas y helados individuales'
    UNION ALL
    SELECT 'Especiales', 'Productos especiales de JuampyZel'
) AS tmp
WHERE (SELECT COUNT(*) FROM categoria) = 0;
