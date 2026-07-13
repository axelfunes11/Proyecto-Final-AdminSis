import { Request, Response } from 'express';
import {
  listarStock,
  listarMovimientos,
  registrarEntrada,
  registrarAjuste
} from '../services/inventario.service';

export const getStock = async (req: Request, res: Response) => {
  try {
    const stock = await listarStock();

    res.json({
      message: 'Stock obtenido correctamente',
      stock
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener stock',
      error: error.message
    });
  }
};

export const getMovimientos = async (req: Request, res: Response) => {
  try {
    const movimientos = await listarMovimientos();

    res.json({
      message: 'Movimientos obtenidos correctamente',
      movimientos
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener movimientos',
      error: error.message
    });
  }
};

export const postEntrada = async (req: Request, res: Response) => {
  try {
    const { id_producto, cantidad } = req.body;

    if (!id_producto || !cantidad) {
      res.status(400).json({
        message: 'Producto y cantidad son obligatorios'
      });
      return;
    }

    const resultado = await registrarEntrada(req.body);

    res.status(201).json({
      message: 'Entrada de inventario registrada correctamente',
      resultado
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const postAjuste = async (req: Request, res: Response) => {
  try {
    const { id_producto, cantidad, tipo_ajuste } = req.body;

    if (!id_producto || !cantidad || !tipo_ajuste) {
      res.status(400).json({
        message: 'Producto, cantidad y tipo de ajuste son obligatorios'
      });
      return;
    }

    const resultado = await registrarAjuste(req.body);

    res.status(201).json({
      message: 'Ajuste de inventario registrado correctamente',
      resultado
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};