import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class CuadreMensualDiario extends Model {}

CuadreMensualDiario.init(
  {
    id_cuadre_mensual_diario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cuadre_mensual: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_cuadre_diario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'cuadre_mensual_diarios',
    timestamps: false
  }
);