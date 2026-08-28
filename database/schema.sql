-- ============================================================
-- BASE DE DATOS: JUAMPYZEL
-- Sistema web de gestión de empresa de helados
-- ============================================================

DROP DATABASE IF EXISTS juampyzel;

CREATE DATABASE juampyzel
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE juampyzel;


-- ============================================================
-- 1. USUARIO
-- ============================================================

CREATE TABLE usuario (
    id_usuario INT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM(
        'ADMINISTRADOR',
        'ENCARGADO_SUCURSAL',
        'VENDEDOR',
        'INVENTARIO'
    ) NOT NULL DEFAULT 'VENDEDOR',
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuario
        PRIMARY KEY (id_usuario),

    CONSTRAINT uq_usuario_correo
        UNIQUE (correo),

    CONSTRAINT chk_usuario_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 2),

    CONSTRAINT chk_usuario_apellido
        CHECK (CHAR_LENGTH(TRIM(apellido)) >= 2)
) ENGINE=InnoDB;


-- ============================================================
-- 2. CATEGORIA
-- ============================================================

CREATE TABLE categoria (
    id_categoria INT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_categoria
        PRIMARY KEY (id_categoria),

    CONSTRAINT uq_categoria_nombre
        UNIQUE (nombre),

    CONSTRAINT chk_categoria_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 2)
) ENGINE=InnoDB;


-- ============================================================
-- 3. PRODUCTO
-- ============================================================

CREATE TABLE producto (
    id_producto INT UNSIGNED AUTO_INCREMENT,
    id_categoria INT UNSIGNED NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock_minimo INT UNSIGNED NOT NULL DEFAULT 5,
    imagen VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_producto
        PRIMARY KEY (id_producto),

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_producto_precio
        CHECK (precio > 0),

    CONSTRAINT chk_producto_stock_minimo
        CHECK (stock_minimo >= 0),

    INDEX idx_producto_categoria (id_categoria),
    INDEX idx_producto_nombre (nombre),
    INDEX idx_producto_estado (estado)
) ENGINE=InnoDB;


-- ============================================================
-- 4. SUCURSAL
-- ============================================================

CREATE TABLE sucursal (
    id_sucursal INT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    id_responsable INT UNSIGNED NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_sucursal
        PRIMARY KEY (id_sucursal),

    CONSTRAINT fk_sucursal_responsable
        FOREIGN KEY (id_responsable)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_sucursal_nombre
        UNIQUE (nombre),

    -- Un encargado de sucursal solo puede estar
    -- a cargo de una única sucursal.
    CONSTRAINT uq_sucursal_responsable
        UNIQUE (id_responsable),

    CONSTRAINT chk_sucursal_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 2),

    CONSTRAINT chk_sucursal_direccion
        CHECK (CHAR_LENGTH(TRIM(direccion)) >= 5),

    INDEX idx_sucursal_responsable (id_responsable)
) ENGINE=InnoDB;


-- ============================================================
-- 5. CLIENTE
-- ============================================================

CREATE TABLE cliente (
    id_cliente INT UNSIGNED AUTO_INCREMENT,
    id_usuario INT UNSIGNED NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(200),
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_cliente
        PRIMARY KEY (id_cliente),

    CONSTRAINT fk_cliente_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_cliente_usuario
        UNIQUE (id_usuario),

    CONSTRAINT uq_cliente_correo
        UNIQUE (correo),

    CONSTRAINT chk_cliente_nombres
        CHECK (CHAR_LENGTH(TRIM(nombres)) >= 2),

    CONSTRAINT chk_cliente_apellidos
        CHECK (CHAR_LENGTH(TRIM(apellidos)) >= 2),

    INDEX idx_cliente_nombres (nombres),
    INDEX idx_cliente_apellidos (apellidos)
) ENGINE=InnoDB;


-- ============================================================
-- 6. TIENDA
-- ============================================================

CREATE TABLE tienda (
    id_tienda INT UNSIGNED AUTO_INCREMENT,
    id_usuario INT UNSIGNED NULL,
    nombre VARCHAR(150) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(200) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tienda
        PRIMARY KEY (id_tienda),

    CONSTRAINT fk_tienda_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_tienda_usuario
        UNIQUE (id_usuario),

    CONSTRAINT uq_tienda_nombre
        UNIQUE (nombre),

    CONSTRAINT chk_tienda_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 2),

    CONSTRAINT chk_tienda_responsable
        CHECK (CHAR_LENGTH(TRIM(responsable)) >= 2),

    CONSTRAINT chk_tienda_direccion
        CHECK (CHAR_LENGTH(TRIM(direccion)) >= 5),

    INDEX idx_tienda_nombre (nombre),
    INDEX idx_tienda_estado (estado)
) ENGINE=InnoDB;


