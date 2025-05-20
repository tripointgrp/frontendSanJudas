import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../../../components/modal-dialog/modal-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-grados-presupuesto',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './grados-presupuesto.component.html',
  styleUrl: './grados-presupuesto.component.scss'
})
export class GradosPresupuestoComponent {
  idGradoEscuela: any[] = [];
  title = 'Escuelas';
  searchTerm = '';
  rows: any[] = [];
  filteredRows: any[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;
  rowsGrados: any[] = [];
  idescuela: any;
  escuela: string = '';
  dataInfo: any;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const escuelaId = this.route.snapshot.paramMap.get('id');
    this.idescuela = escuelaId;
    this.escuela = escuelaId?.toString() || '';
    this.obtenerEscuelas(escuelaId);
    this.obtenerGrados(escuelaId);
    this.dataInfo = this.authService.getUserData()?.tipo_usuario
    const id = this.route.snapshot.paramMap.get('id');
    const ids = id ? id.split(',') : [];
    this.idGradoEscuela = ids
    console.log(this.idGradoEscuela); // Aquí puedes ver los IDs separados en un array
    // Aquí puedes agregar la lógica que necesites al inicializar el componente
  }

  // 🔹 Obtener escuelas desde la API
  obtenerEscuelas(_id: any) {
    console.log('ID Escuela:', _id);
    const id = _id ? _id.split(',') : [];
    console.log('ID Escuela:', id[0]);
    this.apiService.getPresupuestosGrados(id[1]).subscribe({
      next: (data) => {
        console.log('prespuestos obtenidas:', data);
        this.rows = data.presupuestos_por_grado
        this.filteredRows = [...data.presupuestos_por_grado
        ];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las escuelas';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  obtenerGrados(_id: any) {
    const id = _id ? _id.split(',') : [];
    console.log('ID Escuela:', id[0]);
    this.apiService.obtenerGradoEscuela(id[0]).subscribe({
      next: (data) => {
        console.log('Grados obtenidos:', data.grados);
        this.rowsGrados = data.grados;
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
      id_presupuesto_escuela: [this.idGradoEscuela[1], Validators.required],
      id_escuela_grado: ['', Validators.required],
      // mes: [escuela?.mes, Validators.required],
      // anio: [escuela?.anio, Validators.required],
      monto: [escuela?.monto, Validators.required],
    });

    const meses = [
      { value: 1, label: 'Enero' },
      { value: 2, label: 'Febrero' },
      { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Mayo' },
      { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' },
      { value: 11, label: 'Noviembre' },
      { value: 12, label: 'Diciembre' },
    ];

    // Generar dinámicamente los años desde el actual hasta 10 años adelante
    const currentYear = new Date().getFullYear();
    const anios = Array.from({ length: 11 }, (_, i) => ({
      value: currentYear + i,
      label: (currentYear + i).toString(),
    }));

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: escuela ? 'Editar Presupuesto' : 'Agregar Presupuesto',
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
            name: 'id_escuela_grado',
            type: 'select',
            options: this.rowsGrados.map((grado) => ({
              value: grado.id,
              label: grado.nombre,
            })),
            placeholder: 'Seleccione un grado',
          },
          // {
          //   label: 'Mes',
          //   name: 'mes',
          //   type: 'select',
          //   options: meses,
          //   placeholder: 'Seleccione un mes',
          // },
          // {
          //   label: 'Año',
          //   name: 'anio',
          //   type: 'select',
          //   options: anios,
          //   placeholder: 'Seleccione un año',
          // },
          { label: 'Monto', name: 'monto', type: 'number', placeholder: 'Monto Mensual' },
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
    this.apiService.savePresupuestoGrado(nuevaEscuela).subscribe({
      next: () => {
        this.toast.success('Presupuesto agregado correctamente al grado', 'Éxito');
        this.obtenerEscuelas(this.escuela);
      },
      error: (error) => {
        if (error?.error) {
          let errorMsg = '';
          if (typeof error.error === 'string') {
            errorMsg = error.error;
          } else if (typeof error.error === 'object') {
            errorMsg = JSON.stringify(error.error, null, 2)
              .replace(/[{}"]/g, '')
              .replace(/,/g, '\n')
              .replace(/\\n/g, '\n')
              .trim();
          } else {
            errorMsg = 'Ocurrió un error inesperado.';
          }
          this.toast.error(errorMsg, 'Error');
        } else {
          console.error('Error al agregar escuela:', error);
        }
      },
    });
  }

  // 🔹 Actualizar una escuela en la API
  actualizarEscuela(id: string, escuela: any) {
    // this.apiService.actualizarEscuela(id, escuela).subscribe({
    //   next: () => {
    //     this.toast.success('Escuela actualizada correctamente', 'Éxito');
    //     // this.obtenerEscuelas();
    //   },
    //   error: (error) => {
    //     console.error('Error al actualizar escuela:', error);
    //   },
    // });
  }

  // 🔹 Eliminar una escuela de la API
  eliminarEscuela(escuela: any) {
    console.log('Eliminar escuela:', escuela);
    if (
      confirm(`¿Seguro que deseas eliminar el grado "${escuela.nombre}"?`)
    ) {
      this.apiService.deletePresupuestoGrado(escuela._id).subscribe({
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
    const concatenatedData = `${this.idescuela},${escuela.id}`;
    console.log('Concatenated Data:', concatenatedData);
    this.router.navigate([`/grados-presupuesto/${concatenatedData}`]);
  }

}
