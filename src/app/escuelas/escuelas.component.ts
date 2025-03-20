import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.scss']
})
export class EscuelasComponent implements OnInit {
  title = 'Escuelas';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;

  constructor(private apiService: ApiService, private dialog: MatDialog, private fb: FormBuilder, private toast : ToastrService  ) {}

  ngOnInit() {
    this.obtenerEscuelas();
  }

  // 🔹 Obtener escuelas desde la API
  obtenerEscuelas() {
    this.apiService.obtenerEscuelas().subscribe({
      next: (data) => {
        console.log('Escuelas obtenidas:', data);
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las escuelas';
        console.error('Error en la consulta:', error);
        this.loading = false;
      }
    });
  }

  // 🔹 Filtrar escuelas en la tabla
  filterEscuelas() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(escuela =>
      (escuela.nombre?.toLowerCase() ?? '').includes(term) ||
      (escuela.nit?.toLowerCase() ?? '').includes(term) ||
      (escuela.razon_social?.toLowerCase() ?? '').includes(term)
    );
  }

  // 🔹 Abrir modal para agregar o editar escuela
  abrirModal(escuela: any = null): void {
    this.form = this.fb.group({
      nombre: [escuela?.nombre || '', Validators.required],
      nit: [escuela?.nit || '', Validators.required],
      razon_social: [escuela?.razon_social || '', Validators.required],
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: escuela ? 'Editar Escuela' : 'Agregar Escuela',
        columns: 1,
        message: 'Ingrese los datos de la escuela',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: escuela ? 'Actualizar' : 'Guardar',
        form: this.form,
        fields: [
          { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Nombre de la escuela' },
          { label: 'Nit', name: 'nit', type: 'number', placeholder: 'Nit' },
          { label: 'Razón Social', name: 'razon_social', type: 'text', placeholder: 'Razón Social' },
        ],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (escuela) {
          this.actualizarEscuela(escuela._id, result);
        } else {
          this.agregarEscuela(result);
        }
      }
    });
  }

  // 🔹 Agregar una nueva escuela a la API
  agregarEscuela(nuevaEscuela: any) {
    this.apiService.crearEscuela(nuevaEscuela).subscribe({
      next: () => {
        this.toast.success('Escuela agregada correctamente', 'Éxito');
        this.obtenerEscuelas();
      },
      error: (error) => {
        console.error('Error al agregar escuela:', error);
      }
    });
  }

  // 🔹 Actualizar una escuela en la API
  actualizarEscuela(id: string, escuela: any) {
    this.apiService.actualizarEscuela(id, escuela).subscribe({
      next: () => {
        this.toast.success('Escuela actualizada correctamente', 'Éxito');
        this.obtenerEscuelas();
      },
      error: (error) => {
        console.error('Error al actualizar escuela:', error);
      }
    });
  }

  // 🔹 Eliminar una escuela de la API
  eliminarEscuela(escuela: any) {
    if (confirm(`¿Seguro que deseas eliminar la escuela "${escuela.nombre}"?`)) {
      this.apiService.eliminarEscuela(escuela._id).subscribe({
        next: () => {
          this.obtenerEscuelas();
        },
        error: (error) => {
          console.error('Error al eliminar escuela:', error);
        }
      });
    }
  }
}
