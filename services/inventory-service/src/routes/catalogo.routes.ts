import { Router } from 'express';
import { getCatalogos } from '../controllers/catalogo.controller';

const router = Router();

router.get('/', getCatalogos);

export default router;