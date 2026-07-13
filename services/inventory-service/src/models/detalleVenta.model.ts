import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class DetalleVenta extends Model {}

DetalleVenta.init(
  {
    id_detalle_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descuento_linea: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    subtotal_linea: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'detalle_ventas',
    timestamps: false
  }
);