import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {
  title = 'Usuarios';
  message = 'Gestión de usuarios';
  cancelButton = true;
  actionButton = true;
  actionButtonText = 'Añadir usuario';
  
  rows = [
    { id: 1, nombre: 'Juan Pérez', contacto: '4455-1234', correo: 'juan@example.com' },
    { id: 2, nombre: 'María López', contacto: '4555-5678', correo: 'maria@example.com' },
    { id: 3, nombre: 'Carlos Gómez', contacto: '3555-9876', correo: 'carlos@example.com' }
  ];
  filteredRows = [...this.rows];
  searchTerm = '';
  cancelButtonText = 'Cancelar';
  form!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  filterUsuarios() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.contacto.toLowerCase().includes(term) ||
      usuario.correo.toLowerCase().includes(term)
    );
  }

  abrirModal(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: this.title,
        columns: 1,
        message: this.message,
        showCancelButton: this.cancelButton,
        cancelButtonText: this.cancelButtonText,
        showActionButton: this.actionButton,
        actionButtonText: this.actionButtonText,
        form: this.form,
        fields: [
          { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Nombre del usuario' },
          { label: 'Contacto', name: 'contacto', type: 'text', placeholder: 'Número de contacto' },
          { label: 'Correo', name: 'correo', type: 'email', placeholder: 'Correo electrónico' },
          { label: 'Contraseña', name: 'contrasena', type: 'password', placeholder: 'Contraseña' }
        ],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Acción principal confirmada');
      } else {
        console.log('Modal cerrado sin acción');
      }
    });
  }

  editarUsuario(row: any) {
    console.log('Editar usuario:', row);
  }

  eliminarUsuario(row: any) {
    console.log('Eliminar usuario:', row);
  }
}

