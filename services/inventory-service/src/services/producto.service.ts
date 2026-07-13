import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor
} from '../models';

export const listarProductos = async () => {
  return await Producto.findAll({
    where: {
      estado: 'ACTIVO'
    },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Marca, as: 'marca' },
      { model: UnidadMedida, as: 'unidad_medida' },
      { model: Proveedor, as: 'proveedor' }
    ],
    order: [['id_producto', 'DESC']]
  });
};

export const obtenerProductoPorId = async (id_producto: number) => {
  const producto = await Producto.findByPk(id_producto, {
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Marca, as: 'marca' },
      { model: UnidadMedida, as: 'unidad_medida' },
      { model: Proveedor, as: 'proveedor' }
    ]
  });

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  return producto;
};

export const crearProducto = async (data: any) => {
  const productoExiste = await Producto.findOne({
    where: {
      codigo_producto: data.codigo_producto
    }
  });

  if (productoExiste) {
    throw new Error('Ya existe un producto con ese código');
  }

  return await Producto.create({
    codigo_producto: data.codigo_producto,
    nombre: data.nombre,
    descripcion: data.descripcion,
    id_categoria: data.id_categoria,
    id_unidad_medida: data.id_unidad_medida,
    id_proveedor: data.id_proveedor,
    id_marca: data.id_marca,
    precio_compra: data.precio_compra,
    precio_venta: data.precio_venta,
    fecha_vencimiento: data.fecha_vencimiento || null,
    estado: 'ACTIVO'
  });
};

export const actualizarProducto = async (
  id_producto: number,
  data: any
) => {
  const producto: any = await Producto.findByPk(id_producto);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  await producto.update(data);

  return producto;
};

export const desactivarProducto = async (id_producto: number) => {
  const producto: any = await Producto.findByPk(id_producto);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  await producto.update({
    estado: 'INACTIVO'
  });

  return producto;
};