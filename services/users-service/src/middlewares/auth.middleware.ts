import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token inválido'
      });
    }

    const decoded = verificarToken(token);

    (req as any).usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token no válido o expirado'
    });
  }
};