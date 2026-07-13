import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class CuadreDiario extends Model {}

CuadreDiario.init(
  {
    id_cuadre_diario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_cuadre: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    usuario_externo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_ventas_sistema: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total_contado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    diferencia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    observaciones: {
      type: DataTypes.STRING(255)
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ABIERTO'
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
    tableName: 'cuadres_diarios',
    timestamps: false
  }
);