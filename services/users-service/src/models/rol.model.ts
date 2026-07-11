import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Rol extends Model {}

Rol.init(
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false
  }
);