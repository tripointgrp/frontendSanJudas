import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  title = 'Usuarios';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;

  constructor(private apiService: ApiService, private dialog: MatDialog, private fb: FormBuilder,  private loader: LoaderService) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  // 🔹 Obtener usuarios desde la API
  obtenerUsuarios() {
    this.loader.show();
    this.apiService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
        this.loader.hide();
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los usuarios';
        console.error('Error en la consulta:', error);
        this.loading = false;
        this.loader.hide();
      }
    });
  }

  // 🔹 Filtrar usuarios en la tabla
  filterUsuarios() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(usuario =>
      (usuario.nombre?.toLowerCase() ?? '').includes(term) ||
      (usuario.contacto?.toLowerCase() ?? '').includes(term) ||
      (usuario.correo?.toLowerCase() ?? '').includes(term)
    );
  }

  // 🔹 Abrir modal para agregar o editar usuario
  abrirModal(usuario: any = null): void {
    this.form = this.fb.group({
      nombre: [usuario?.nombre || '', Validators.required],
      contacto: [usuario?.contacto || '', Validators.required],
      correo: [usuario?.correo || '', [Validators.required, Validators.email]],
      clave: [usuario ? '' : '', usuario ? [] : [Validators.required, Validators.minLength(6)]]
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: usuario ? 'Editar Usuario' : 'Agregar Usuario',
        columns: 1,
        message: 'Ingrese los datos del usuario',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: usuario ? 'Actualizar' : 'Guardar',
        form: this.form
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (usuario) {
          this.actualizarUsuario(usuario._id, result);
        } else {
          this.agregarUsuario(result);
        }
      }
    });
  }

  // 🔹 Agregar un nuevo usuario a la API
  agregarUsuario(nuevoUsuario: any) {
    this.apiService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al agregar usuario:', error);
      }
    });
  }

  // 🔹 Actualizar un usuario en la API
  actualizarUsuario(id: string, usuario: any) {
    this.apiService.actualizarUsuario(id, usuario).subscribe({
      next: () => {
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  // 🔹 Eliminar un usuario de la API
  eliminarUsuario(usuario: any) {
    if (confirm(`¿Seguro que deseas eliminar el usuario "${usuario.nombre}"?`)) {
      this.apiService.eliminarUsuario(usuario._id).subscribe({
        next: () => {
          this.obtenerUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
