import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-moda-dialog-presupuestos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    NgSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './moda-dialog-presupuestos.component.html',
  styleUrl: './moda-dialog-presupuestos.component.scss'
})
export class ModaDialogPresupuestosComponent {
  form!: FormGroup;
  totalGeneral = 0;
  tamañoModal: 'small' | 'large' = 'small';
  showStep = false;
  grados: { id: any; nombre: any }[] = [];
  diasDisponibles: { nombre: string; fecha: string; seleccionado: boolean }[] =
    [];

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ModaDialogPresupuestosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private servicio: ApiService,
    private authService: AuthService // Cambia esto por tu servicio de autenticación
  ) {
    this.dialogRef.addPanelClass('small');
    this.inicializarFormulario();
  }

  ngOnInit() {
    this.form
      .get('fechaInicio')
      ?.valueChanges.subscribe(() => this.calcularDiasDisponibles());
    this.form
      .get('fechaFin')
      ?.valueChanges.subscribe(() => this.calcularDiasDisponibles());
  }

  inicializarFormulario() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.form = this.fb.group(
      {
        escuela: [this.data.escuela || null, Validators.required],
        fechaInicio: [
          this.data.fechaInicio || null,
          [Validators.required, this.fechaMinimaValidator(hoy)],
        ],
        fechaFin: [
          this.data.fechaFin || null,
          [Validators.required, this.fechaMinimaValidator(hoy)],
        ],
        diasSeleccionables: this.fb.array([]),
      },
      {
        validators: this.fechasInicioFinValidator,
      }
    );

    if (this.data.diasSeleccionables) {
      this.data.diasSeleccionables.forEach((dia: any) => {
        const productosFormArray = this.fb.array([]); // 👈 esto garantiza que sea FormArray

        const diaGroup = this.fb.group({
          nombre: [dia.nombre],
          fecha: [dia.fecha],
          seleccionado: [dia.seleccionado],
          productos: productosFormArray, // ✅ correcto y seguro
        });

        this.diasSeleccionables.push(diaGroup);
      });
    }
  }



  getProductosArray(diaIndex: number): FormArray {
    return this.diasSeleccionables.at(diaIndex).get('productos') as FormArray;
  }

  agregarProducto(diaIndex: number): void {
    const productosArray = this.getProductosArray(diaIndex);

    if (!this.grados || this.grados.length === 0) {
      this.toastr.error('No hay grados cargados aún.');
      return;
    }

    const grupo: { [key: string]: FormControl } = {
      producto: new FormControl('', Validators.required),
      unidad_medida: new FormControl('', Validators.required),
      precio_unitario: new FormControl('', Validators.required),
    };

    this.grados.forEach((_, index: number) => {
      grupo[`cantidad_${index}`] = new FormControl(0, Validators.required);
    });

    const grupoProducto = this.fb.group(grupo);

    grupoProducto.get('producto')?.valueChanges.subscribe((productoSeleccionado: any) => {
      const unidadObj = productoSeleccionado?.id_unidad_medida
        ? {
            id: productoSeleccionado.id_unidad_medida._id,
            nombre: productoSeleccionado.id_unidad_medida.nombre,
          }
        : { id: null, nombre: '' };

      grupoProducto.get('unidad_medida')?.setValue(unidadObj);
    });



    productosArray.push(grupoProducto);
  }

  actualizarUnidad(nombreProducto: string, diaIndex: number, productoIndex: number): void {
    const producto: { id_unidad_medida?: { nombre: string } } | undefined = this.data.productos.find((p: { nombre: string }) => p.nombre === nombreProducto);
    const unidad = producto?.id_unidad_medida?.nombre || '';

    const grupo = this.getProductosArray(diaIndex).at(productoIndex) as FormGroup;
    grupo.get('unidad_medida')?.setValue(unidad);
  }




  eliminarProducto(diaIndex: number, productoIndex: number): void {
    const productosArray = this.getProductosArray(diaIndex);
    productosArray.removeAt(productoIndex);
  }

  calcularTotalPorDia(diaIndex: number, productoIndex: number): void {
    const producto = this.getProductosArray(diaIndex).at(productoIndex);
    let total = 0;

    this.grados.forEach((_, i) => {
      const cantidad = producto.get(`cantidad_${i}`)?.value || 0;
      total += Number(cantidad);
    });

    producto.patchValue({ total }); // opcional si tienes un campo total
  }



  fechasInicioFinValidator(group: FormGroup) {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (fechaInicio >= fechaFin) {
      return { fechasNoValidas: true };
    }

    return null;
  }

  fechaMinimaValidator(minDate: Date) {
    return (control: FormControl) => {
      const valor = control.value;
      if (!valor) return null;
      const fecha = new Date(valor);
      fecha.setHours(0, 0, 0, 0);
      return fecha < minDate ? { fechaInvalida: true } : null;
    };
  }

  handleAction(): void {
    if (!this.showStep) {
      // Validar antes de avanzar
      if (
        this.form.get('fechaInicio')?.invalid ||
        this.form.get('fechaFin')?.invalid ||
        this.form.hasError('fechasNoValidas')
      ) {
        this.form.get('fechaInicio')?.markAsTouched();
        this.form.get('fechaFin')?.markAsTouched();
        this.toastr.error('Corrige las fechas antes de continuar.', 'Error');
        return;
      }

      const idEscuela = this.form.get('escuela')?.value._id;

      // Cargar grados y expandir modal
      this.cargarGrados(idEscuela).then(() => {
        this.expandirModal();
        // Agregar productos por cada día seleccionado
        this.diasSeleccionables.controls.forEach((diaCtrl, index) => {
          if (diaCtrl.get('seleccionado')?.value) {
            let productosArray = diaCtrl.get('productos') as FormArray;

            if (!productosArray) {
              productosArray = this.fb.array([]);
              (diaCtrl as FormGroup).addControl('productos', productosArray);
            }

            if (productosArray.length === 0) {
              this.agregarProducto(index);
            }
          }
        });
      });
    } else {
      this.enviarFormulario(); // Ya en segundo paso, intenta enviar
    }
  }


  enviarFormulario(): void {
    if (this.form.invalid) {
      this.toastr.error('Formulario incompleto o con errores.', 'Error');
      this.form.markAllAsTouched();
      return;
    }

    const dias: any[] = [];
    let totalCantidad = 0; // Acumulador total

    this.diasSeleccionables.controls.forEach((diaCtrl) => {
      if (diaCtrl.get('seleccionado')?.value) {
        const productosArray = diaCtrl.get('productos') as FormArray;
        const detalles: any[] = [];

        productosArray.controls.forEach((productoCtrl: AbstractControl) => {
          const producto = productoCtrl.get('producto')?.value;
          const unidad_medida = productoCtrl.get('unidad_medida')?.value;
          const precio_unitario = productoCtrl.get('precio_unitario')?.value;
          this.grados.forEach((grado, i) => {
            const cantidad = productoCtrl.get(`cantidad_${i}`)?.value || 0;

            if (cantidad > 0) {
              detalles.push({
                id_grado: grado.id,
                id_producto: producto._id,
                cantidad_comprada : cantidad,
                precio_unitario: precio_unitario,
                unidad_medida: unidad_medida.id,
              });

              totalCantidad += cantidad; // Sumamos a total general
            }
          });
        });

        dias.push({
          fecha: diaCtrl.get('fecha')?.value,
          detalles
        });
      }
    });

    const payload = {
      id_escuela: this.form.get('escuela')?.value._id,
      fecha_inicio: this.form.get('fechaInicio')?.value,
      fecha_fin: this.form.get('fechaFin')?.value,
      id_usuario: this.authService.getUsuario(),
      // total: totalCantidad,
      dias
    };
    this.servicio.crearPresupuestoSemanal(payload).subscribe({
      next: (response) => {
        this.toastr.success('Presupuesto creado exitosamente.', 'Éxito');
        this.dialogRef.close(response); // Cerrar el modal y pasar el resultado

      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        this.toastr.error('Error al crear pedido', 'Error');
      },
    });
  }




  // en un método async del modal
  async cargarGrados(idEscuela: string) {
    try {
      const grados = await this.data.buscarGradosPorEscuela(idEscuela);
      this.grados = grados;
    } catch (error) {
      console.error('Error al cargar grados:', error);
      this.toastr.error('No se pudieron cargar los grados', 'Error');
    }
  }

  expandirModal() {
    if (!this.showStep) {
      this.dialogRef.updateSize('90vw', 'auto');
      this.showStep = true;
    } else {
      this.dialogRef.updateSize('30vw', 'auto');
      this.showStep = false;
    }
  }

  get productos(): FormArray {
    return this.form.get('productos') as FormArray;
  }

  agregarFila(productoData: any = null) {
    const grupo: FormGroup = this.fb.group({
      producto: [productoData?.producto || '', Validators.required],
      unidad_medida: [productoData?.unidad_medida || '', Validators.required],
      total: [productoData?.total || 0],
    });

    if (this.data?.grados && Array.isArray(this.data.grados)) {
      this.data.grados.forEach((_: any, index: number) => {
        grupo.addControl(
          `cantidad_${index}`,
          new FormControl(
            productoData ? productoData[`cantidad_${index}`] : 0,
            Validators.required
          )
        );
      });
    } else {
      console.error('Error: `grados` no está definido o no es un array.');
    }

    this.productos.push(grupo);
  }

  calcularTotal(index: number) {
    let total = 0;
    const producto = this.productos.at(index);

    this.data.grados.forEach((_: any, i: number) => {
      const cantidad: number = producto.get(`cantidad_${i}`)?.value || 0;
      total += Number(cantidad);
    });

    producto.get('total')?.setValue(total);

    this.totalGeneral = this.productos.controls.reduce(
      (sum, prod: any) => sum + (prod.get('total')?.value || 0),
      0
    );
  }

  eliminarFila(index: number) {
    this.productos.removeAt(index);
    this.calcularTotal(0);
  }

  cerrarModal(): void {
    this.dialogRef.close(null);
  }


  onEscuelaChange(event: any) {
    const escuelaId = event._id; // Obtener el ID de la escuela seleccionada
    this.servicio.obtenerGradoEscuela(escuelaId).subscribe({
      next: (data) => {
        // this.data.grados = data;
        // this.productos.clear(); // Limpiar productos al cambiar escuela
        // this.agregarFila(); // Agregar fila inicial
      },
      error: (error) => {
        console.error('Error al obtener grados:', error);
        this.toastr.error('Error al obtener grados', 'Error');
      },
    });
  }

  get seleccionados() {
    return (this.form.get('diasSeleccionables') as FormArray).controls
      .filter((ctrl) => ctrl.get('seleccionado')?.value)
      .map((ctrl) => ({
        nombre: ctrl.get('nombre')?.value,
        fecha: ctrl.get('fecha')?.value,
      }));
  }

  get diasSeleccionables(): FormArray {
    return this.form.get('diasSeleccionables') as FormArray;
  }




  calcularDiasDisponibles(): void {
    const formArray = this.form.get('diasSeleccionables') as FormArray;
    formArray.clear();

    const inicio = this.form.get('fechaInicio')?.value;
    const fin = this.form.get('fechaFin')?.value;

    if (!inicio || !fin) return;

    const fechaInicio = this.parseFechaLocal(inicio);
    const fechaFin = this.parseFechaLocal(fin);


    if (fechaInicio >= fechaFin) return;

    let actual = new Date(fechaInicio);

    while (actual <= fechaFin) {
      const nombreDia = actual.toLocaleDateString('es-ES', { weekday: 'long' });
      const fechaTexto = actual.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
      });

      formArray.push(
        this.fb.group({
          nombre: [this.capitalize(nombreDia)],
          fecha: [fechaTexto],
          seleccionado: [false],
        })
      );

      actual.setDate(actual.getDate() + 1);
    }
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Mes -1 porque Date empieza en 0
  }

  calcularSumaGrados(producto: any): number {
    let suma = 0;
    this.grados.forEach((_, i) => {
      const valor = +producto['cantidad_' + i] || 0;
      suma += valor;
    });
    producto.total = suma; // Actualiza el total en el array por si lo necesitás
    return suma;
  }


}
