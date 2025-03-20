import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['../../../styles.scss','./modal-dialog.component.scss'],
})
export class ModalDialogComponent {
  form!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = data.form; // Recibir el formulario dinámico
  }

  cerrarModal(): void {
    this.dialogRef.close(null);
  }

  enviarFormulario(): void {
    console.log('Form:', this.form.value);
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      console.log('The form is not valid');
      this.toastr.error('El formulario no es válido', 'Error')
      this.form.markAllAsTouched();
    }
  }
}
