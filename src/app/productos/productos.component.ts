import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';


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
  filteredRows: any[] = [];
  searchTerm = '';
  cancelButtonText = 'Cancelar';
  form!: FormGroup;
  loading = true; // Indicador de carga
  errorMessage = ''; // Manejo de errores

  constructor(private dialog: MatDialog, private fb: FormBuilder, private productosService: ApiService) {}

  ngOnInit() {
    this.obtenerProductos();
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
    // Lógica para editar producto
  }

  eliminarProducto(row: any) {
    console.log('Eliminar producto:', row);
    // Lógica para eliminar producto
  }

  abrirModal(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', [Validators.required]],
      marca: [0, [Validators.required]],
      categoria: [0, [Validators.required]],
      unimed: [0, [Validators.required]],
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
          { label: 'Precio', name: 'precio', type: 'number', placeholder: 'Precio del producto' },
          { label: 'Marca', name: 'marca', type: 'text', placeholder: 'Marca del producto' },
          { label: 'Categoría', name: 'categoria', type: 'select',  },
          { label: 'Unidad de medida', name: 'unimed', type: 'select' },
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
}

