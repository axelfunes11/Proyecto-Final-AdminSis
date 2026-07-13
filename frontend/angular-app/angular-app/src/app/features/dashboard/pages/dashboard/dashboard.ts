import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalProductos = 0;
  totalStock = 0;
  totalVentas = 0;
  totalCuadres = 0;

  ventasRecientes: any[] = [];
  loading = false;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.loading = true;

    this.inventoryService.getProductos().subscribe({
      next: (res) => {
        this.totalProductos = res.productos?.length || 0;
      }
    });

    this.inventoryService.getStock().subscribe({
      next: (res) => {
        const stock = res.stock || [];
        this.totalStock = stock.reduce((total: number, item: any) => {
          return total + Number(item.cantidad_actual || 0);
        }, 0);
      }
    });

    this.inventoryService.getVentas().subscribe({
      next: (res) => {
        this.totalVentas = res.ventas?.length || 0;
        this.ventasRecientes = (res.ventas || []).slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.inventoryService.getCuadresDiarios().subscribe({
      next: (res) => {
        this.totalCuadres = res.cuadres?.length || 0;
      }
    });
  }
}