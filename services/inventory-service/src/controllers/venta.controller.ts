import { Request, Response } from 'express';
import {
  listarVentas,
  obtenerVentaPorId,
  crearVenta,
  anularVenta
} from '../services/venta.service';

export const getVentas = async (req: Request, res: Response) => {
  try {
    const ventas = await listarVentas();

    res.json({
      message: 'Ventas obtenidas correctamente',
      ventas
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener ventas',
      error: error.message
    });
  }
};

export const getVentaById = async (req: Request, res: Response) => {
  try {
    const id_venta = Number(req.params.id);
    const venta = await obtenerVentaPorId(id_venta);

    res.json({
      message: 'Venta obtenida correctamente',
      venta
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const postVenta = async (req: Request, res: Response) => {
  try {
    const venta = await crearVenta(req.body);

    res.status(201).json({
      message: 'Venta registrada correctamente',
      venta
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const postAnularVenta = async (req: Request, res: Response) => {
  try {
    const id_venta = Number(req.params.id);
    const venta = await anularVenta(id_venta, req.body);

    res.json({
      message: 'Venta anulada correctamente',
      venta
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};