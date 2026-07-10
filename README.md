# NutriConPlus - Sistema de Inventario

Proyecto final de Administración de Sistemas Operativos.

## Descripción

Sistema web basado en microservicios para la gestión de inventario de productos, ventas, cuadres diarios y reportes mensuales.

## Arquitectura

- Frontend: Angular
- Microservicio de usuarios: Node.js + Express + PostgreSQL
- Microservicio de inventario: Node.js + Express + MySQL
- Proxy inverso: NGINX
- Autenticación: JWT
- Sistema operativo: Ubuntu

## Seguridad

El proyecto no se trabajará directamente con el usuario root.  
El usuario principal de trabajo será `axelfunes`.

Además, se configuró `umask` en `0022` para que solo el propietario pueda modificar los archivos creados.
