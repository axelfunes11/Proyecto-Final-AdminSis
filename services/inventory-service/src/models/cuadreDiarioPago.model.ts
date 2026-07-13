import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class CuadreDiarioPago extends Model {}

CuadreDiarioPago.init(
  {
    id_cuadre_diario_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cuadre_diario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto_sistema: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    monto_contado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    diferencia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'cuadre_diario_pagos',
    timestamps: false
  }
);