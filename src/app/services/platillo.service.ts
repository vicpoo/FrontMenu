//platillo.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platillo } from '../interfaces/platillo.interface';

@Injectable({
  providedIn: 'root',
})
export class PlatilloService {
  private apiUrl = 'http://localhost:8000/platillos/';

  constructor(private http: HttpClient) {}

  getPlatillo(id: number): Observable<Platillo> {
    return this.http.get<Platillo>(`${this.apiUrl}/${id}`);
  }

  getPlatillos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(this.apiUrl);
  }

  createPlatillo(platillo: Platillo): Observable<Platillo> {
    return this.http.post<Platillo>(this.apiUrl, platillo);
  }

  updatePlatillo(id: number, platillo: Platillo): Observable<Platillo> {
    return this.http.put<Platillo>(`${this.apiUrl}${id}`, platillo);
  }

  deletePlatillo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
