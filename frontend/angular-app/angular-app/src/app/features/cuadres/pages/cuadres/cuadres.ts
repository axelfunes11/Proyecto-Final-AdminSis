import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-cuadres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuadres.html',
  styleUrl: './cuadres.css'
})
export class CuadresComponent implements OnInit {
  cuadresDiarios: any[] = [];
  cuadresMensuales: any[] = [];
  metodosPago: any[] = [];

  loading = false;
  savingDiario = false;
  savingMensual = false;
  errorMessage = '';
  successMessage = '';

  cuadreDiarioForm: any = {
    fecha_cuadre: '',
    total_contado: '',
    observaciones: '',
    usuario_externo_id: 1,
    pagos_contados: []
  };

  cuadreMensualForm: any = {
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    usuario_externo_id: 1
  };

  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarCuadresDiarios();
    this.cargarCuadresMensuales();
  }

  cargarCatalogos(): void {
    this.inventoryService.getCatalogos().subscribe({
      next: (res) => {
        this.metodosPago = res.metodos_pago || [];
        this.inicializarPagosContados();
      },
      error: () => {
        this.errorMessage = 'Error al cargar métodos de pago';
      }
    });
  }

  inicializarPagosContados(): void {
    this.cuadreDiarioForm.pagos_contados = this.metodosPago.map((m) => ({
      id_metodo_pago: m.id_metodo_pago,
      nombre: m.nombre,
      monto_contado: 0
    }));
  }

  cargarCuadresDiarios(): void {
    this.loading = true;

    this.inventoryService.getCuadresDiarios().subscribe({
      next: (res) => {
        this.cuadresDiarios = res.cuadres || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar cuadres diarios';
        this.loading = false;
      }
    });
  }

  cargarCuadresMensuales(): void {
    this.inventoryService.getCuadresMensuales().subscribe({
      next: (res) => {
        this.cuadresMensuales = res.cuadres || [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar cuadres mensuales';
      }
    });
  }

  calcularTotalContado(): number {
    return this.cuadreDiarioForm.pagos_contados.reduce(
      (total: number, pago: any) => {
        return total + Number(pago.monto_contado || 0);
      },
      0
    );
  }

  generarDiario(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const totalContado = this.calcularTotalContado();

    const data = {
      fecha_cuadre: this.cuadreDiarioForm.fecha_cuadre || undefined,
      total_contado: totalContado,
      observaciones: this.cuadreDiarioForm.observaciones,
      usuario_externo_id: 1,
      pagos_contados: this.cuadreDiarioForm.pagos_contados.map((p: any) => ({
        id_metodo_pago: Number(p.id_metodo_pago),
        monto_contado: Number(p.monto_contado || 0)
      }))
    };

    this.savingDiario = true;

    this.inventoryService.generarCuadreDiario(data).subscribe({
      next: () => {
        this.successMessage = 'Cuadre diario generado correctamente';
        this.savingDiario = false;
        this.limpiarCuadreDiario();
        this.cargarCuadresDiarios();
        this.cargarCuadresMensuales();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error al generar cuadre diario';
        this.savingDiario = false;
      }
    });
  }

  limpiarCuadreDiario(): void {
    this.cuadreDiarioForm = {
      fecha_cuadre: '',
      total_contado: '',
      observaciones: '',
      usuario_externo_id: 1,
      pagos_contados: this.metodosPago.map((m) => ({
        id_metodo_pago: m.id_metodo_pago,
        nombre: m.nombre,
        monto_contado: 0
      }))
    };
  }

  generarMensual(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const data = {
      anio: Number(this.cuadreMensualForm.anio),
      mes: Number(this.cuadreMensualForm.mes),
      usuario_externo_id: 1
    };

    this.savingMensual = true;

    this.inventoryService.generarCuadreMensual(data).subscribe({
      next: () => {
        this.successMessage = 'Cuadre mensual generado correctamente';
        this.savingMensual = false;
        this.cargarCuadresMensuales();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error al generar cuadre mensual';
        this.savingMensual = false;
      }
    });
  }
}