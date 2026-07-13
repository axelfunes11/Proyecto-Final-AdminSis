import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.css'
})
export class StockComponent implements OnInit {
  stock: any[] = [];
  movimientos: any[] = [];
  productos: any[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  entradaForm = {
    id_producto: '',
    cantidad: '',
    motivo: 'Ingreso de inventario',
    usuario_externo_id: 1
  };

  ajusteForm = {
    id_producto: '',
    cantidad: '',
    tipo_ajuste: 'POSITIVO',
    motivo: '',
    usuario_externo_id: 1
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarStock();
    this.cargarMovimientos();
  }

  cargarProductos(): void {
    this.inventoryService.getProductos().subscribe({
      next: (res) => {
        this.productos = res.productos || [];
      }
    });
  }

  cargarStock(): void {
    this.loading = true;

    this.inventoryService.getStock().subscribe({
      next: (res) => {
        this.stock = res.stock || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar stock';
        this.loading = false;
      }
    });
  }

  cargarMovimientos(): void {
    this.inventoryService.getMovimientosStock().subscribe({
      next: (res) => {
        this.movimientos = res.movimientos || [];
      }
    });
  }

  registrarEntrada(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.entradaForm.id_producto || !this.entradaForm.cantidad) {
      this.errorMessage = 'Producto y cantidad son obligatorios';
      return;
    }

    const data = {
      ...this.entradaForm,
      id_producto: Number(this.entradaForm.id_producto),
      cantidad: Number(this.entradaForm.cantidad)
    };

    this.saving = true;

    this.inventoryService.registrarEntradaStock(data).subscribe({
      next: () => {
        this.successMessage = 'Entrada registrada correctamente';
        this.saving = false;
        this.entradaForm = {
          id_producto: '',
          cantidad: '',
          motivo: 'Ingreso de inventario',
          usuario_externo_id: 1
        };
        this.cargarStock();
        this.cargarMovimientos();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar entrada';
        this.saving = false;
      }
    });
  }

  registrarAjuste(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.ajusteForm.id_producto || !this.ajusteForm.cantidad || !this.ajusteForm.tipo_ajuste) {
      this.errorMessage = 'Producto, cantidad y tipo de ajuste son obligatorios';
      return;
    }

    const data = {
      ...this.ajusteForm,
      id_producto: Number(this.ajusteForm.id_producto),
      cantidad: Number(this.ajusteForm.cantidad)
    };

    this.saving = true;

    this.inventoryService.registrarAjusteStock(data).subscribe({
      next: () => {
        this.successMessage = 'Ajuste registrado correctamente';
        this.saving = false;
        this.ajusteForm = {
          id_producto: '',
          cantidad: '',
          tipo_ajuste: 'POSITIVO',
          motivo: '',
          usuario_externo_id: 1
        };
        this.cargarStock();
        this.cargarMovimientos();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar ajuste';
        this.saving = false;
      }
    });
  }
}