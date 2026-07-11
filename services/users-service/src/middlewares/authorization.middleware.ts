import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const requireRole = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

    if (!usuario || !usuario.roles) {
      return res.status(403).json({
        message: 'No autorizado'
      });
    }

    const tieneRol = usuario.roles.some((rol: string) =>
      rolesPermitidos.includes(rol)
    );

    if (!tieneRol) {
      return res.status(403).json({
        message: 'No tiene el rol necesario para esta acción'
      });
    }

    next();
  };
};

export const requirePermission = (permisoRequerido: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = (req as any).usuario;

      if (!usuario || !usuario.id_usuario) {
        return res.status(403).json({
          message: 'No autorizado'
        });
      }

      const permisos: any[] = await sequelize.query(
        `SELECT p.codigo
         FROM permisos p
         INNER JOIN roles_permisos rp ON p.id_permiso = rp.id_permiso
         INNER JOIN roles r ON rp.id_rol = r.id_rol
         INNER JOIN usuarios_roles ur ON r.id_rol = ur.id_rol
         WHERE ur.id_usuario = :id_usuario
         AND p.codigo = :permiso`,
        {
          replacements: {
            id_usuario: usuario.id_usuario,
            permiso: permisoRequerido
          },
          type: QueryTypes.SELECT
        }
      );

      if (permisos.length === 0) {
        return res.status(403).json({
          message: 'No tiene el permiso necesario para esta acción'
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        message: 'Error al validar permisos',
        error: error.message
      });
    }
  };
};