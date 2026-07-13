import { Request, Response } from 'express';
import {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  desactivarProducto
} from '../services/producto.service';

export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await listarProductos();

    res.json({
      message: 'Productos obtenidos correctamente',
      productos
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const getProductoById = async (req: Request, res: Response) => {
  try {
    const id_producto = Number(req.params.id);
    const producto = await obtenerProductoPorId(id_producto);

    res.json({
      message: 'Producto obtenido correctamente',
      producto
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const postProducto = async (req: Request, res: Response) => {
  try {
    const {
      codigo_producto,
      nombre,
      id_categoria,
      id_unidad_medida,
      precio_compra,
      precio_venta
    } = req.body;

    if (
      !codigo_producto ||
      !nombre ||
      !id_categoria ||
      !id_unidad_medida ||
      !precio_compra ||
      !precio_venta
    ) {
      res.status(400).json({
        message: 'Código, nombre, categoría, unidad, precio compra y precio venta son obligatorios'
      });
      return;
    }

    const producto = await crearProducto(req.body);

    res.status(201).json({
      message: 'Producto creado correctamente',
      producto
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const putProducto = async (req: Request, res: Response) => {
  try {
    const id_producto = Number(req.params.id);
    const producto = await actualizarProducto(id_producto, req.body);

    res.json({
      message: 'Producto actualizado correctamente',
      producto
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const id_producto = Number(req.params.id);
    const producto = await desactivarProducto(id_producto);

    res.json({
      message: 'Producto desactivado correctamente',
      producto
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};