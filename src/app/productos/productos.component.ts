import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule,FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {
  rows = [
    { id:1 ,nombre: 'Harina de trigo', descripcion: 'Harina blanca refinada, 50 kg', precio: 25, marca: 'Molinos San Juan', categoria: 'Granos', unidad: 'Sacos' },
    { id:2 ,nombre: 'Aceite vegetal', descripcion: 'Aceite comestible, 5 litros', precio: 15, marca: 'Oro Verde', categoria: 'Aceites', unidad: 'Garrafas' },
    { id:3 ,nombre: 'Arroz extra', descripcion: 'Arroz blanco, grano largo, 25 kg', precio: 30, marca: 'La Hacienda', categoria: 'Granos', unidad: 'Sacos' },
    { id:4 ,nombre: 'Pechuga de pollo', descripcion: 'Pechuga sin hueso, congelada', precio: 45, marca: 'Pollos Don Juan', categoria: 'Carnes', unidad: 'Cajas' },
    { id:5 ,nombre: 'Leche entera', descripcion: 'Leche líquida pasteurizada, 1 litro', precio: 1.5, marca: 'Lácteos Del Valle', categoria: 'Lácteos', unidad: 'Litros' }
  ];
  filteredRows = [...this.rows]; // Copia inicial de los datos
  searchTerm = '';

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
}

