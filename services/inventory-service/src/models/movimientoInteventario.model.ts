import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class MovimientoInventario extends Model {}

MovimientoInventario.init(
  {
    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_movimiento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock_anterior: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock_nuevo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    referencia_tipo: {
      type: DataTypes.STRING(50)
    },
    referencia_id: {
      type: DataTypes.INTEGER
    },
    motivo: {
      type: DataTypes.STRING(255)
    },
    usuario_externo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'movimientos_inventario',
    timestamps: false
  }
);