import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GradosResponse } from '../interfaces/grado.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl; // URL del backend desde environment.ts
  usuarios: string = 'api/usuarios/';
  productos: string = 'api/productos/';
  escuelas: string = 'api/escuelas/';
  pedidos: string = 'api/pedidos/';
  pedidosUnificados = 'api/pedidosSemanal/';
  categoria: string = 'api/categorias/';
  unidadm: string = 'api/unidades_medida/';
  escuelas_grados: string = 'api/escuelas_grados/';
  grados: string = 'api/grados/';
  presupuestos: string = 'api/presupuestos-real/';
  presupuestoEscuela: string = 'api/PresupuestoEscuelaV2';
  presupuestoGrados: string = 'api/PresupuestoGradoV2';

  constructor(private http: HttpClient) {}

  // CRUD Presupuestos ----------------------------------------------------------------------
  getPresupuestosEscuelas(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.presupuestoEscuela}/por-escuela/${id}`);	
  }

  getPresupuestosGrados(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.presupuestoGrados}/por-presupuesto/${id}`);	
  }

  savePresupuestoEscuela(presupuesto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.presupuestoEscuela}/crear`, presupuesto);
  }

  savePresupuestoGrado(presupuesto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.presupuestoGrados}/crear`, presupuesto);
  }
  
  deletePresupuestoEscuela(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.presupuestoEscuela}/eliminar/${id}`);
  }

  deletePresupuestoGrado(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.presupuestoGrados}/eliminar/${id}`);
  }

getPedidosFechas(fechaInicio: string, fechaFin: string): Observable<any[]> {
  const params = {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin
  };

  return this.http.get<any[]>(`${this.apiUrl}${this.pedidosUnificados}productos-por-fechas`, { params });
}

  //  Obtener todos los datos desde el backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.usuarios}/obtener`);
  }

  //  Productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.productos}/obtener`);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}${this.productos}eliminar/${id}`
    );
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.productos}crear`,
      producto
    );
  }

  actualizarProducto(id: string, producto: any): Observable<any> {
    console.log('Actualizar id:', id);
    console.log('Actualizar producto:', producto);
    return this.http.put<any>(
      `${this.apiUrl}${this.productos}actualizar/${id}`,
      producto
    );
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
    return this.http.put<any>(
      `${this.apiUrl}${this.escuelas}actualizar/${id}`,
      escuela
    );
  }

  //  Eliminar una escuela
  eliminarEscuela(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}${this.escuelas}eliminar/${id}`
    );
  }

  //  Obtener todos los grados de una escuela

  obtenerGradoEscuela(id: string): Observable<GradosResponse> {
    return this.http.get<GradosResponse>(
      `${this.apiUrl}${this.escuelas_grados}grados-por-escuela/${id}`
    );
  }

  crearGradoEscuela(grado: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.escuelas_grados}crear`,
      grado
    );
  }

  eliminarGradoEscuela(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}${this.escuelas_grados}eliminar/${id}`
    );
  }

  // CRUD grados de escuela
  obtenerGrados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.grados}obtener`);
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
    return this.http.put<any>(
      `${this.apiUrl}api/usuarios/actualizar/${id}`,
      usuario
    );
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

  obtenerPedidoCompleto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.pedidosUnificados}/todos-completo`);
  }


  //  Obtener un pedido por ID
  obtenerPedidoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.pedidos}obtener/${id}`);
  }

  //  Crear un nuevo pedido
  crearPedido(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.pedidosUnificados}crear-pedido-semanal`, pedido);
  }

    //  Crear un nuevo pedido
    crearPresupuestoSemanal(pedido: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}${this.presupuestos}crear-presupuesto-semanal`, pedido);
    }

  //  Actualizar un pedido
  actualizarPedido(id: string, pedido: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.pedidos}actualizar/${id}`,
      pedido
    );
  }

  // Eliminar un pedido
  eliminarPedido(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.pedidos}eliminar/${id}`);
  }

  // CRUD PRESUPUESTOS ----------------------------------------------------------------------
  //  PRESUPUESTOS: CRUD API

  obtenerPresupuestosSemanal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.presupuestos}todos-completo`);
  }


  obtenerPresupuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/presupuestos/obtener`);
  }

  crearPresupuesto(presupuesto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}api/presupuestos/crear`,
      presupuesto
    );
  }

  actualizarPresupuesto(id: string, presupuesto: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}api/presupuestos/actualizar/${id}`,
      presupuesto
    );
  }

  eliminarPresupuesto(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}api/presupuestos/eliminar/${id}`
    );
  }

  // CRUD CATEGORIAS ----------------------------------------------------------------------
  //  CATEGORIAS: CRUD API
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.categoria}obtener`);
  }

  //CRUD UNIDAD DE MEDIDA
  obtenerUnidadMedida(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.unidadm}obtener`);
  }
}
