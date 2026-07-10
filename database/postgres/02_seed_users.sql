-- =====================================================
-- Datos iniciales para nutriconplus_users_db
-- Roles y permisos base del sistema
-- =====================================================

BEGIN;

-- =========================
-- Roles base
-- =========================
INSERT INTO roles (nombre, descripcion)
VALUES
('ADMIN', 'Administrador del sistema con acceso completo.'),
('VENDEDOR', 'Usuario encargado de registrar ventas y consultar inventario.'),
('LECTOR', 'Usuario con permisos únicamente de lectura.')
ON CONFLICT (nombre) DO NOTHING;

-- =========================
-- Permisos base
-- =========================
INSERT INTO permisos (codigo, descripcion, modulo)
VALUES
('USUARIOS_VER', 'Permite consultar usuarios.', 'USUARIOS'),
('USUARIOS_CREAR', 'Permite crear usuarios.', 'USUARIOS'),
('USUARIOS_EDITAR', 'Permite editar usuarios.', 'USUARIOS'),
('USUARIOS_ELIMINAR', 'Permite desactivar usuarios.', 'USUARIOS'),

('ROLES_VER', 'Permite consultar roles.', 'ROLES'),
('ROLES_ASIGNAR', 'Permite asignar roles a usuarios.', 'ROLES'),

('PRODUCTOS_VER', 'Permite consultar productos.', 'PRODUCTOS'),
('PRODUCTOS_CREAR', 'Permite crear productos.', 'PRODUCTOS'),
('PRODUCTOS_EDITAR', 'Permite editar productos.', 'PRODUCTOS'),

('INVENTARIO_VER', 'Permite consultar inventario.', 'INVENTARIO'),
('INVENTARIO_AJUSTAR', 'Permite realizar ajustes de inventario.', 'INVENTARIO'),

('VENTAS_VER', 'Permite consultar ventas.', 'VENTAS'),
('VENTAS_CREAR', 'Permite registrar ventas.', 'VENTAS'),
('VENTAS_ANULAR', 'Permite anular ventas.', 'VENTAS'),

('CUADRES_VER', 'Permite consultar cuadres.', 'CUADRES'),
('CUADRES_CREAR', 'Permite crear cuadres diarios.', 'CUADRES'),
('REPORTES_VER', 'Permite consultar reportes mensuales.', 'REPORTES')
ON CONFLICT (codigo) DO NOTHING;

-- =========================
-- Permisos para ADMIN
-- =========================
INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'ADMIN'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- =========================
-- Permisos para VENDEDOR
-- =========================
INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
JOIN permisos p ON p.codigo IN (
    'PRODUCTOS_VER',
    'INVENTARIO_VER',
    'VENTAS_VER',
    'VENTAS_CREAR',
    'CUADRES_VER',
    'CUADRES_CREAR',
    'REPORTES_VER'
)
WHERE r.nombre = 'VENDEDOR'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

-- =========================
-- Permisos para LECTOR
-- =========================
INSERT INTO roles_permisos (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM roles r
JOIN permisos p ON p.codigo IN (
    'PRODUCTOS_VER',
    'INVENTARIO_VER',
    'VENTAS_VER',
    'CUADRES_VER',
    'REPORTES_VER'
)
WHERE r.nombre = 'LECTOR'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

COMMIT;
