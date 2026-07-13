import { Router } from 'express';
import { sequelize } from '../config/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      status: 'OK',
      service: 'inventory-service',
      database: 'connected'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      service: 'inventory-service',
      database: 'disconnected',
      error: error.message
    });
  }
});

export default router;