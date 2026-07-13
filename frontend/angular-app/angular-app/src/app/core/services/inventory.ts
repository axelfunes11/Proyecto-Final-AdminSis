import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = environment.inventoryApiUrl;

  constructor(private http: HttpClient) { }

  getCatalogos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogos`);
  }

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  crearProducto(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, data);
  }

  actualizarProducto(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, data);
  }

  desactivarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
  getStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock`);
  }

  getMovimientosStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock/movimientos`);
  }

  registrarEntradaStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock/entrada`, data);
  }

  registrarAjusteStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock/ajuste`, data);
  }
  getVentas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ventas`);
  }

  crearVenta(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ventas`, data);
  }

  anularVenta(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ventas/${id}/anular`, data);
  }
  getCuadresDiarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cuadres/diario`);
  }

  generarCuadreDiario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cuadres/diario`, data);
  }

  getCuadresMensuales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cuadres/mensual`);
  }

  generarCuadreMensual(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cuadres/mensual`, data);
  }
}