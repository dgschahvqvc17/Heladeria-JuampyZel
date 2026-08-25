-- Datos semilla para la base de datos JuampyZel

USE juampyzel;

-- Roles
INSERT INTO roles (name, description) VALUES
('Administrador', 'Acceso completo al sistema'),
('Empleado', 'Gestión de operaciones diarias'),
('Tienda', 'Acceso limitado para pedidos');

-- Categorías
INSERT INTO categories (name, description) VALUES
('Helados Clásicos', 'Helados tradicionales'),
('Helados Premium', 'Helados de alta gama'),
('Helados Especiales', 'Helados temáticos y estacionales');

-- Sucursales
INSERT INTO branches (name, address, phone, status) VALUES
('Sucursal Central', 'Av. Principal 123', '011-1234-5678', TRUE),
('Sucursal Norte', 'Calle 45 #67-89', '011-9876-5432', TRUE);

-- Productos
INSERT INTO products (name, description, price, category_id, status) VALUES
('Helado de Chocolate', 'Helado clásico de chocolate', 1500.00, 1, TRUE),
('Helado de Vainilla', 'Helado clásico de vainilla', 1500.00, 1, TRUE),
('Helado de Frutos Rojos', 'Helado premium de frutos rojos', 2500.00, 2, TRUE);
