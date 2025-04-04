import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface ProductoAgrupado {
  producto: string;
  unidad: string;
  precio_unitario: number;
  grados: { [nombreGrado: string]: number };
  cantidad_total: number;
  subtotal: number;
}

@Component({
  selector: 'app-presupuestos-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './presupuestos-modal.component.html',
  styleUrl: './presupuestos-modal.component.scss'
})
export class PresupuestosModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PresupuestosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
totalCalculado: number = 0;

ngOnInit(): void {
  if (this.data && this.data.dias) {
    this.data.dias = this.data.dias.map((dia: any) => {
      return {
        ...dia,
        productosAgrupados: this.agruparPorProducto(dia.detalles)
      };
    });

    this.totalCalculado = this.data.dias.reduce(
      (sum: number, dia: any) => sum + (dia.total_dia || 0),
      0
    );
  } else {
    this.totalCalculado = 0;
  }
}


  cerrar(): void {
    this.dialogRef.close();
  }

  getGradosUnicos(detalles: any[]): string[] {
    const grados = detalles.map(d => d.id_grado?.id_grado?.nombre).filter(Boolean);
    return Array.from(new Set(grados));
  }

  agruparPorProducto(detalles: any[]): ProductoAgrupado[] {
    const grouped: { [idProducto: string]: ProductoAgrupado } = {};

    for (const detalle of detalles) {
      const idProd = detalle.id_producto._id;
      const nombreProd = detalle.id_producto.nombre;
      const unidad = detalle.unidad_medida?.nombre;
      const precioUnitario = detalle.precio_unitario;
      const gradoNombre = detalle.id_grado?.id_grado?.nombre;
      const cantidad = detalle.cantidad_comprada;

      if (!grouped[idProd]) {
        grouped[idProd] = {
          producto: nombreProd,
          unidad: unidad,
          precio_unitario: precioUnitario,
          grados: {},
          cantidad_total: 0,
          subtotal: 0
        };
      }

      grouped[idProd].grados[gradoNombre] = (grouped[idProd].grados[gradoNombre] || 0) + cantidad;
      grouped[idProd].cantidad_total += cantidad;
    }

    // Calcular subtotal
    Object.values(grouped).forEach(prod => {
      prod.subtotal = prod.precio_unitario * prod.cantidad_total;
    });

    return Object.values(grouped);
  }


}
