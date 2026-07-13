import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {
  productos: any[] = [];
  ventas: any[] = [];
  metodosPago: any[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  observaciones = '';
  metodoPagoId = '';
  referenciaPago = '';

  detalles: any[] = [
    {
      id_producto: '',
      busqueda_producto: '',
      mostrar_sugerencias: false,
      cantidad: 1,
      precio_unitario: 0,
      descuento_linea: 0
    }
  ];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarCatalogos(): void {
    this.inventoryService.getCatalogos().subscribe({
      next: (res) => {
        this.metodosPago = res.metodos_pago || [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar métodos de pago';
      }
    });
  }

  cargarProductos(): void {
    this.inventoryService.getProductos().subscribe({
      next: (res) => {
        this.productos = res.productos || [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar productos';
      }
    });
  }

  cargarVentas(): void {
    this.loading = true;

    this.inventoryService.getVentas().subscribe({
      next: (res) => {
        this.ventas = res.ventas || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar ventas';
        this.loading = false;
      }
    });
  }

  filtrarProductosPorDetalle(index: number): any[] {
    const termino = (this.detalles[index].busqueda_producto || '')
      .toLowerCase()
      .trim();

    if (!termino) {
      return this.productos.slice(0, 8);
    }

    return this.productos
      .filter((p) =>
        p.nombre?.toLowerCase().includes(termino) ||
        p.codigo_producto?.toLowerCase().includes(termino) ||
        p.categoria?.nombre?.toLowerCase().includes(termino) ||
        p.marca?.nombre?.toLowerCase().includes(termino)
      )
      .slice(0, 8);
  }

  seleccionarProductoEnDetalle(index: number, producto: any): void {
    this.detalles[index].id_producto = producto.id_producto;
    this.detalles[index].busqueda_producto = `${producto.nombre} - Q${producto.precio_venta}`;
    this.detalles[index].precio_unitario = Number(producto.precio_venta);
    this.detalles[index].mostrar_sugerencias = false;
  }

  agregarDetalle(): void {
    this.detalles.push({
      id_producto: '',
      busqueda_producto: '',
      mostrar_sugerencias: false,
      cantidad: 1,
      precio_unitario: 0,
      descuento_linea: 0
    });
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length === 1) return;

    this.detalles.splice(index, 1);
  }

  calcularSubtotal(): number {
    return this.detalles.reduce((total, item) => {
      const cantidad = Number(item.cantidad || 0);
      const precio = Number(item.precio_unitario || 0);

      return total + cantidad * precio;
    }, 0);
  }

  calcularDescuento(): number {
    return this.detalles.reduce((total, item) => {
      return total + Number(item.descuento_linea || 0);
    }, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotal() - this.calcularDescuento();
  }

  registrarVenta(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.metodoPagoId) {
      this.errorMessage = 'Selecciona un método de pago';
      return;
    }

    const detallesValidos = this.detalles.every(
      (d) =>
        d.id_producto &&
        Number(d.cantidad) > 0 &&
        Number(d.precio_unitario) > 0
    );

    if (!detallesValidos) {
      this.errorMessage = 'Completa correctamente los productos de la venta';
      return;
    }

    const total = this.calcularTotal();

    if (total <= 0) {
      this.errorMessage = 'El total de la venta debe ser mayor a 0';
      return;
    }

    const data = {
      usuario_externo_id: 1,
      observaciones: this.observaciones,
      detalles: this.detalles.map((d) => ({
        id_producto: Number(d.id_producto),
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        descuento_linea: Number(d.descuento_linea || 0)
      })),
      pago: {
        id_metodo_pago: Number(this.metodoPagoId),
        monto: total,
        referencia: this.referenciaPago || null
      }
    };

    this.saving = true;

    this.inventoryService.crearVenta(data).subscribe({
      next: () => {
        this.successMessage = 'Venta registrada correctamente';
        this.saving = false;
        this.limpiarFormulario();
        this.cargarVentas();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar venta';
        this.saving = false;
      }
    });
  }

  anularVenta(id: number): void {
    const confirmar = confirm(
      '¿Deseas anular esta venta? El stock será restaurado.'
    );

    if (!confirmar) return;

    this.inventoryService
      .anularVenta(id, {
        motivo: 'Anulación desde frontend',
        usuario_externo_id: 1
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Venta anulada correctamente';
          this.cargarVentas();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al anular venta';
        }
      });
  }

  limpiarFormulario(): void {
    this.observaciones = '';
    this.metodoPagoId = '';
    this.referenciaPago = '';

    this.detalles = [
      {
        id_producto: '',
        busqueda_producto: '',
        mostrar_sugerencias: false,
        cantidad: 1,
        precio_unitario: 0,
        descuento_linea: 0
      }
    ];
  }
}