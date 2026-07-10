-- =====================================================
-- Datos iniciales para nutriconplus_inventory_db
-- Catálogos base del sistema de inventario
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- Categorías iniciales
-- =========================
INSERT IGNORE INTO categorias (nombre, descripcion)
VALUES
('Alimento', 'Productos alimenticios para mascotas.'),
('Accesorios', 'Accesorios para el cuidado y paseo de mascotas.'),
('Juguetes', 'Juguetes para entretenimiento de mascotas.'),
('Higiene', 'Productos de limpieza e higiene para mascotas.'),
('Salud', 'Productos relacionados con salud y bienestar animal.'),
('Vivienda', 'Casas, camas, jaulas o espacios para mascotas.'),
('Comodidad', 'Productos para descanso y comodidad de mascotas.');

-- =========================
-- Unidades de medida
-- =========================
INSERT IGNORE INTO unidades_medida (nombre, abreviatura)
VALUES
('Unidad', 'und'),
('Libra', 'lb'),
('Kilogramo', 'kg'),
('Bolsa', 'bolsa'),
('Caja', 'caja'),
('Mililitro', 'ml'),
('Litro', 'l');

-- =========================
-- Marcas iniciales
-- =========================
INSERT IGNORE INTO marcas (nombre, descripcion)
VALUES
('Sin marca', 'Producto sin marca definida.');

-- =========================
-- Tipos de movimiento
-- =========================
INSERT IGNORE INTO tipos_movimiento (codigo, descripcion, afecta_stock)
VALUES
('ENTRADA', 'Ingreso de producto al inventario.', 1),
('VENTA', 'Salida de producto por venta.', -1),
('AJUSTE_POS', 'Ajuste positivo de inventario.', 1),
('AJUSTE_NEG', 'Ajuste negativo de inventario.', -1),
('ANULACION', 'Anulación de venta y retorno al inventario.', 1);

-- =========================
-- Estados de venta
-- =========================
INSERT IGNORE INTO estados_venta (nombre, descripcion)
VALUES
('COMPLETADA', 'Venta finalizada correctamente.'),
('ANULADA', 'Venta anulada.'),
('PENDIENTE', 'Venta pendiente de finalizar.');

-- =========================
-- Métodos de pago
-- =========================
INSERT IGNORE INTO metodos_pago (nombre, descripcion)
VALUES
('Efectivo', 'Pago realizado en efectivo.'),
('Tarjeta', 'Pago realizado con tarjeta.'),
('Transferencia', 'Pago realizado mediante transferencia bancaria.');

SET FOREIGN_KEY_CHECKS = 1;
