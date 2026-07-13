import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class CuadreMensual extends Model {}

CuadreMensual.init(
  {
    id_cuadre_mensual: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_externo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_ventas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total_diferencias: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    cantidad_ventas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cantidad_productos_vendidos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'GENERADO'
    },
    creado_en: {
      type: DataTypes.DATE
    },
    actualizado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'cuadres_mensuales',
    timestamps: false
  }
);