import { Router } from 'express';
import {
  getStock,
  getMovimientos,
  postEntrada,
  postAjuste
} from '../controllers/inventario.controller';

const router = Router();

router.get('/', getStock);
router.get('/movimientos', getMovimientos);
router.post('/entrada', postEntrada);
router.post('/ajuste', postAjuste);

export default router;