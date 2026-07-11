import jwt from 'jsonwebtoken';

interface JwtPayloadData {
  id_usuario: number;
  correo: string;
  roles: string[];
}

export const generarTokenAcceso = (payload: JwtPayloadData): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  } as jwt.SignOptions);
};

export const verificarToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'default_secret';

  return jwt.verify(token, secret);
};