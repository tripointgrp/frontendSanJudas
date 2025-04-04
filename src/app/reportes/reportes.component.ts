import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  reportes = [
    {
      fecha: '2025-04-01',
      tipo: 'Ventas',
      descripcion: 'Venta de productos varios',
      total: 320.50
    },
    {
      fecha: '2025-04-02',
      tipo: 'Inventario',
      descripcion: 'Ingreso de stock nuevo',
      total: 0
    },
    {
      fecha: '2025-04-03',
      tipo: 'Usuarios',
      descripcion: 'Nuevos registros',
      total: 5
    }
  ];
}
