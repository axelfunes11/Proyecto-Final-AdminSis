import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class UnidadMedida extends Model {}

UnidadMedida.init(
  {
    id_unidad_medida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    abreviatura: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVO'
    }
  },
  {
    sequelize,
    tableName: 'unidades_medida',
    timestamps: false
  }
);