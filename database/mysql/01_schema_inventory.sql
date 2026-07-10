-- =====================================================
-- Base de datos: nutriconplus_inventory_db
-- Microservicio: Inventario
-- Motor: MySQL
-- Descripción: Tablas para productos, marcas, inventario,
-- ventas, pagos, movimientos y cuadres.
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS cuadre_mensual_diarios;
DROP TABLE IF EXISTS cuadres_mensuales;
DROP TABLE IF EXISTS cuadre_diario_pagos;
DROP TABLE IF EXISTS cuadres_diarios;
DROP TABLE IF EXISTS pagos_venta;
DROP TABLE IF EXISTS metodos_pago;
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS estados_venta;
DROP TABLE IF EXISTS movimientos_inventario;
DROP TABLE IF EXISTS tipos_movimiento;
DROP TABLE IF EXISTS inventario;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS unidades_medida;
DROP TABLE IF EXISTS categorias;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- Tabla: categorias
-- =========================
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_categorias_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: unidades_medida
-- =========================
CREATE TABLE unidades_medida (
    id_unidad_medida INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    abreviatura VARCHAR(20) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_unidades_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: proveedores
-- =========================
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(25),
    correo VARCHAR(150),
    direccion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_proveedores_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: marcas
-- =========================
CREATE TABLE marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_marcas_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: productos
-- =========================
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sku VARCHAR(80) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    id_categoria INT NOT NULL,
    id_unidad_medida INT NOT NULL,
    id_proveedor INT NULL,
    id_marca INT NULL,
    precio_costo DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
    fecha_vencimiento DATE NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_productos_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES categorias(id_categoria),

    CONSTRAINT fk_productos_unidad_medida
    FOREIGN KEY (id_unidad_medida)
    REFERENCES unidades_medida(id_unidad_medida),

    CONSTRAINT fk_productos_proveedor
    FOREIGN KEY (id_proveedor)
    REFERENCES proveedores(id_proveedor),

    CONSTRAINT fk_productos_marca
    FOREIGN KEY (id_marca)
    REFERENCES marcas(id_marca),

    CONSTRAINT chk_productos_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO')),

    CONSTRAINT chk_productos_precios
    CHECK (precio_costo >= 0 AND precio_venta >= 0 AND stock_minimo >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: inventario
-- =========================
CREATE TABLE inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL UNIQUE,
    cantidad_actual DECIMAL(10,2) NOT NULL DEFAULT 0,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventario_producto
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
    ON DELETE CASCADE,

    CONSTRAINT chk_inventario_cantidad
    CHECK (cantidad_actual >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: tipos_movimiento
-- =========================
CREATE TABLE tipos_movimiento (
    id_tipo_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    afecta_stock INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tipos_movimiento_afecta
    CHECK (afecta_stock IN (-1, 1)),

    CONSTRAINT chk_tipos_movimiento_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: movimientos_inventario
-- =========================
CREATE TABLE movimientos_inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_tipo_movimiento INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    stock_anterior DECIMAL(10,2) NOT NULL,
    stock_nuevo DECIMAL(10,2) NOT NULL,
    referencia_tipo VARCHAR(50),
    referencia_id INT,
    motivo VARCHAR(255),
    usuario_externo_id INT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimientos_producto
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto),

    CONSTRAINT fk_movimientos_tipo
    FOREIGN KEY (id_tipo_movimiento)
    REFERENCES tipos_movimiento(id_tipo_movimiento),

    CONSTRAINT chk_movimientos_cantidad
    CHECK (cantidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: estados_venta
-- =========================
CREATE TABLE estados_venta (
    id_estado_venta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: ventas
-- =========================
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    numero_venta VARCHAR(80) NOT NULL UNIQUE,
    fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado_venta INT NOT NULL,
    usuario_externo_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    observaciones VARCHAR(255),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ventas_estado
    FOREIGN KEY (id_estado_venta)
    REFERENCES estados_venta(id_estado_venta),

    CONSTRAINT chk_ventas_montos
    CHECK (subtotal >= 0 AND descuento_total >= 0 AND total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: detalle_ventas
-- =========================
CREATE TABLE detalle_ventas (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) NOT NULL DEFAULT 0,
    subtotal_linea DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_ventas_venta
    FOREIGN KEY (id_venta)
    REFERENCES ventas(id_venta)
    ON DELETE CASCADE,

    CONSTRAINT fk_detalle_ventas_producto
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto),

    CONSTRAINT chk_detalle_ventas_montos
    CHECK (
        cantidad > 0
        AND precio_unitario >= 0
        AND descuento_linea >= 0
        AND subtotal_linea >= 0
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: metodos_pago
-- =========================
CREATE TABLE metodos_pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_metodos_pago_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: pagos_venta
-- =========================
CREATE TABLE pagos_venta (
    id_pago_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(150),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pagos_venta_venta
    FOREIGN KEY (id_venta)
    REFERENCES ventas(id_venta)
    ON DELETE CASCADE,

    CONSTRAINT fk_pagos_venta_metodo
    FOREIGN KEY (id_metodo_pago)
    REFERENCES metodos_pago(id_metodo_pago),

    CONSTRAINT chk_pagos_venta_monto
    CHECK (monto > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: cuadres_diarios
-- =========================
CREATE TABLE cuadres_diarios (
    id_cuadre_diario INT AUTO_INCREMENT PRIMARY KEY,
    fecha_cuadre DATE NOT NULL UNIQUE,
    usuario_externo_id INT NOT NULL,
    total_ventas_sistema DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_contado DECIMAL(10,2) NOT NULL DEFAULT 0,
    diferencia DECIMAL(10,2) NOT NULL DEFAULT 0,
    observaciones VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ABIERTO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_cuadres_diarios_estado
    CHECK (estado IN ('ABIERTO', 'CERRADO', 'ANULADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: cuadre_diario_pagos
-- =========================
CREATE TABLE cuadre_diario_pagos (
    id_cuadre_diario_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cuadre_diario INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto_sistema DECIMAL(10,2) NOT NULL DEFAULT 0,
    monto_contado DECIMAL(10,2) NOT NULL DEFAULT 0,
    diferencia DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_cuadre_diario_pagos_cuadre
    FOREIGN KEY (id_cuadre_diario)
    REFERENCES cuadres_diarios(id_cuadre_diario)
    ON DELETE CASCADE,

    CONSTRAINT fk_cuadre_diario_pagos_metodo
    FOREIGN KEY (id_metodo_pago)
    REFERENCES metodos_pago(id_metodo_pago),

    CONSTRAINT uq_cuadre_diario_metodo
    UNIQUE (id_cuadre_diario, id_metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: cuadres_mensuales
-- =========================
CREATE TABLE cuadres_mensuales (
    id_cuadre_mensual INT AUTO_INCREMENT PRIMARY KEY,
    anio INT NOT NULL,
    mes INT NOT NULL,
    usuario_externo_id INT NOT NULL,
    total_ventas DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_diferencias DECIMAL(10,2) NOT NULL DEFAULT 0,
    cantidad_ventas INT NOT NULL DEFAULT 0,
    cantidad_productos_vendidos DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL DEFAULT 'GENERADO',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_cuadre_mensual
    UNIQUE (anio, mes),

    CONSTRAINT chk_cuadres_mensuales_mes
    CHECK (mes BETWEEN 1 AND 12),

    CONSTRAINT chk_cuadres_mensuales_estado
    CHECK (estado IN ('GENERADO', 'CERRADO', 'ANULADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Tabla: cuadre_mensual_diarios
-- =========================
CREATE TABLE cuadre_mensual_diarios (
    id_cuadre_mensual_diario INT AUTO_INCREMENT PRIMARY KEY,
    id_cuadre_mensual INT NOT NULL,
    id_cuadre_diario INT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cuadre_mensual_diarios_mensual
    FOREIGN KEY (id_cuadre_mensual)
    REFERENCES cuadres_mensuales(id_cuadre_mensual)
    ON DELETE CASCADE,

    CONSTRAINT fk_cuadre_mensual_diarios_diario
    FOREIGN KEY (id_cuadre_diario)
    REFERENCES cuadres_diarios(id_cuadre_diario)
    ON DELETE CASCADE,

    CONSTRAINT uq_cuadre_mensual_diario
    UNIQUE (id_cuadre_mensual, id_cuadre_diario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- Índices recomendados
-- =========================
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_unidad ON productos(id_unidad_medida);
CREATE INDEX idx_productos_proveedor ON productos(id_proveedor);
CREATE INDEX idx_productos_marca ON productos(id_marca);
CREATE INDEX idx_productos_nombre ON productos(nombre);

CREATE INDEX idx_movimientos_producto ON movimientos_inventario(id_producto);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(id_tipo_movimiento);
CREATE INDEX idx_movimientos_usuario ON movimientos_inventario(usuario_externo_id);

CREATE INDEX idx_ventas_estado ON ventas(id_estado_venta);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_externo_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);

CREATE INDEX idx_detalle_venta ON detalle_ventas(id_venta);
CREATE INDEX idx_detalle_producto ON detalle_ventas(id_producto);

CREATE INDEX idx_pagos_venta ON pagos_venta(id_venta);
CREATE INDEX idx_pagos_metodo ON pagos_venta(id_metodo_pago);

CREATE INDEX idx_cuadres_diarios_fecha ON cuadres_diarios(fecha_cuadre);
