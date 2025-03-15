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
  escuelas: string = 'api/escuelas/';
  pedidos: string = 'api/pedidos/';
  constructor(private http: HttpClient) {}

  //  Obtener todos los datos desde el backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.usuarios}/obtener`);
  }

  //  Productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.productos}/obtener`);
  }


 // CRUD ESCUELAS ----------------------------------------------------------------------
 // Obtener todas las escuelas
 obtenerEscuelas(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}${this.escuelas}obtener`);
}

//  Obtener una escuela por ID
obtenerEscuelaPorId(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.escuelas}obtener/${id}`);
}

//  Crear una nueva escuela
crearEscuela(escuela: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.escuelas}crear`, escuela);
}

//  Actualizar una escuela
actualizarEscuela(id: string, escuela: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}${this.escuelas}actualizar/${id}`, escuela);
}

//  Eliminar una escuela
eliminarEscuela(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}${this.escuelas}eliminar/${id}`);
}
 

// CRUD USUARIOS ----------------------------------------------------------------------
obtenerUsuarios(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}api/usuarios/obtener`);
}

//  Obtener un usuario por ID
obtenerUsuarioPorId(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}api/usuarios/obtener/${id}`);
}

//  Crear un nuevo usuario
crearUsuario(usuario: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}api/usuarios/crear`, usuario);
}

//  Actualizar un usuario
actualizarUsuario(id: string, usuario: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}api/usuarios/actualizar/${id}`, usuario);
}

//  Eliminar un usuario
eliminarUsuario(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}api/usuarios/eliminar/${id}`);
}
// CRUD PEDIDOS ----------------------------------------------------------------------

 //  Obtener todos los pedidos
 obtenerPedidos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}${this.pedidos}obtener`);
}

//  Obtener un pedido por ID
obtenerPedidoPorId(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.pedidos}obtener/${id}`);
}

//  Crear un nuevo pedido
crearPedido(pedido: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.pedidos}crear`, pedido);
}

//  Actualizar un pedido
actualizarPedido(id: string, pedido: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}${this.pedidos}actualizar/${id}`, pedido);
}

// Eliminar un pedido
eliminarPedido(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}${this.pedidos}eliminar/${id}`);
}

// CRUD PRESUPUESTOS ----------------------------------------------------------------------
//  PRESUPUESTOS: CRUD API
obtenerPresupuestos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}api/presupuestos/obtener`);
}

crearPresupuesto(presupuesto: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}api/presupuestos/crear`, presupuesto);
}

actualizarPresupuesto(id: string, presupuesto: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}api/presupuestos/actualizar/${id}`, presupuesto);
}

eliminarPresupuesto(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}api/presupuestos/eliminar/${id}`);
}

}


