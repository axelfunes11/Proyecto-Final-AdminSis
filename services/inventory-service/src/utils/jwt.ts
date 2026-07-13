import jwt from 'jsonwebtoken';

export const verificarToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.verify(token, secret);
};