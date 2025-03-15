import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  title = 'Presupuestos';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;

  constructor(private apiService: ApiService, private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit() {
    this.obtenerPresupuestos();
  }

  // 🔹 Obtener Presupuestos desde la API
  obtenerPresupuestos() {
    this.apiService.obtenerPresupuestos().subscribe({
      next: (data) => {
        console.log('Presupuestos obtenidos:', data);
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los presupuestos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      }
    });
  }

  // 🔹 Filtrar Presupuestos en la Tabla
  filterPresupuestos() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(presupuesto =>
      (presupuesto.envio?.toLowerCase() ?? '').includes(term) ||
      (presupuesto.escuela?.toLowerCase() ?? '').includes(term) ||
      (presupuesto.fecha?.includes(term) ?? false)
    );
  }

  // 🔹 Ver Detalle del Presupuesto
  verDetalle(presupuesto: any): void {
    this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Detalle del Presupuesto',
        message: `
          <b>Envío:</b> ${presupuesto.envio}<br>
          <b>Escuela:</b> ${presupuesto.escuela}<br>
          <b>Fecha:</b> ${presupuesto.fecha}<br>
          <b>Monto Total:</b> Q${presupuesto.monto_total}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        showActionButton: false
      }
    });
  }

  // 🔹 Abrir Modal para Agregar o Editar Presupuesto
  abrirModal(presupuesto: any = null): void {
    this.form = this.fb.group({
      envio: [presupuesto?.envio || '', Validators.required],
      escuela: [presupuesto?.escuela || '', Validators.required],
      fecha: [presupuesto?.fecha || '', Validators.required],
      monto_total: [presupuesto?.monto_total || '', Validators.required]
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: presupuesto ? 'Editar Presupuesto' : 'Agregar Presupuesto',
        columns: 1,
        message: 'Ingrese los datos del presupuesto',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: presupuesto ? 'Actualizar' : 'Guardar',
        form: this.form
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (presupuesto) {
          this.actualizarPresupuesto(presupuesto._id, result);
        } else {
          this.agregarPresupuesto(result);
        }
      }
    });
  }

  // 🔹 Agregar Presupuesto
  agregarPresupuesto(nuevoPresupuesto: any) {
    this.apiService.crearPresupuesto(nuevoPresupuesto).subscribe({
      next: () => {
        this.obtenerPresupuestos();
      },
      error: (error) => {
        console.error('Error al agregar presupuesto:', error);
      }
    });
  }

  // 🔹 Actualizar Presupuesto
  actualizarPresupuesto(id: string, presupuesto: any) {
    this.apiService.actualizarPresupuesto(id, presupuesto).subscribe({
      next: () => {
        this.obtenerPresupuestos();
      },
      error: (error) => {
        console.error('Error al actualizar presupuesto:', error);
      }
    });
  }

  // 🔹 Eliminar Presupuesto
  eliminarPresupuesto(presupuesto: any) {
    if (confirm(`¿Seguro que deseas eliminar el presupuesto de "${presupuesto.escuela}"?`)) {
      this.apiService.eliminarPresupuesto(presupuesto._id).subscribe({
        next: () => {
          this.obtenerPresupuestos();
        },
        error: (error) => {
          console.error('Error al eliminar presupuesto:', error);
        }
      });
    }
  }
}
