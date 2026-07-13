import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class MetodoPago extends Model {}

MetodoPago.init(
  {
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255)
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
    tableName: 'metodos_pago',
    timestamps: false
  }
);