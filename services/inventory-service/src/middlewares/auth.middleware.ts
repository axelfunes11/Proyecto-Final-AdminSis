import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Token no proporcionado'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verificarToken(token);

    (req as any).usuario = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token inválido o expirado'
    });
  }
};