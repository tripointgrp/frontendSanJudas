import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['../../../styles.scss', './modal-dialog.component.scss'],
})
export class ModalDialogComponent {
  form!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = data.form; // Recibir el formulario dinámico
  }

  cerrarModal(): void {
    this.dialogRef.close(null);
  }

  logInvalidControls(control: AbstractControl, path: string = ''): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key) => {
        const childControl = control.get(key);
        const controlPath = path ? `${path}.${key}` : key;
        if (childControl) {
          this.logInvalidControls(childControl, controlPath);
        }
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach((childControl, index) => {
        const controlPath = `${path}[${index}]`;
        this.logInvalidControls(childControl, controlPath);
      });
    } else {
      if (control.invalid) {
        console.warn('❌ Campo inválido:', path, control.errors);
      }
    }
  }

  enviarFormulario(): void {

    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.toastr.error('El formulario no es válido', 'Error');
      this.form.markAllAsTouched();
    }
  }
}
