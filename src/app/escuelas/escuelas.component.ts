import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.scss']
})
export class EscuelasComponent {
  title = 'Escuelas';
  message = 'Gestión de escuelas';
  cancelButton = true;
  actionButton = true;
  actionButtonText = 'Añadir escuela';
  
  rows = [
    { id: 1, nombre: 'Escuela Central', alias: 'EC', nit: '12345678', razonSocial: 'Escuela Central S.A.' },
    { id: 2, nombre: 'Colegio San Juan', alias: 'CSJ', nit: '87654321', razonSocial: 'Colegio San Juan Ltda.' },
    { id: 3, nombre: 'Academia del Futuro', alias: 'ADF', nit: '13579246', razonSocial: 'Academia del Futuro Corp.' }
  ];
  filteredRows = [...this.rows];
  searchTerm = '';
  cancelButtonText = 'Cancelar';
  form!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  filterEscuelas() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(escuela =>
      escuela.nombre.toLowerCase().includes(term) ||
      escuela.alias.toLowerCase().includes(term) ||
      escuela.nit.toLowerCase().includes(term) ||
      escuela.razonSocial.toLowerCase().includes(term)
    );
  }

  abrirModal(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      nit: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
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
          { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Nombre de la escuela' },
          { label: 'Alias', name: 'alias', type: 'text', placeholder: 'Alias de la escuela' },
          { label: 'NIT', name: 'nit', type: 'text', placeholder: 'Número de NIT' },
          { label: 'Razón Social', name: 'razonSocial', type: 'text', placeholder: 'Razón Social' },
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

  editarEscuela(row: any) {
    console.log('Editar escuela:', row);
  }

  eliminarEscuela(row: any) {
    console.log('Eliminar escuela:', row);
  }
}
