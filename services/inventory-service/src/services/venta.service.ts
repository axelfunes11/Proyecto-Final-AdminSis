import { sequelize } from '../config/db';
import {
  Venta,
  DetalleVenta,
  EstadoVenta,
  MetodoPago,
  PagoVenta,
  Producto,
  Inventario,
  TipoMovimiento,
  MovimientoInventario
} from '../models';

const generarNumeroVenta = () => {
  const fecha = new Date();
  const timestamp = fecha.getTime();
  return `VENTA-${timestamp}`;
};

export const listarVentas = async () => {
  return await Venta.findAll({
    include: [
      { model: EstadoVenta, as: 'estado_venta' },
      {
        model: DetalleVenta,
        as: 'detalles',
        include: [{ model: Producto, as: 'producto' }]
      },
      {
        model: PagoVenta,
        as: 'pagos',
        include: [{ model: MetodoPago, as: 'metodo_pago' }]
      }
    ],
    order: [['id_venta', 'DESC']]
  });
};

export const obtenerVentaPorId = async (id_venta: number) => {
  const venta = await Venta.findByPk(id_venta, {
    include: [
      { model: EstadoVenta, as: 'estado_venta' },
      {
        model: DetalleVenta,
        as: 'detalles',
        include: [{ model: Producto, as: 'producto' }]
      },
      {
        model: PagoVenta,
        as: 'pagos',
        include: [{ model: MetodoPago, as: 'metodo_pago' }]
      }
    ]
  });

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  return venta;
};

export const crearVenta = async (data: any) => {
  const transaction = await sequelize.transaction();

  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error('La venta debe tener al menos un producto');
    }

    const estadoCompletada: any = await EstadoVenta.findOne({
      where: { nombre: 'COMPLETADA' },
      transaction
    });

    if (!estadoCompletada) {
      throw new Error('Estado de venta COMPLETADA no encontrado');
    }

    const tipoVenta: any = await TipoMovimiento.findOne({
      where: { codigo: 'VENTA' },
      transaction
    });

    if (!tipoVenta) {
      throw new Error('Tipo de movimiento VENTA no encontrado');
    }

    let subtotal = 0;
    let descuentoTotal = 0;

    for (const item of data.detalles) {
      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(item.precio_unitario);
      const descuentoLinea = Number(item.descuento_linea || 0);

      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      const producto = await Producto.findByPk(item.id_producto, { transaction });

      if (!producto) {
        throw new Error(`Producto ${item.id_producto} no encontrado`);
      }

      const inventario: any = await Inventario.findOne({
        where: { id_producto: item.id_producto },
        transaction
      });

      if (!inventario) {
        throw new Error(`El producto ${item.id_producto} no tiene inventario registrado`);
      }

      const stockActual = Number(inventario.cantidad_actual);

      if (stockActual < cantidad) {
        throw new Error(`Stock insuficiente para el producto ${item.id_producto}`);
      }

      subtotal += cantidad * precioUnitario;
      descuentoTotal += descuentoLinea;
    }

    const total = subtotal - descuentoTotal;

    if (total < 0) {
      throw new Error('El total de la venta no puede ser negativo');
    }

    const venta: any = await Venta.create(
      {
        numero_venta: generarNumeroVenta(),
        id_estado_venta: estadoCompletada.id_estado_venta,
        usuario_externo_id: data.usuario_externo_id || 1,
        subtotal,
        descuento_total: descuentoTotal,
        total,
        observaciones: data.observaciones || null
      },
      { transaction }
    );

    for (const item of data.detalles) {
      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(item.precio_unitario);
      const descuentoLinea = Number(item.descuento_linea || 0);
      const subtotalLinea = cantidad * precioUnitario - descuentoLinea;

      await DetalleVenta.create(
        {
          id_venta: venta.id_venta,
          id_producto: item.id_producto,
          cantidad,
          precio_unitario: precioUnitario,
          descuento_linea: descuentoLinea,
          subtotal_linea: subtotalLinea
        },
        { transaction }
      );

      const inventario: any = await Inventario.findOne({
        where: { id_producto: item.id_producto },
        transaction
      });

      const stockAnterior = Number(inventario.cantidad_actual);
      const stockNuevo = stockAnterior - cantidad;

      await inventario.update(
        {
          cantidad_actual: stockNuevo
        },
        { transaction }
      );

      await MovimientoInventario.create(
        {
          id_producto: item.id_producto,
          id_tipo_movimiento: tipoVenta.id_tipo_movimiento,
          cantidad,
          stock_anterior: stockAnterior,
          stock_nuevo: stockNuevo,
          referencia_tipo: 'VENTA',
          referencia_id: venta.id_venta,
          motivo: `Venta ${venta.numero_venta}`,
          usuario_externo_id: data.usuario_externo_id || 1
        },
        { transaction }
      );
    }

    if (data.pago) {
      await PagoVenta.create(
        {
          id_venta: venta.id_venta,
          id_metodo_pago: data.pago.id_metodo_pago,
          monto: data.pago.monto || total,
          referencia: data.pago.referencia || null
        },
        { transaction }
      );
    }

    await transaction.commit();

    return await obtenerVentaPorId(venta.id_venta);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const anularVenta = async (id_venta: number, data: any) => {
  const transaction = await sequelize.transaction();

  try {
    const venta: any = await Venta.findByPk(id_venta, {
      include: [{ model: DetalleVenta, as: 'detalles' }],
      transaction
    });

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    const estadoActual: any = await EstadoVenta.findByPk(venta.id_estado_venta, {
      transaction
    });

    if (estadoActual?.nombre === 'ANULADA') {
      throw new Error('La venta ya está anulada');
    }

    const estadoAnulada: any = await EstadoVenta.findOne({
      where: { nombre: 'ANULADA' },
      transaction
    });

    if (!estadoAnulada) {
      throw new Error('Estado de venta ANULADA no encontrado');
    }

    const tipoAnulacion: any = await TipoMovimiento.findOne({
      where: { codigo: 'ANULACION' },
      transaction
    });

    if (!tipoAnulacion) {
      throw new Error('Tipo de movimiento ANULACION no encontrado');
    }

    for (const detalle of venta.detalles) {
      const cantidad = Number((detalle as any).cantidad);

      const inventario: any = await Inventario.findOne({
        where: { id_producto: (detalle as any).id_producto },
        transaction
      });

      if (!inventario) {
        throw new Error('Inventario no encontrado para reversar venta');
      }

      const stockAnterior = Number(inventario.cantidad_actual);
      const stockNuevo = stockAnterior + cantidad;

      await inventario.update(
        {
          cantidad_actual: stockNuevo
        },
        { transaction }
      );

      await MovimientoInventario.create(
        {
          id_producto: (detalle as any).id_producto,
          id_tipo_movimiento: tipoAnulacion.id_tipo_movimiento,
          cantidad,
          stock_anterior: stockAnterior,
          stock_nuevo: stockNuevo,
          referencia_tipo: 'ANULACION_VENTA',
          referencia_id: venta.id_venta,
          motivo: data.motivo || `Anulación de venta ${venta.numero_venta}`,
          usuario_externo_id: data.usuario_externo_id || 1
        },
        { transaction }
      );
    }

    await venta.update(
      {
        id_estado_venta: estadoAnulada.id_estado_venta,
        observaciones: data.motivo || venta.observaciones
      },
      { transaction }
    );

    await transaction.commit();

    return await obtenerVentaPorId(id_venta);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};