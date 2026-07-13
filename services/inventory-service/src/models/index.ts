import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { UnidadMedida } from './unidadMedida.model';
import { Proveedor } from './proveedor.model';
import { Producto } from './producto.model';
import { Inventario } from './inventario';
import { TipoMovimiento } from './tipoMovimiento.model';
import { MovimientoInventario } from './movimientoInteventario.model';

Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

Marca.hasMany(Producto, { foreignKey: 'id_marca', as: 'productos' });
Producto.belongsTo(Marca, { foreignKey: 'id_marca', as: 'marca' });

UnidadMedida.hasMany(Producto, { foreignKey: 'id_unidad_medida', as: 'productos' });
Producto.belongsTo(UnidadMedida, { foreignKey: 'id_unidad_medida', as: 'unidad_medida' });

Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

Producto.hasOne(Inventario, { foreignKey: 'id_producto', as: 'stock' });
Inventario.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Producto.hasMany(MovimientoInventario, { foreignKey: 'id_producto', as: 'movimientos' });
MovimientoInventario.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

TipoMovimiento.hasMany(MovimientoInventario, { foreignKey: 'id_tipo_movimiento', as: 'movimientos' });
MovimientoInventario.belongsTo(TipoMovimiento, { foreignKey: 'id_tipo_movimiento', as: 'tipo_movimiento' });

export {
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
  Producto,
  Inventario,
  TipoMovimiento,
  MovimientoInventario
};