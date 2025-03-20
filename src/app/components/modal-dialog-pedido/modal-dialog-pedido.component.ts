import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogContent, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-dialog-pedido',
  standalone: true,
  templateUrl: './modal-dialog-pedido.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDialogContent, // 🔹 Importar estos módulos
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule
  ],
  styleUrls: ['./modal-dialog-pedido.component.scss']
})
export class ModalDialogPedidoComponent {
  form!: FormGroup;
  totalGeneral = 0;

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ModalDialogPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.fb.group({
      productos: this.fb.array([])
    });

    // Si hay productos iniciales, cargarlos
    if (this.data.productosIniciales) {
      this.data.productosIniciales.forEach((prod: any) => this.agregarFila(prod));
    } else {
      this.agregarFila();
    }
  }

  get productos(): FormArray {
    return this.form.get('productos') as FormArray;
  }

  // 🔹 Agregar una nueva fila de producto con campos de cantidad dinámicos
  agregarFila(productoData: any = null) {
    const grupo: FormGroup = this.fb.group({
      producto: [productoData?.producto || '', Validators.required],
      unidad_medida: [productoData?.unidad_medida || '', Validators.required],
      total: [productoData?.total || 0]
    });

    // 🔹 Verifica si `this.data.grados` está definido
    if (this.data?.grados && Array.isArray(this.data.grados)) {
      this.data.grados.forEach((grado: any, index: number) => {
        grupo.addControl(
          `cantidad_${index}`,
          new FormControl(productoData ? productoData[`cantidad_${index}`] : 0, Validators.required)
        );
      });
    } else {
      console.error('Error: `grados` no está definido o no es un array.');
    }

    this.productos.push(grupo);
  }


  // 🔹 Calcular el total de cada producto y el total general
  calcularTotal(index: number) {
    let total = 0;
    const producto = this.productos.at(index);

    this.data.grados.forEach((_: any, i: number) => {
      const cantidad: number = producto.get(`cantidad_${i}`)?.value || 0;
      total += Number(cantidad);
    });

    producto.get('total')?.setValue(total);

    // Calcular total general sumando todos los totales de productos
    this.totalGeneral = this.productos.controls.reduce(
      (sum, prod: any) => sum + (prod.get('total')?.value || 0),
      0
    );
  }

  // 🔹 Eliminar fila de producto
  eliminarFila(index: number) {
    this.productos.removeAt(index);
    this.calcularTotal(0);
  }

  cerrarModal(): void {
    this.dialogRef.close(null);
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
