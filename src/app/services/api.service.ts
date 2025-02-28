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

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todos los datos desde el backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.usuarios}/obtener`);
  }

  // // 🔹 Enviar datos al backend con POST
  // sendData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/ruta-del-endpoint`, data);
  // }

  // // 🔹 Editar un dato en el backend con PUT
  // updateData(id: string, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/ruta-del-endpoint/${id}`, data);
  // }

  // // 🔹 Eliminar un dato del backend con DELETE
  // deleteData(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/ruta-del-endpoint/${id}`);
  // }
}
