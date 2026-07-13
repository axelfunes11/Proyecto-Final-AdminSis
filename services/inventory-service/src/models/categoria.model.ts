import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Categoria extends Model {}

Categoria.init(
  {
    id_categoria: {
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
    tableName: 'categorias',
    timestamps: false
  }
);