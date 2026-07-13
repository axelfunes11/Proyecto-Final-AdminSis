import { Request, Response } from 'express';
import {
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
  MetodoPago
} from '../models';

export const getCatalogos = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll({
      where: { estado: 'ACTIVO' }
    });

    const marcas = await Marca.findAll({
      where: { estado: 'ACTIVO' }
    });

    const unidades_medida = await UnidadMedida.findAll({
      where: { estado: 'ACTIVO' }
    });

    const proveedores = await Proveedor.findAll({
      where: { estado: 'ACTIVO' }
    });

    const metodos_pago = await MetodoPago.findAll({
      where: { estado: 'ACTIVO' }
    });

    res.json({
      message: 'Catálogos obtenidos correctamente',
      categorias,
      marcas,
      unidades_medida,
      proveedores,
      metodos_pago
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener catálogos',
      error: error.message
    });
  }
};