import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../../components/modal-dialog/modal-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-escuelas-grados',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './escuelas-grados.component.html',
  styleUrl: './escuelas-grados.component.scss',
})
export class EscuelasGradosComponent {
  title = 'Escuelas';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;
  rowsGrados: any[] = [];

  escuela: string = '';
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    const escuelaId = this.route.snapshot.paramMap.get('id');
    this.escuela = escuelaId?.toString() || '';
    this.obtenerEscuelas(escuelaId);
    this.obtenerGrados();
  }

  // 🔹 Obtener escuelas desde la API
  obtenerEscuelas(_id : any) {
    this.apiService.obtenerGradoEscuela(_id).subscribe({
      next: (data) => {
        console.log('Escuelas obtenidas:', data.grados);
        this.rows = data.grados;
        this.filteredRows = [...data.grados];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las escuelas';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  obtenerGrados() {
    this.apiService.obtenerGrados().subscribe({
      next: (data) => {
        console.log('Grados obtenidos:', data);
        this.rowsGrados = data;
      },
      error: (error) => {
        console.error('Error al obtener grados:', error);
      },
    });
  }

  // 🔹 Filtrar escuelas en la tabla
  filterEscuelas() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(
      (escuela) =>
        (escuela.nombre?.toLowerCase() ?? '').includes(term) ||
        (escuela.nit?.toLowerCase() ?? '').includes(term) ||
        (escuela.razon_social?.toLowerCase() ?? '').includes(term)
    );
  }

  // 🔹 Abrir modal para agregar o editar escuela
  abrirModal(escuela: any = null): void {
    console.log('Escuela:', escuela);
    this.form = this.fb.group({
      id_escuela: [this.escuela || '', Validators.required],
      id_grado: [escuela?.id_grado || 0, Validators.required],
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
      title: escuela ? 'Editar Escuela' : 'Agregar Escuela',
      columns: 1,
      message: 'Seleccione el grado de la escuela',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showActionButton: true,
      actionButtonText: escuela ? 'Actualizar' : 'Guardar',
      form: this.form,
      fields: [
        {
        label: 'Grado',
        name: 'id_grado',
        type: 'select',
        options: this.rowsGrados.map((grado) => ({
          value: grado._id,
          label: grado.nombre,
        })),
        placeholder: 'Seleccione un grado',
        },
      ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
    console.log('Nueva escuela:', nuevaEscuela);
    this.apiService.crearGradoEscuela(nuevaEscuela).subscribe({
      next: () => {
        this.toast.success('Grado agregado correctamente a la escuela', 'Éxito');
        this.obtenerEscuelas(this.escuela);
      },
      error: (error) => {
        if (error?.error) {
          this.toast.error('Este grado ya está asignado a la escuela.', 'Error');
        } else {
          console.error('Error al agregar escuela:', error);
        }
      },
    });
  }

  // 🔹 Actualizar una escuela en la API
  actualizarEscuela(id: string, escuela: any) {
    this.apiService.actualizarEscuela(id, escuela).subscribe({
      next: () => {
        this.toast.success('Escuela actualizada correctamente', 'Éxito');
        // this.obtenerEscuelas();
      },
      error: (error) => {
        console.error('Error al actualizar escuela:', error);
      },
    });
  }

  // 🔹 Eliminar una escuela de la API
  eliminarEscuela(escuela: any) {
    console.log('Eliminar escuela:', escuela);
    if (
      confirm(`¿Seguro que deseas eliminar el grado "${escuela.nombre}"?`)
    ) {
      this.apiService.eliminarGradoEscuela(escuela.id).subscribe({
        next: () => {
          this.toast.success('Grado eliminado correctamente de la escuela', 'Éxito');
          this.obtenerEscuelas(this.escuela);
        },
        error: (error) => {
          this.toast.error('Error al eliminar el grado de la escuela', 'Error');
          console.error('Error al eliminar escuela:', error);
        },
      });
    }
  }

  goGrade(escuela: any) {
    console.log('Ir a grados de la escuela:', escuela);
    this.router.navigate([`/escuelas-grados/${escuela._id}`]);
  }
}
