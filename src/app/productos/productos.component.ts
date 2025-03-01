import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


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
  rows = [
    { id:1 ,nombre: 'Harina de trigo', descripcion: 'Harina blanca refinada, 50 kg', precio: 25, marca: 'Molinos San Juan', categoria: 'Granos', unidad: 'Sacos' },
    { id:2 ,nombre: 'Aceite vegetal', descripcion: 'Aceite comestible, 5 litros', precio: 15, marca: 'Oro Verde', categoria: 'Aceites', unidad: 'Garrafas' },
    { id:3 ,nombre: 'Arroz extra', descripcion: 'Arroz blanco, grano largo, 25 kg', precio: 30, marca: 'La Hacienda', categoria: 'Granos', unidad: 'Sacos' },
    { id:4 ,nombre: 'Pechuga de pollo', descripcion: 'Pechuga sin hueso, congelada', precio: 45, marca: 'Pollos Don Juan', categoria: 'Carnes', unidad: 'Cajas' },
    { id:5 ,nombre: 'Leche entera', descripcion: 'Leche líquida pasteurizada, 1 litro', precio: 1.5, marca: 'Lácteos Del Valle', categoria: 'Lácteos', unidad: 'Litros' }
  ];
  filteredRows = [...this.rows]; // Copia inicial de los datos
  searchTerm = '';
  cancelButtonText = 'Cancelar';
  form!: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(product =>
      product.nombre.toLowerCase().includes(term) ||
      product.descripcion.toLowerCase().includes(term) ||
      product.marca.toLowerCase().includes(term) ||
      product.categoria.toLowerCase().includes(term)
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

