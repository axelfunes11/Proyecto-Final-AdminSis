import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Proveedor extends Model {}

Proveedor.init(
  {
    id_proveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(30)
    },
    correo: {
      type: DataTypes.STRING(150)
    },
    direccion: {
      type: DataTypes.STRING(255)
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    tableName: 'proveedores',
    timestamps: false
  }
);