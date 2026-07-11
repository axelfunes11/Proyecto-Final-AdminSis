import bcrypt from 'bcryptjs';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Usuario, Rol, UsuarioRol } from '../models';
import { generarTokenAcceso } from '../utils/jwt';

interface RegisterData {
  nombre_completo: string;
  correo: string;
  password: string;
}

interface LoginData {
  correo: string;
  password: string;
}

export const registrarUsuario = async (data: RegisterData) => {
  const { nombre_completo, correo, password } = data;

  const usuarioExiste = await Usuario.findOne({ where: { correo } });

  if (usuarioExiste) {
    throw new Error('El correo ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario: any = await Usuario.create({
    nombre_completo,
    correo,
    password_hash: passwordHash,
    estado: 'ACTIVO'
  });

  const rolVendedor: any = await Rol.findOne({
    where: { nombre: 'VENDEDOR' }
  });

  if (rolVendedor) {
    await UsuarioRol.create({
      id_usuario: nuevoUsuario.id_usuario,
      id_rol: rolVendedor.id_rol
    });
  }

  return {
    id_usuario: nuevoUsuario.id_usuario,
    nombre_completo: nuevoUsuario.nombre_completo,
    correo: nuevoUsuario.correo,
    estado: nuevoUsuario.estado
  };
};

export const loginUsuario = async (data: LoginData) => {
  const { correo, password } = data;

  const usuario: any = await Usuario.findOne({ where: { correo } });

  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  if (usuario.estado !== 'ACTIVO') {
    throw new Error('El usuario no está activo');
  }

  const passwordValido = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValido) {
    throw new Error('Credenciales inválidas');
  }

  const roles: any[] = await sequelize.query(
    `SELECT r.nombre
     FROM roles r
     INNER JOIN usuarios_roles ur ON r.id_rol = ur.id_rol
     WHERE ur.id_usuario = :id_usuario`,
    {
      replacements: { id_usuario: usuario.id_usuario },
      type: QueryTypes.SELECT
    }
  );

  const rolesUsuario = roles.map((rol) => rol.nombre);

  const token = generarTokenAcceso({
    id_usuario: usuario.id_usuario,
    correo: usuario.correo,
    roles: rolesUsuario
  });

  await usuario.update({
    ultimo_login: new Date()
  });

  return {
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      estado: usuario.estado,
      roles: rolesUsuario
    },
    token
  };
};