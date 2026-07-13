import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  postProducto,
  putProducto,
  deleteProducto
} from '../controllers/producto.controller'; 

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', postProducto);
router.put('/:id', putProducto);
router.delete('/:id', deleteProducto);

export default router;