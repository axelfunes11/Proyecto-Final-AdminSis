import { Router } from 'express';
import {
  getVentas,
  getVentaById,
  postVenta,
  postAnularVenta
} from '../controllers/venta.controller';

const router = Router();

router.get('/', getVentas);
router.get('/:id', getVentaById);
router.post('/', postVenta);
router.post('/:id/anular', postAnularVenta);

export default router;