import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule,FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss', '../../styles.scss']
})
export class ProductosComponent {
  // Modal
  title = 'Productos';
  message = 'Este es un mensaje dinámico.';
  cancelButton = true;
  actionButton = true;
  actionButtonText = 'Añadir producto';
  // Data
  rows: any[] = [];
  categorias: any[] = [];
  unidadmedida: any[] = [];
  filteredRows: any[] = [];
  searchTerm = '';
  cancelButtonText = 'Cancelar';
  form!: FormGroup;
  loading = true; // Indicador de carga
  errorMessage = ''; // Manejo de errores

  constructor(private dialog: MatDialog, private fb: FormBuilder, private productosService: ApiService,private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategoria();
    this.obtenerUnidadMedida();
  }

  obtenerProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Productos:', data);
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los productos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      }
    });
  }

  obtenerCategoria() {
    this.productosService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log('Catgoria:', data);
        this.categorias = data;
        // this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los productos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      }
    });
  }

  obtenerUnidadMedida() {
    this.productosService.obtenerUnidadMedida().subscribe({
      next: (data) => {
        console.log('Unidad de Medida:', data);
        this.unidadmedida = data;
        // this.filteredRows = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los productos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      }
    });
  }

  filterProducts() {
    const term = this.searchTerm?.toLowerCase() ?? ''; // Asegurar que no sea undefined
    console.log('Filtrar productos:', this.searchTerm);
    this.filteredRows = this.rows.filter(product =>
      (product.nombre?.toLowerCase() ?? '').includes(term) ||
      (product.descripcion?.toLowerCase() ?? '').includes(term) ||
      (product.marca?.toLowerCase() ?? '').includes(term) ||
      (product.id_categoria?.nombre?.toLowerCase() ?? '').includes(term) || // Asegurar que `id_categoria.nombre` existe
      (product.id_unidad_medida?.nombre?.toLowerCase() ?? '')?.includes(term) // Asegurar que `id_unidad_medida.nombre` existe
    );
  }


  editarProducto(row: any) {
    console.log('Editar producto:', row);
    this.form = this.fb.group({
      nombre: [row.nombre, Validators.required],
      precio_variable: [row.precio_variable, [Validators.required]],
      marca: [row.marca, [Validators.required]],
      id_categoria: [row.id_categoria._id, [Validators.required]],
      id_unidad_medida: [row.id_unidad_medida._id, [Validators.required]],
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '726px',
      disableClose: false,
      data: {
        title: 'Editar Producto',
        columns: 1,
        message: 'Modifica los datos del producto',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: 'Actualizar',
        form: this.form,
        fields: [
          { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
          { label: 'Precio', name: 'precio_variable', type: 'number', placeholder: 'Precio del producto' },
          { label: 'Marca', name: 'marca', type: 'text', placeholder: 'Marca del producto' },
          { label: 'Categoría', name: 'id_categoria', type: 'select',
            options: this.categorias.map(categoria => ({ label: categoria.nombre, value: categoria._id }))
          },
          { label: 'Unidad de medida', name: 'id_unidad_medida', type: 'select',
            options: this.unidadmedida.map(unimed => ({ label: unimed.nombre, value: unimed._id }))
          }
        ],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos editados:', result);
        this.actualizarProducto(row._id, result);
      } else {
        console.log('Edición cancelada');
      }
    });
  }

  actualizarProducto(id: any, data: any) {
    this.productosService.actualizarProducto(id, {
      nombre: data.nombre,
      precio_variable: data.precio_variable,
      marca: data.marca,
      id_categoria: data.id_categoria,
      id_unidad_medida: data.id_unidad_medida
    }).subscribe({
      next: (data) => {
        this.toastr.success('Producto actualizado correctamente', 'Éxito');
        this.obtenerProductos();
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el producto', 'Error');
        console.error('Error al insertar producto:', error);
      }
    });
  }


  eliminarProducto(row: any) {
    console.log('Eliminar producto:', row);
    this.productosService.eliminarProducto(row._id).subscribe({
      next: (data) => {
        console.log('Producto eliminado:', data);
        this.toastr.success('Producto eliminado correctamente', 'Éxito');
        this.obtenerProductos();
      },
      error: (error) => {
      this.toastr.error('Error al eliminar el producto', 'Error');
      console.error('Error al insertar producto:', error);
      }
    });
    // Lógica para eliminar producto
  }

  insertarProducto(data: any) {
    console.log('Insertar producto:', data);
    this.productosService.crearProducto({
      nombre: data.nombre,
      precio_variable: data.precio_variable,
      marca: data.marca,
      id_categoria: data.categoria,
      id_unidad_medida: data.unimed
    }).subscribe({
      next: (data) => {
      console.log('Producto insertado:', data);
      this.toastr.success('Producto insertado correctamente', 'Éxito');
      this.obtenerProductos();
      },
      error: (error) => {
      this.toastr.error('Error al crear el producto', 'Error');
      console.error('Error al insertar producto:', error);
      }
    });
  }


  downloadPrices(item:any){
    console.log(item)
  }


  abrirModal(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio_variable: ['', [Validators.required]],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],  // Ahora es un select
      unimed: ['', Validators.required],  // También select
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
          { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
          { label: 'Precio', name: 'precio_variable', type: 'number', placeholder: 'Precio del producto' },
          { label: 'Marca', name: 'marca', type: 'text', placeholder: 'Marca del producto'},
          {
            label: 'Categoría', name: 'categoria', type: 'select', placeholder: 'Seleccione una categoría',
            options: this.categorias.map(categoria => ({ label: categoria.nombre, value: categoria._id }))
          },
          {
            label: 'Unidad de medida', name: 'unimed', type: 'select', placeholder: 'Seleccione una unidad',
            options: this.unidadmedida.map(unimed => ({ label: unimed.nombre, value: unimed._id }))
          },
        ],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.insertarProducto(result);
      console.log('Acción principal confirmada', result);
      } else {
      console.log('Modal cerrado sin acción');
      }
    });
  }
}

