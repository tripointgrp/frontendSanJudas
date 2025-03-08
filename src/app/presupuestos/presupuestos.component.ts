import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface ProductoPresupuesto {
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
}

interface Presupuesto {
  id: number;
  envio: string;
  escuela: string;
  fecha: string;
  montoTotal: number;
  productos: ProductoPresupuesto[];
}

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent {
  title = 'Presupuestos';
  message = 'Gestión de presupuestos';
  cancelButton = true;
  actionButton = true;
  actionButtonText = 'Ver detalle';

  rows: Presupuesto[] = [
    {
      id: 1, envio: 'ENVIO 3', escuela: 'Escuela Central', fecha: '2025-03-07', montoTotal: 450,
      productos: [
        { nombre: 'Azúcar', precioUnitario: 4.50, cantidad: 76, total: 342 },
        { nombre: 'Raja de canela', precioUnitario: 3.00, cantidad: 36, total: 108 }
      ]
    },
    {
      id: 2, envio: 'ENVIO 4', escuela: 'Colegio San Juan', fecha: '2025-03-06', montoTotal: 170,
      productos: [
        { nombre: 'Leche', precioUnitario: 2.50, cantidad: 50, total: 125 },
        { nombre: 'Pan', precioUnitario: 1.50, cantidad: 30, total: 45 }
      ]
    }
  ];
  
  filteredRows = [...this.rows];
  searchTerm = '';
  cancelButtonText = 'Cerrar';
  form!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  filterPresupuestos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(presupuesto =>
      presupuesto.envio.toLowerCase().includes(term) ||
      presupuesto.escuela.toLowerCase().includes(term) ||
      presupuesto.fecha.includes(term)
    );
  }

  verDetalle(presupuesto: Presupuesto): void {
    const productosHtml = presupuesto.productos.map((p: ProductoPresupuesto) => 
      `<p>${p.nombre} - ${p.cantidad} x Q${p.precioUnitario.toFixed(2)} = Q${p.total.toFixed(2)}</p>`).join('');
    
    this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Detalle del Presupuesto',
        message: `
          <b>Envío:</b> ${presupuesto.envio}<br>
          <b>Escuela:</b> ${presupuesto.escuela}<br>
          <b>Fecha:</b> ${presupuesto.fecha}<br>
          <b>Monto Total:</b> Q${presupuesto.montoTotal}<br>
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
      envio: ['', Validators.required],
      escuela: ['', Validators.required],
      fecha: ['', Validators.required],
      montoTotal: ['', Validators.required],
      productos: ['', Validators.required]
    });

    this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Nuevo Presupuesto',
        message: 'Ingrese los detalles del presupuesto',
        showCancelButton: this.cancelButton,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: 'Agregar',
        form: this.form,
        fields: [
          { label: 'Envío', name: 'envio', type: 'text', placeholder: 'Número de envío' },
          { label: 'Escuela', name: 'escuela', type: 'text', placeholder: 'Nombre de la escuela' },
          { label: 'Fecha', name: 'fecha', type: 'date', placeholder: 'Fecha del presupuesto' },
          { label: 'Monto Total', name: 'montoTotal', type: 'number', placeholder: 'Monto total' },
          { label: 'Productos', name: 'productos', type: 'textarea', placeholder: 'Lista de productos' }
        ]
      }
    });
  }
}
