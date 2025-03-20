import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { ModalDialogPedidoComponent } from '../components/modal-dialog-pedido/modal-dialog-pedido.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  title = 'Pedidos';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;

  constructor(private apiService: ApiService, private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit() {
    this.obtenerPedidos();
  }

  // 🔹 Obtener pedidos desde la API
  obtenerPedidos() {
    this.apiService.obtenerPedidos().subscribe({
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
      }
    });
  }

  // 🔹 Filtrar pedidos en la tabla
  filterPedidos() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(pedido =>
      (pedido.escuela?.toLowerCase() ?? '').includes(term) ||
      (pedido.grado?.toLowerCase() ?? '').includes(term) ||
      (pedido.fecha_pedido ?? '').includes(term)
    );
  }

  // 🔹 Ver detalles de un pedido
  verDetalle(pedido: any): void {
    this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Detalle del Pedido',
        message: `
          <b>Escuela:</b> ${pedido.escuela}<br>
          <b>Grado:</b> ${pedido.grado}<br>
          <b>Fecha:</b> ${pedido.fecha_pedido}<br>
          <b>Total:</b> $${pedido.total.toFixed(2)}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        showActionButton: false
      }
    });
  }

  abrirModal(pedido: any = null): void {
    const dialogRef = this.dialog.open(ModalDialogPedidoComponent, {
      maxWidth: 'none', // 🔹 Permite que el diálogo tome el tamaño definido en width
      width: '90vw',   // 🔹 El 90% del ancho de la ventana
      height: '80vh',  // 🔹 El 80% del alto de la ventana
      disableClose: false,
      data: {
        title: pedido ? 'Editar Pedido' : 'Agregar Pedido',
        message: 'Ingrese los datos del pedido',
        showCancelButton: true,
        columns: 2,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: pedido ? 'Actualizar' : 'Guardar',
        escuelas: [
          { id: '1', nombre: 'Escuela Central' },
          { id: '2', nombre: 'Colegio San Juan' }
        ],
        productos: [
          { id: 'p1', nombre: 'Leche' },
          { id: 'p2', nombre: 'Pan' }
        ],
        grados: ['Grado 1', 'Grado 2', 'Grado 3'] // Simulación de grados
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
      }
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
      }
    });
  }

  // 🔹 Eliminar un pedido de la API
  eliminarPedido(pedido: any) {
    if (confirm(`¿Seguro que deseas eliminar el pedido de la escuela "${pedido.escuela}"?`)) {
      this.apiService.eliminarPedido(pedido._id).subscribe({
        next: () => {
          this.obtenerPedidos();
        },
        error: (error) => {
          console.error('Error al eliminar pedido:', error);
        }
      });
    }
  }
}
