import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class UsuarioRol extends Model {}

UsuarioRol.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'usuarios_roles',
    timestamps: false
  }
);