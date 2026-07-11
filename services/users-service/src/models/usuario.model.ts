import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Usuario extends Model {}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVO'
    },
    ultimo_login: {
      type: DataTypes.DATE
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
    tableName: 'usuarios',
    timestamps: false
  }
);