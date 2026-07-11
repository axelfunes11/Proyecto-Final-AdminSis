import { Request, Response } from 'express';
import { registrarUsuario, loginUsuario } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre_completo, correo, password } = req.body;

    if (!nombre_completo || !correo || !password) {
      return res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios'
      });
    }

    const usuario = await registrarUsuario({
      nombre_completo,
      correo,
      password
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      });
    }

    const resultado = await loginUsuario({ correo, password });

    return res.json({
      message: 'Login correcto',
      ...resultado
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  return res.json({
    message: 'Perfil del usuario autenticado',
    usuario: (req as any).usuario
  });
};