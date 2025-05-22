import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;
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
  ) { }
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

  getTotalesPorGrado(detalles: any[]): { [grado: string]: number } {
    const totales: { [grado: string]: number } = {};

    for (const detalle of detalles) {
      const grado = detalle.nombre_grado;
      const subtotal = detalle.cantidad_comprada * detalle.precio_unitario;

      totales[grado] = (totales[grado] || 0) + subtotal;
    }

    return totales;
  }

imprimirPDF() {
  const grados = this.getGradosUnicosDesdeTodosLosDias();
  let totalPreprimaria = 0;
  let totalPrimaria = 0;

  const docDefinition: any = {
    content: [
      {
        text: 'Detalle del Presupuesto',
        style: 'titulo',
        margin: [0, 0, 0, 10]
      },
      {
        ul: [
          `Escuela: ${this.data.id_escuela?.nombre}`,
          `NIT: ${this.data.id_escuela?.nit}`,
          //`Razón social: ${this.data.id_escuela?.razon_social}`,
          //`Usuario: ${this.data.id_usuario?.nombre}`,
          //`Correo: ${this.data.id_usuario?.correo}`,
          `Fecha de Inicio: ${this.formatearFecha(this.data.fecha_inicio)}`,
          `Fecha de Finalización: ${this.formatearFecha(this.data.fecha_fin)}`,
          `Total General: Q ${this.data.total.toFixed(2)}`
        ]
      },
      ...this.data.dias.map((dia: any, index: number) => {
        const encabezado = ['Producto', 'Unidad', ...grados, 'Precio Unitario', 'Cantidad Total', 'Total Producto'];
        const filas = dia.productosAgrupados.map((prod: any) => {
          const fila = [
            prod.producto,
            prod.unidad,
            ...grados.map((g: string) => prod.grados[g] || '-'),
            `Q ${prod.precio_unitario.toFixed(2)}`,
            prod.cantidad_total,
            `Q ${prod.subtotal.toFixed(2)}`
          ];

          // Suma por grado
          grados.forEach(g => {
            const valor = prod.grados[g] || 0;
            if (g.toLowerCase().includes('pre')) {
              totalPreprimaria += valor * prod.precio_unitario;
            } else {
              totalPrimaria += valor * prod.precio_unitario;
            }
          });

          return fila;
        });

        return [
          {
            text: `Día ${index + 1} - ${dia.fecha}`,
            style: 'subheader',
            margin: [0, 10, 0, 5],
          },
          {
            table: {
              headerRows: 1,
              widths: [100, 60, ...grados.map(() => 60), 60, 60, 70],
              body: [
                encabezado.map(h => ({ text: h, style: 'tableHeader' })),
                ...filas.map((fila: any[]) =>
                  fila.map(cell => ({
                    text: cell.toString(),
                    style: 'cell',
                    alignment: 'center',
                     noWrap: false 
                  }))
                )
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => (rowIndex === 0 ? '#e3f2fd' : null),
              hLineWidth: () => 0.8,
              vLineWidth: () => 0.8,
              hLineColor: () => '#90caf9',
              vLineColor: () => '#90caf9',
            }
          },
          {
            text: `Total del Día: Q ${dia.total_dia.toFixed(2)}`,
            alignment: 'right',
            bold: true,
            margin: [0, 5, 0, 10]
          }
        ];
      }).flat(),

      // 🔹 Totales por grado
      {
        text: 'Totales Grado',
        style: 'subheader',
        margin: [0, 20, 0, 5],
      },
      {
        columns: [
          {
            text: `Pre-Primaria: Q ${totalPreprimaria.toFixed(2)}`,
            style: 'totalGrado',
          },
          {
            text: `Primaria: Q ${totalPrimaria.toFixed(2)}`,
            style: 'totalGrado',
            alignment: 'right',
          },
        ]
      },
      {
        text: `Total General Q ${(totalPreprimaria + totalPrimaria).toFixed(2)}`,
        style: 'totalGeneral',
        margin: [0, 10, 0, 0],
      }
    ],
    styles: {
      titulo: {
        fontSize: 18,
        bold: true,
        color: '#1565C0',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        color: '#0D47A1'
      },
      tableHeader: {
        bold: true,
        fillColor: '#BBDEFB',
        fontSize: 11
      },
      cell: {
        fontSize: 10
      },
      totalGrado: {
        bold: true,
        fontSize: 11,
        color: '#000'
      },
      totalGeneral: {
        bold: true,
        fontSize: 13,
        alignment: 'center',
        color: '#2E7D32'
      }
    }
  };

  pdfMake.createPdf(docDefinition).download('Presupuesto.pdf');
}




formatearFecha(fecha: any): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


getGradosUnicosDesdeTodosLosDias(): string[] {
  const gradosSet = new Set<string>();
  this.data.dias.forEach((dia: any) => {
    dia.detalles?.forEach((det: any) => {
      const nombre = det.id_grado?.id_grado?.nombre;
      if (nombre) gradosSet.add(nombre);
    });
  });
  return Array.from(gradosSet);
}


}
