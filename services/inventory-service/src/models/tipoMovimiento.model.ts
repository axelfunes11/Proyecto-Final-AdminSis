import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class TipoMovimiento extends Model {}

TipoMovimiento.init(
  {
    id_tipo_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255)
    },
    afecta_stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVO'
    },
    creado_en: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'tipos_movimiento',
    timestamps: false
  }
);