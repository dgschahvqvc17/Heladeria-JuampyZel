-- ============================================================
-- DATOS SEMILLA: JUAMPYZEL
-- Contraseñas hasheadas con bcrypt (cost factor 10)
-- ============================================================

USE juampyzel;

-- Usuarios iniciales
-- Contraseñas por defecto: admin123, vendedor123, inventario123
INSERT INTO usuario
(nombre, apellido, correo, password, rol)
VALUES
(
    'Administrador',
    'JuampyZel',
    'admin@juampyzel.com',
    '$2a$10$p8HxevdO7f30sXXiDjylFOfO78TSUxNKLudVm3HlJXrgW62DPJHC.',
    'ADMINISTRADOR'
),
(
    'Carlos',
    'Vendedor',
    'vendedor@juampyzel.com',
    '$2a$10$PR3NEEc.Z.y1HJJmiJQ/4eyYw0QaIsyUs6dAM7jwCtC23GSfg/13e',
    'VENDEDOR'
),
(
    'Juan',
    'Inventario',
    'inventario@juampyzel.com',
    '$2a$10$j1Bg/089VqiguC4RBinM1eJIYrpsO88Oh4RbE.C.reDAouf96VHvu',
    'INVENTARIO'
);

-- Categorías iniciales
INSERT INTO categoria
(nombre, descripcion)
VALUES
('Helados de crema', 'Helados elaborados a base de crema'),
('Helados de fruta', 'Helados elaborados con diferentes frutas'),
('Paletas', 'Paletas y helados individuales'),
('Especiales', 'Productos especiales de JuampyZel');
