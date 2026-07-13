import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { UnidadMedida } from './unidadMedida.model';
import { Proveedor } from './proveedor.model';
import { Producto } from './producto.model';

Categoria.hasMany(Producto, {
  foreignKey: 'id_categoria',
  as: 'productos'
});

Producto.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

Marca.hasMany(Producto, {
  foreignKey: 'id_marca',
  as: 'productos'
});

Producto.belongsTo(Marca, {
  foreignKey: 'id_marca',
  as: 'marca'
});

UnidadMedida.hasMany(Producto, {
  foreignKey: 'id_unidad_medida',
  as: 'productos'
});

Producto.belongsTo(UnidadMedida, {
  foreignKey: 'id_unidad_medida',
  as: 'unidad_medida'
});

Proveedor.hasMany(Producto, {
  foreignKey: 'id_proveedor',
  as: 'productos'
});

Producto.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor',
  as: 'proveedor'
});

export {
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
  Producto
};