import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {
  rows = [
    { nombre: 'Harina de trigo', descripcion: 'Harina blanca refinada, 50 kg', precio: 25, marca: 'Molinos San Juan', categoria: 'Granos', unidad: 'Sacos' },
    { nombre: 'Aceite vegetal', descripcion: 'Aceite comestible, 5 litros', precio: 15, marca: 'Oro Verde', categoria: 'Aceites', unidad: 'Garrafas' },
    { nombre: 'Arroz extra', descripcion: 'Arroz blanco, grano largo, 25 kg', precio: 30, marca: 'La Hacienda', categoria: 'Granos', unidad: 'Sacos' },
    { nombre: 'Pechuga de pollo', descripcion: 'Pechuga sin hueso, congelada', precio: 45, marca: 'Pollos Don Juan', categoria: 'Carnes', unidad: 'Cajas' },
    { nombre: 'Leche entera', descripcion: 'Leche líquida pasteurizada, 1 litro', precio: 1.5, marca: 'Lácteos Del Valle', categoria: 'Lácteos', unidad: 'Litros' }
  ];

  editarProducto(row: any) {
    console.log('Editar producto:', row);
    // Lógica para editar producto
  }

  eliminarProducto(row: any) {
    console.log('Eliminar producto:', row);
    // Lógica para eliminar producto
  }
}

