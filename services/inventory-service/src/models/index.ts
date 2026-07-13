import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { UnidadMedida } from './unidadMedida.model';
import { Proveedor } from './proveedor.model';
import { Producto } from './producto.model';
import { Inventario } from './inventario';
import { TipoMovimiento } from './tipoMovimiento.model';
import { MovimientoInventario } from './movimientoInteventario.model';
import { EstadoVenta } from './estadoVenta.model';
import { Venta } from './venta.model';
import { DetalleVenta } from './detalleVenta.model';
import { MetodoPago } from './metodoPago.model';
import { PagoVenta } from './pagoVenta.model';

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

EstadoVenta.hasMany(Venta, { foreignKey: 'id_estado_venta', as: 'ventas' });
Venta.belongsTo(EstadoVenta, { foreignKey: 'id_estado_venta', as: 'estado_venta' });

Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detalle_ventas' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Venta.hasMany(PagoVenta, { foreignKey: 'id_venta', as: 'pagos' });
PagoVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

MetodoPago.hasMany(PagoVenta, { foreignKey: 'id_metodo_pago', as: 'pagos' });
PagoVenta.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago', as: 'metodo_pago' });

export {
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
  Producto,
  Inventario,
  TipoMovimiento,
  MovimientoInventario,
  EstadoVenta,
  Venta,
  DetalleVenta,
  MetodoPago,
  PagoVenta
};