import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  unidades: any[] = [];
  proveedores: any[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  editando = false;
  productoEditandoId: number | null = null;

  productoForm: any = {
    codigo_producto: '',
    nombre: '',
    descripcion: '',
    id_categoria: '',
    id_unidad_medida: '',
    id_proveedor: '',
    id_marca: '',
    precio_compra: '',
    precio_venta: '',
    fecha_vencimiento: ''
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarProductos();
  }

  cargarCatalogos(): void {
    this.inventoryService.getCatalogos().subscribe({
      next: (res) => {
        this.categorias = res.categorias || [];
        this.marcas = res.marcas || [];
        this.unidades = res.unidades_medida || [];
        this.proveedores = res.proveedores || [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar catálogos';
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;

    this.inventoryService.getProductos().subscribe({
      next: (res) => {
        this.productos = res.productos || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar productos';
        this.loading = false;
      }
    });
  }

  guardarProducto(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.productoForm.codigo_producto ||
      !this.productoForm.nombre ||
      !this.productoForm.id_categoria ||
      !this.productoForm.id_unidad_medida ||
      !this.productoForm.precio_compra ||
      !this.productoForm.precio_venta
    ) {
      this.errorMessage = 'Completa los campos obligatorios';
      return;
    }

    const data = {
      ...this.productoForm,
      id_categoria: Number(this.productoForm.id_categoria),
      id_unidad_medida: Number(this.productoForm.id_unidad_medida),
      id_proveedor: this.productoForm.id_proveedor
        ? Number(this.productoForm.id_proveedor)
        : null,
      id_marca: this.productoForm.id_marca
        ? Number(this.productoForm.id_marca)
        : null,
      precio_compra: Number(this.productoForm.precio_compra),
      precio_venta: Number(this.productoForm.precio_venta),
      fecha_vencimiento: this.productoForm.fecha_vencimiento || null
    };

    this.saving = true;

    if (this.editando && this.productoEditandoId) {
      this.inventoryService.actualizarProducto(this.productoEditandoId, data).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente';
          this.saving = false;
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al actualizar producto';
          this.saving = false;
        }
      });
    } else {
      this.inventoryService.crearProducto(data).subscribe({
        next: () => {
          this.successMessage = 'Producto creado correctamente';
          this.saving = false;
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al crear producto';
          this.saving = false;
        }
      });
    }
  }

  editarProducto(producto: any): void {
    this.editando = true;
    this.productoEditandoId = producto.id_producto;

    this.productoForm = {
      codigo_producto: producto.codigo_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      id_categoria: producto.id_categoria,
      id_unidad_medida: producto.id_unidad_medida,
      id_proveedor: producto.id_proveedor,
      id_marca: producto.id_marca,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      fecha_vencimiento: producto.fecha_vencimiento
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  desactivarProducto(id: number): void {
    const confirmar = confirm('¿Deseas desactivar este producto?');

    if (!confirmar) return;

    this.inventoryService.desactivarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto desactivado correctamente';
        this.cargarProductos();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al desactivar producto';
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.productoEditandoId = null;

    this.productoForm = {
      codigo_producto: '',
      nombre: '',
      descripcion: '',
      id_categoria: '',
      id_unidad_medida: '',
      id_proveedor: '',
      id_marca: '',
      precio_compra: '',
      precio_venta: '',
      fecha_vencimiento: ''
    };
  }
}