import { Router } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha_servidor');

    res.json({
      status: 'OK',
      service: 'users-service',
      database: 'connected',
      fecha_servidor: result.rows[0].fecha_servidor
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      service: 'users-service',
      database: 'disconnected',
      error: error.message
    });
  }
});

export default router;