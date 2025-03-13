// orden-segunda-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenSegundaApi } from '../interfaces/orden.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdenSegundaApiService {
  private apiUrl = 'http://localhost:8001/ordenes';

  constructor(private http: HttpClient) {}

  getOrden(id: number): Observable<OrdenSegundaApi> {
    return this.http.get<OrdenSegundaApi>(`${this.apiUrl}/${id}`);
  }

  getOrdenes(): Observable<OrdenSegundaApi[]> {
    return this.http.get<OrdenSegundaApi[]>(this.apiUrl);
  }

  updateEstadoOrden(id: number, estado: { estado: string }): Observable<OrdenSegundaApi> {
    return this.http.put<OrdenSegundaApi>(`${this.apiUrl}/${id}`, estado);
  }
}