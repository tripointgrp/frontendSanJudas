import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { ModalDialogPedidoComponent } from '../components/modal-dialog-pedido/modal-dialog-pedido.component';
import { ToastrService } from 'ngx-toastr';
import { PedidosModalComponent } from './pedidos-modal/pedidos-modal.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  title = 'Pedidos';
  searchTerm = '';
  rows: any[] = [];
  rowsEscuelas: any[] = [];
  rowsProductos: any[] = [];
  filteredRows: any[] = [];
  grados: { id: any; nombre: any }[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.obtenerPedidos();
    this.obtenerEscuelas();
    this.obtenerProductos();
  }

  // 🔹 Obtener pedidos desde la API
  obtenerPedidos() {
    this.apiService.obtenerPedidoCompleto().subscribe({
      next: (data) => {
        console.log('Pedidos obtenidos:', data);
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los pedidos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  obtenerProductos() {
    this.apiService.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data);
        this.rowsProductos = data;
        console.log(this.rowsProductos);
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los pedidos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  getGrados(idEscuela: string = ''): Promise<{ id: any; nombre: any }[]> {
    console.log('ID Escuela:', idEscuela);

    return new Promise((resolve, reject) => {
      this.apiService.obtenerGradoEscuela(idEscuela).subscribe({
        next: (data) => {
            const grados = Array.isArray(data.grados)
            ? data.grados.map((grado: any) => ({
              id: grado.id,
              nombre: grado.nombre,
              }))
            : [];

          resolve(grados); // ✅ devolvemos los grados ya cargados
        },
        error: (error) => {
          console.error('Error al obtener grados:', error);
          this.toastr.error('Error al obtener grados', 'Error');
          reject(error); // ❌ en caso de error
        },
      });
    });
  }


  // 🔹 Filtrar pedidos en la tabla
  filterPedidos() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(
      (pedido) =>
        (pedido.escuela?.toLowerCase() ?? '').includes(term) ||
        (pedido.grado?.toLowerCase() ?? '').includes(term) ||
        (pedido.fecha_pedido ?? '').includes(term)
    );
  }

  // 🔹 Ver detalles de un pedido
  verDetalle(pedido: any): void {
    console.log('Detalles del pedido:', pedido);
    this.dialog.open(PedidosModalComponent, {
      width: '90vw', // ✅ 90% del ancho de la ventana
      maxWidth: '95vw', // 🔹 Para asegurarte de que no lo restrinja el maxWidth default
      panelClass: 'wide-modal', // Opcional: aplicar estilos adicionales
      data: pedido,
    });


  }


  obtenerEscuelas() {
    this.apiService.obtenerEscuelas().subscribe({
      next: (data) => {
        console.log('Escuelas obtenidas:', data);
        this.rowsEscuelas = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las escuelas';
        console.error('Error en la consulta:', error);
      },
    });
  }

  abrirModal(pedido: any = null): void {
    console.log('antes de entrar', this.rowsProductos)
    const dialogRef = this.dialog.open(ModalDialogPedidoComponent, {
      maxWidth: 'none', // 🔹 Permite que el diálogo tome el tamaño definido en width
      width: '80vh', // 🔹 El 90% del ancho de la ventana
      height: '90vh', // 🔹 El 80% del alto de la ventana
      disableClose: false,
      data: {
        title: pedido ? 'Editar Pedido' : 'Agregar Pedido',
        message: 'Ingrese los datos del pedido',
        showCancelButton: true,
        columns: 2,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: pedido ? 'Actualizar' : 'Guardar',
        escuelas: this.rowsEscuelas,
        productos: this.rowsProductos,
        buscarGradosPorEscuela: (idEscuela: string) => this.getGrados(idEscuela),
        grados: ['Grado 1', 'Grado 2', 'Grado 3'], // Simulación de grados
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Pedido guardado:', result);
      }
    });
  }

  // 🔹 Agregar un nuevo pedido a la API
  agregarPedido(nuevoPedido: any) {
    this.apiService.crearPedido(nuevoPedido).subscribe({
      next: () => {
        this.obtenerPedidos();
      },
      error: (error) => {
        console.error('Error al agregar pedido:', error);
      },
    });
  }

  // 🔹 Actualizar un pedido en la API
  actualizarPedido(id: string, pedido: any) {
    this.apiService.actualizarPedido(id, pedido).subscribe({
      next: () => {
        this.obtenerPedidos();
      },
      error: (error) => {
        console.error('Error al actualizar pedido:', error);
      },
    });
  }

  // 🔹 Eliminar un pedido de la API
  eliminarPedido(pedido: any) {
    if (
      confirm(
        `¿Seguro que deseas eliminar el pedido de la escuela "${pedido.escuela}"?`
      )
    ) {
      this.apiService.eliminarPedido(pedido._id).subscribe({
        next: () => {
          this.obtenerPedidos();
        },
        error: (error) => {
          console.error('Error al eliminar pedido:', error);
        },
      });
    }
  }
}
