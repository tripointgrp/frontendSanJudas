import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl; // URL del backend desde environment.ts
  usuarios : string = 'api/usuarios/';
  productos : string = 'api/productos/';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todos los datos desde el backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.usuarios}/obtener`);
  }

  //  Productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.productos}/obtener`);
  }
}
