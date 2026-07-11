import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  requireRole,
  requirePermission
} from '../middlewares/authorization.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, profile);

router.get(
  '/admin-test',
  authMiddleware,
  requireRole(['ADMIN']),
  (req, res) => {
    res.json({
      message: 'Acceso permitido solo para ADMIN',
      usuario: (req as any).usuario
    });
  }
);

router.get(
  '/sales-test',
  authMiddleware,
  requireRole(['ADMIN', 'VENDEDOR']),
  (req, res) => {
    res.json({
      message: 'Acceso permitido para ADMIN o VENDEDOR',
      usuario: (req as any).usuario
    });
  }
);

router.get(
  '/permission-test',
  authMiddleware,
  requirePermission('VENTAS_CREAR'),
  (req, res) => {
    res.json({
      message: 'Acceso permitido porque tiene permiso VENTAS_CREAR',
      usuario: (req as any).usuario
    });
  }
);

export default router;