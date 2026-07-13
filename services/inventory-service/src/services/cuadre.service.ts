import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';
import {
  CuadreDiario,
  CuadreDiarioPago,
  CuadreMensual,
  CuadreMensualDiario,
  MetodoPago
} from '../models';

const obtenerFechaActual = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
};

export const listarCuadresDiarios = async () => {
  return await CuadreDiario.findAll({
    include: [
      {
        model: CuadreDiarioPago,
        as: 'pagos',
        include: [{ model: MetodoPago, as: 'metodo_pago' }]
      }
    ],
    order: [['fecha_cuadre', 'DESC']]
  });
};

export const generarCuadreDiario = async (data: any) => {
  const transaction = await sequelize.transaction();

  try {
    const fechaCuadre = data.fecha_cuadre || obtenerFechaActual();

    const resumenVentas: any[] = await sequelize.query(
      `SELECT 
        COALESCE(SUM(v.total), 0) AS total_ventas_sistema
       FROM ventas v
       INNER JOIN estados_venta ev ON v.id_estado_venta = ev.id_estado_venta
       WHERE DATE(v.fecha_venta) = :fecha_cuadre
       AND ev.nombre = 'COMPLETADA'`,
      {
        replacements: { fecha_cuadre: fechaCuadre },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    const totalVentasSistema = Number(resumenVentas[0].total_ventas_sistema || 0);
    const totalContado =
      data.total_contado !== undefined
        ? Number(data.total_contado)
        : totalVentasSistema;

    const diferencia = totalContado - totalVentasSistema;

    let cuadre: any = await CuadreDiario.findOne({
      where: { fecha_cuadre: fechaCuadre },
      transaction
    });

    if (cuadre) {
      await CuadreDiarioPago.destroy({
        where: { id_cuadre_diario: cuadre.id_cuadre_diario },
        transaction
      });

      await cuadre.update(
        {
          usuario_externo_id: data.usuario_externo_id || 1,
          total_ventas_sistema: totalVentasSistema,
          total_contado: totalContado,
          diferencia,
          observaciones: data.observaciones || null,
          estado: 'CERRADO'
        },
        { transaction }
      );
    } else {
      cuadre = await CuadreDiario.create(
        {
          fecha_cuadre: fechaCuadre,
          usuario_externo_id: data.usuario_externo_id || 1,
          total_ventas_sistema: totalVentasSistema,
          total_contado: totalContado,
          diferencia,
          observaciones: data.observaciones || null,
          estado: 'CERRADO'
        },
        { transaction }
      );
    }

    const pagosSistema: any[] = await sequelize.query(
      `SELECT 
        mp.id_metodo_pago,
        mp.nombre,
        COALESCE(SUM(
          CASE 
            WHEN DATE(v.fecha_venta) = :fecha_cuadre 
             AND ev.nombre = 'COMPLETADA'
            THEN pv.monto
            ELSE 0
          END
        ), 0) AS monto_sistema
       FROM metodos_pago mp
       LEFT JOIN pagos_venta pv ON mp.id_metodo_pago = pv.id_metodo_pago
       LEFT JOIN ventas v ON pv.id_venta = v.id_venta
       LEFT JOIN estados_venta ev ON v.id_estado_venta = ev.id_estado_venta
       WHERE mp.estado = 'ACTIVO'
       GROUP BY mp.id_metodo_pago, mp.nombre`,
      {
        replacements: { fecha_cuadre: fechaCuadre },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    const pagosContados = data.pagos_contados || [];

    for (const pago of pagosSistema) {
      const pagoContado = pagosContados.find(
        (p: any) => Number(p.id_metodo_pago) === Number(pago.id_metodo_pago)
      );

      const montoSistema = Number(pago.monto_sistema || 0);
      const montoContado = pagoContado
        ? Number(pagoContado.monto_contado)
        : montoSistema;

      await CuadreDiarioPago.create(
        {
          id_cuadre_diario: cuadre.id_cuadre_diario,
          id_metodo_pago: pago.id_metodo_pago,
          monto_sistema: montoSistema,
          monto_contado: montoContado,
          diferencia: montoContado - montoSistema
        },
        { transaction }
      );
    }

    await transaction.commit();

    return await CuadreDiario.findByPk(cuadre.id_cuadre_diario, {
      include: [
        {
          model: CuadreDiarioPago,
          as: 'pagos',
          include: [{ model: MetodoPago, as: 'metodo_pago' }]
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const listarCuadresMensuales = async () => {
  return await CuadreMensual.findAll({
    include: [
      {
        model: CuadreMensualDiario,
        as: 'dias',
        include: [{ model: CuadreDiario, as: 'cuadre_diario' }]
      }
    ],
    order: [
      ['anio', 'DESC'],
      ['mes', 'DESC']
    ]
  });
};

export const generarCuadreMensual = async (data: any) => {
  const transaction = await sequelize.transaction();

  try {
    const fecha = new Date();
    const anio = Number(data.anio || fecha.getFullYear());
    const mes = Number(data.mes || fecha.getMonth() + 1);

    const inicioMes = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const finMesDate = new Date(anio, mes, 0);
    const finMes = `${anio}-${String(mes).padStart(2, '0')}-${String(
      finMesDate.getDate()
    ).padStart(2, '0')}`;

    const resumenCuadres: any[] = await sequelize.query(
      `SELECT
        COALESCE(SUM(total_ventas_sistema), 0) AS total_ventas,
        COALESCE(SUM(diferencia), 0) AS total_diferencias
       FROM cuadres_diarios
       WHERE fecha_cuadre BETWEEN :inicio AND :fin`,
      {
        replacements: { inicio: inicioMes, fin: finMes },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    const resumenVentas: any[] = await sequelize.query(
      `SELECT
        COUNT(DISTINCT v.id_venta) AS cantidad_ventas,
        COALESCE(SUM(dv.cantidad), 0) AS cantidad_productos_vendidos
       FROM ventas v
       INNER JOIN estados_venta ev ON v.id_estado_venta = ev.id_estado_venta
       LEFT JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
       WHERE YEAR(v.fecha_venta) = :anio
       AND MONTH(v.fecha_venta) = :mes
       AND ev.nombre = 'COMPLETADA'`,
      {
        replacements: { anio, mes },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    const cuadresDiarios: any[] = await CuadreDiario.findAll({
      where: {
        fecha_cuadre: {
          [Op.between]: [inicioMes, finMes]
        }
      },
      transaction
    });

    let cuadreMensual: any = await CuadreMensual.findOne({
      where: { anio, mes },
      transaction
    });

    if (cuadreMensual) {
      await CuadreMensualDiario.destroy({
        where: { id_cuadre_mensual: cuadreMensual.id_cuadre_mensual },
        transaction
      });

      await cuadreMensual.update(
        {
          usuario_externo_id: data.usuario_externo_id || 1,
          total_ventas: Number(resumenCuadres[0].total_ventas || 0),
          total_diferencias: Number(resumenCuadres[0].total_diferencias || 0),
          cantidad_ventas: Number(resumenVentas[0].cantidad_ventas || 0),
          cantidad_productos_vendidos: Number(
            resumenVentas[0].cantidad_productos_vendidos || 0
          ),
          estado: 'GENERADO'
        },
        { transaction }
      );
    } else {
      cuadreMensual = await CuadreMensual.create(
        {
          anio,
          mes,
          usuario_externo_id: data.usuario_externo_id || 1,
          total_ventas: Number(resumenCuadres[0].total_ventas || 0),
          total_diferencias: Number(resumenCuadres[0].total_diferencias || 0),
          cantidad_ventas: Number(resumenVentas[0].cantidad_ventas || 0),
          cantidad_productos_vendidos: Number(
            resumenVentas[0].cantidad_productos_vendidos || 0
          ),
          estado: 'GENERADO'
        },
        { transaction }
      );
    }

    for (const diario of cuadresDiarios) {
      await CuadreMensualDiario.create(
        {
          id_cuadre_mensual: cuadreMensual.id_cuadre_mensual,
          id_cuadre_diario: diario.id_cuadre_diario
        },
        { transaction }
      );
    }

    await transaction.commit();

    return await CuadreMensual.findByPk(cuadreMensual.id_cuadre_mensual, {
      include: [
        {
          model: CuadreMensualDiario,
          as: 'dias',
          include: [{ model: CuadreDiario, as: 'cuadre_diario' }]
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};