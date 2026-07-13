import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class PagoVenta extends Model {}

PagoVenta.init(
  {
    id_pago_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    referencia: {
      type: DataTypes.STRING(150)
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'pagos_venta',
    timestamps: false
  }
);