import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Marca extends Model {}

Marca.init(
  {
    id_marca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    tableName: 'marcas',
    timestamps: false
  }
);