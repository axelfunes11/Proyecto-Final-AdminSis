import { sequelize } from '../config/db';
import {
  Inventario,
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  TipoMovimiento,
  MovimientoInventario
} from '../models';

export const listarStock = async () => {
  return await Inventario.findAll({
    include: [
      {
        model: Producto,
        as: 'producto',
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Marca, as: 'marca' },
          { model: UnidadMedida, as: 'unidad_medida' }
        ]
      }
    ],
    order: [['id_inventario', 'DESC']]
  });
};

export const listarMovimientos = async () => {
  return await MovimientoInventario.findAll({
    include: [
      { model: Producto, as: 'producto' },
      { model: TipoMovimiento, as: 'tipo_movimiento' }
    ],
    order: [['id_movimiento', 'DESC']]
  });
};

export const registrarEntrada = async (data: any) => {
  const transaction = await sequelize.transaction();

  try {
    const cantidad = Number(data.cantidad);

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    const producto = await Producto.findByPk(data.id_producto, { transaction });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const tipoMovimiento: any = await TipoMovimiento.findOne({
      where: { codigo: 'ENTRADA' },
      transaction
    });

    if (!tipoMovimiento) {
      throw new Error('Tipo de movimiento ENTRADA no encontrado');
    }

    let inventario: any = await Inventario.findOne({
      where: { id_producto: data.id_producto },
      transaction
    });

    if (!inventario) {
      inventario = await Inventario.create(
        {
          id_producto: data.id_producto,
          cantidad_actual: 0
        },
        { transaction }
      );
    }

    const stockAnterior = Number(inventario.cantidad_actual);
    const stockNuevo = stockAnterior + cantidad;

    await inventario.update(
      {
        cantidad_actual: stockNuevo
      },
      { transaction }
    );

    const movimiento = await MovimientoInventario.create(
      {
        id_producto: data.id_producto,
        id_tipo_movimiento: tipoMovimiento.id_tipo_movimiento,
        cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        referencia_tipo: data.referencia_tipo || 'ENTRADA_MANUAL',
        referencia_id: data.referencia_id || null,
        motivo: data.motivo || 'Ingreso de inventario',
        usuario_externo_id: data.usuario_externo_id || 1
      },
      { transaction }
    );

    await transaction.commit();

    return {
      inventario,
      movimiento
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const registrarAjuste = async (data: any) => {
  const transaction = await sequelize.transaction();

  try {
    const cantidad = Number(data.cantidad);

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    const codigoMovimiento =
      data.tipo_ajuste === 'NEGATIVO' ? 'AJUSTE_NEG' : 'AJUSTE_POS';

    const tipoMovimiento: any = await TipoMovimiento.findOne({
      where: { codigo: codigoMovimiento },
      transaction
    });

    if (!tipoMovimiento) {
      throw new Error(`Tipo de movimiento ${codigoMovimiento} no encontrado`);
    }

    const inventario: any = await Inventario.findOne({
      where: { id_producto: data.id_producto },
      transaction
    });

    if (!inventario) {
      throw new Error('El producto no tiene inventario registrado');
    }

    const stockAnterior = Number(inventario.cantidad_actual);
    const stockNuevo =
      codigoMovimiento === 'AJUSTE_NEG'
        ? stockAnterior - cantidad
        : stockAnterior + cantidad;

    if (stockNuevo < 0) {
      throw new Error('El stock no puede quedar negativo');
    }

    await inventario.update(
      {
        cantidad_actual: stockNuevo
      },
      { transaction }
    );

    const movimiento = await MovimientoInventario.create(
      {
        id_producto: data.id_producto,
        id_tipo_movimiento: tipoMovimiento.id_tipo_movimiento,
        cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        referencia_tipo: 'AJUSTE_MANUAL',
        referencia_id: null,
        motivo: data.motivo || 'Ajuste de inventario',
        usuario_externo_id: data.usuario_externo_id || 1
      },
      { transaction }
    );

    await transaction.commit();

    return {
      inventario,
      movimiento
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};