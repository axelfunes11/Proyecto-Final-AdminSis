import { Router } from 'express';
import {
  getCuadresDiarios,
  postCuadreDiario,
  getCuadresMensuales,
  postCuadreMensual
} from '../controllers/cuadre.controller';

const router = Router();

router.get('/diario', getCuadresDiarios);
router.post('/diario', postCuadreDiario);

router.get('/mensual', getCuadresMensuales);
router.post('/mensual', postCuadreMensual);

export default router;