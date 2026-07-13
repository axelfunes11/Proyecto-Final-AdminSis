import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class EstadoVenta extends Model {}

EstadoVenta.init(
  {
    id_estado_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'estados_venta',
    timestamps: false
  }
);