-- ============================================================
-- 7. INVENTARIO
-- ============================================================

CREATE TABLE inventario (
    id_inventario INT UNSIGNED AUTO_INCREMENT,
    id_producto INT UNSIGNED NOT NULL,
    id_sucursal INT UNSIGNED NOT NULL,
    stock_actual INT UNSIGNED NOT NULL DEFAULT 0,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_inventario
        PRIMARY KEY (id_inventario),

    CONSTRAINT fk_inventario_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventario_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_inventario_producto_sucursal
        UNIQUE (id_producto, id_sucursal),

    CONSTRAINT chk_inventario_stock
        CHECK (stock_actual >= 0),

    INDEX idx_inventario_producto (id_producto),
    INDEX idx_inventario_sucursal (id_sucursal)
) ENGINE=InnoDB;


-- ============================================================
-- 8. VENTA
-- ============================================================

CREATE TABLE venta (
    id_venta INT UNSIGNED AUTO_INCREMENT,
    id_cliente INT UNSIGNED NULL,
    id_usuario INT UNSIGNED NOT NULL,
    id_sucursal INT UNSIGNED NOT NULL,
    fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT pk_venta
        PRIMARY KEY (id_venta),

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_venta_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_venta_total
        CHECK (total >= 0),

    INDEX idx_venta_cliente (id_cliente),
    INDEX idx_venta_usuario (id_usuario),
    INDEX idx_venta_sucursal (id_sucursal),
    INDEX idx_venta_fecha (fecha_venta)
) ENGINE=InnoDB;


-- ============================================================
-- 9. DETALLE_VENTA
-- ============================================================

CREATE TABLE detalle_venta (
    id_detalle_venta INT UNSIGNED AUTO_INCREMENT,
    id_venta INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT pk_detalle_venta
        PRIMARY KEY (id_detalle_venta),

    CONSTRAINT fk_detalle_venta_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_venta_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_detalle_venta_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_venta_precio
        CHECK (precio_unitario > 0),

    CONSTRAINT chk_detalle_venta_subtotal
        CHECK (subtotal >= 0),

    INDEX idx_detalle_venta_venta (id_venta),
    INDEX idx_detalle_venta_producto (id_producto)
) ENGINE=InnoDB;


-- ============================================================
-- 10. PEDIDO
-- ============================================================

CREATE TABLE pedido (
    id_pedido INT UNSIGNED AUTO_INCREMENT,
    id_tienda INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NULL,
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'PENDIENTE',
        'CONFIRMADO',
        'PREPARANDO',
        'LISTO',
        'ENTREGADO',
        'CANCELADO'
    ) NOT NULL DEFAULT 'PENDIENTE',

    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT pk_pedido
        PRIMARY KEY (id_pedido),

    CONSTRAINT fk_pedido_tienda
        FOREIGN KEY (id_tienda)
        REFERENCES tienda(id_tienda)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_pedido_total
        CHECK (total >= 0),

    INDEX idx_pedido_tienda (id_tienda),
    INDEX idx_pedido_usuario (id_usuario),
    INDEX idx_pedido_estado (estado),
    INDEX idx_pedido_fecha (fecha_pedido)
) ENGINE=InnoDB;


-- ============================================================
-- 11. DETALLE_PEDIDO
-- ============================================================

CREATE TABLE detalle_pedido (
    id_detalle_pedido INT UNSIGNED AUTO_INCREMENT,
    id_pedido INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT pk_detalle_pedido
        PRIMARY KEY (id_detalle_pedido),

    CONSTRAINT fk_detalle_pedido_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_pedido_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_detalle_pedido_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_pedido_precio
        CHECK (precio_unitario > 0),

    CONSTRAINT chk_detalle_pedido_subtotal
        CHECK (subtotal >= 0),

    INDEX idx_detalle_pedido_pedido (id_pedido),
    INDEX idx_detalle_pedido_producto (id_producto)
) ENGINE=InnoDB;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

SHOW TABLES;
