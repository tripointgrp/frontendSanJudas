import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: number;
  escuela: string;
  grado: string;
  total: number;
  fecha: string;
  productos: Producto[];
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent {
  title = 'Pedidos';
  message = 'Gestión de pedidos';
  cancelButton = true;
  actionButton = true;
  actionButtonText = 'Ver detalle';

  rows: Pedido[] = [
    {
      id: 1, escuela: 'Escuela Central', grado: 'Primero', total: 250, fecha: '2025-03-07',
      productos: [
        { nombre: 'Leche', cantidad: 10, precio: 2.5 },
        { nombre: 'Pan', cantidad: 20, precio: 1.5 }
      ]
    },
    {
      id: 2, escuela: 'Colegio San Juan', grado: 'Segundo', total: 180, fecha: '2025-03-06',
      productos: [
        { nombre: 'Jugo', cantidad: 15, precio: 2.0 },
        { nombre: 'Galletas', cantidad: 10, precio: 1.8 }
      ]
    }
  ];
  
  filteredRows = [...this.rows];
  searchTerm = '';
  cancelButtonText = 'Cerrar';
  form!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  filterPedidos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(pedido =>
      pedido.escuela.toLowerCase().includes(term) ||
      pedido.grado.toLowerCase().includes(term) ||
      pedido.fecha.includes(term)
    );
  }

  verDetalle(pedido: Pedido): void {
    const productosHtml = pedido.productos.map((p: Producto) => `<p>${p.nombre} - ${p.cantidad} x $${p.precio.toFixed(2)}</p>`).join('');
    
    this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Detalle del Pedido',
        message: `
          <b>Escuela:</b> ${pedido.escuela}<br>
          <b>Grado:</b> ${pedido.grado}<br>
          <b>Fecha:</b> ${pedido.fecha}<br>
          <b>Productos:</b><br>
          ${productosHtml}
        `,
        showCancelButton: this.cancelButton,
        cancelButtonText: this.cancelButtonText,
        showActionButton: false
      }
    });
  }

  abrirModal(): void {
    this.form = this.fb.group({
      escuela: ['', Validators.required],
      grado: ['', Validators.required],
      fecha: ['', Validators.required],
      productos: ['', Validators.required]
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Nuevo Pedido',
        message: 'Ingrese los detalles del pedido',
        showCancelButton: this.cancelButton,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: 'Agregar',
        form: this.form,
        fields: [
          { label: 'Escuela', name: 'escuela', type: 'text', placeholder: 'Nombre de la escuela' },
          { label: 'Grado', name: 'grado', type: 'text', placeholder: 'Grado escolar' },
          { label: 'Fecha', name: 'fecha', type: 'date', placeholder: 'Fecha del pedido' },
          { label: 'Productos', name: 'productos', type: 'textarea', placeholder: 'Lista de productos' }
        ]
      }
    });
  }

  editarPedido(row: Pedido) {
    console.log('Editar pedido:', row);
  }

  eliminarPedido(row: Pedido) {
    console.log('Eliminar pedido:', row);
  }
}
