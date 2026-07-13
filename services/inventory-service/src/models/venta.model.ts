import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Venta extends Model {}

Venta.init(
  {
    id_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_venta: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    fecha_venta: {
      type: DataTypes.DATE
    },
    id_estado_venta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_externo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    descuento_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    observaciones: {
      type: DataTypes.STRING(255)
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
    tableName: 'ventas',
    timestamps: false
  }
);