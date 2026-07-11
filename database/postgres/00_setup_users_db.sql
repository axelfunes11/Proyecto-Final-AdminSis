-- =====================================================
-- Configuración inicial PostgreSQL
-- Base: nutriconplus_users_db
-- Usuario de aplicación: app_users_db
-- Ejecutar con usuario administrador postgres
-- =====================================================

CREATE DATABASE nutriconplus_users_db;

CREATE USER app_users_db WITH PASSWORD 'Cambiar_esta_contraseña';

GRANT ALL PRIVILEGES ON DATABASE nutriconplus_users_db TO app_users_db;

\c nutriconplus_users_db

ALTER SCHEMA public OWNER TO app_users_db;

GRANT USAGE, CREATE ON SCHEMA public TO app_users_db;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO app_users_db;

GRANT USAGE, SELECT, UPDATE
ON ALL SEQUENCES IN SCHEMA public
TO app_users_db;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_users_db;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO app_users_db;