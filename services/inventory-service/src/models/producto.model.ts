import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Producto extends Model {}

Producto.init(
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_producto: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: 'codigo_sku'
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_unidad_medida: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_marca: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    precio_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'precio_costo'
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock_minimo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVO'
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
    tableName: 'productos',
    timestamps: false
  }
);