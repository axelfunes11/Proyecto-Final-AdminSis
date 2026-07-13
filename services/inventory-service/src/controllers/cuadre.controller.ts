import { Request, Response } from 'express';
import {
  listarCuadresDiarios,
  generarCuadreDiario,
  listarCuadresMensuales,
  generarCuadreMensual
} from '../services/cuadre.service';

export const getCuadresDiarios = async (req: Request, res: Response) => {
  try {
    const cuadres = await listarCuadresDiarios();

    res.json({
      message: 'Cuadres diarios obtenidos correctamente',
      cuadres
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener cuadres diarios',
      error: error.message
    });
  }
};

export const postCuadreDiario = async (req: Request, res: Response) => {
  try {
    const cuadre = await generarCuadreDiario(req.body);

    res.status(201).json({
      message: 'Cuadre diario generado correctamente',
      cuadre
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getCuadresMensuales = async (req: Request, res: Response) => {
  try {
    const cuadres = await listarCuadresMensuales();

    res.json({
      message: 'Cuadres mensuales obtenidos correctamente',
      cuadres
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error al obtener cuadres mensuales',
      error: error.message
    });
  }
};

export const postCuadreMensual = async (req: Request, res: Response) => {
  try {
    const cuadre = await generarCuadreMensual(req.body);

    res.status(201).json({
      message: 'Cuadre mensual generado correctamente',
      cuadre
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};