-- =====================================================
-- Base de datos: nutriconplus_users_db
-- Microservicio: Usuarios
-- Motor: PostgreSQL
-- Descripción: Tablas para autenticación, autorización,
-- roles, permisos, JWT y bitácora de acceso.
-- =====================================================

BEGIN;

-- =========================
-- Tabla: usuarios
-- =========================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    ultimo_login TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuarios_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO'))
);

-- =========================
-- Tabla: roles
-- =========================
CREATE TABLE IF NOT EXISTS roles (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_roles_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

-- =========================
-- Tabla: permisos
-- =========================
CREATE TABLE IF NOT EXISTS permisos (
    id_permiso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    modulo VARCHAR(80) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_permisos_estado
    CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

-- =========================
-- Tabla: usuarios_roles
-- =========================
CREATE TABLE IF NOT EXISTS usuarios_roles (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_rol),

    CONSTRAINT fk_usuarios_roles_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE,

    CONSTRAINT fk_usuarios_roles_rol
    FOREIGN KEY (id_rol)
    REFERENCES roles(id_rol)
    ON DELETE CASCADE
);

-- =========================
-- Tabla: roles_permisos
-- =========================
CREATE TABLE IF NOT EXISTS roles_permisos (
    id_rol INTEGER NOT NULL,
    id_permiso INTEGER NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_rol, id_permiso),

    CONSTRAINT fk_roles_permisos_rol
    FOREIGN KEY (id_rol)
    REFERENCES roles(id_rol)
    ON DELETE CASCADE,

    CONSTRAINT fk_roles_permisos_permiso
    FOREIGN KEY (id_permiso)
    REFERENCES permisos(id_permiso)
    ON DELETE CASCADE
);

-- =========================
-- Tabla: tokens_refresh
-- =========================
CREATE TABLE IF NOT EXISTS tokens_refresh (
    id_token INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMPTZ NOT NULL,
    revocado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revocado_en TIMESTAMPTZ,

    CONSTRAINT fk_tokens_refresh_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);

-- =========================
-- Tabla: bitacora_autenticacion
-- =========================
CREATE TABLE IF NOT EXISTS bitacora_autenticacion (
    id_bitacora INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER,
    correo_intento VARCHAR(150),
    accion VARCHAR(50) NOT NULL,
    exitoso BOOLEAN NOT NULL,
    ip_origen VARCHAR(45),
    user_agent VARCHAR(255),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bitacora_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE SET NULL,

    CONSTRAINT chk_bitacora_accion
    CHECK (accion IN ('LOGIN', 'LOGIN_FALLIDO', 'LOGOUT', 'TOKEN_REFRESH'))
);

-- =========================
-- Índices 
-- =========================
CREATE INDEX IF NOT EXISTS idx_usuarios_correo
ON usuarios(correo);

CREATE INDEX IF NOT EXISTS idx_roles_nombre
ON roles(nombre);

CREATE INDEX IF NOT EXISTS idx_permisos_codigo
ON permisos(codigo);

CREATE INDEX IF NOT EXISTS idx_tokens_refresh_usuario
ON tokens_refresh(id_usuario);

CREATE INDEX IF NOT EXISTS idx_bitacora_usuario
ON bitacora_autenticacion(id_usuario);

CREATE INDEX IF NOT EXISTS idx_bitacora_correo_intento
ON bitacora_autenticacion(correo_intento);

-- =========================
-- Función para actualizar actualizado_en
-- =========================
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- Triggers de actualización
-- =========================
DROP TRIGGER IF EXISTS trg_usuarios_actualizado_en ON usuarios;
CREATE TRIGGER trg_usuarios_actualizado_en
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

DROP TRIGGER IF EXISTS trg_roles_actualizado_en ON roles;
CREATE TRIGGER trg_roles_actualizado_en
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

DROP TRIGGER IF EXISTS trg_permisos_actualizado_en ON permisos;
CREATE TRIGGER trg_permisos_actualizado_en
BEFORE UPDATE ON permisos
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

COMMIT;
