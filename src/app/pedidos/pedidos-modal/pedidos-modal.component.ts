// pedidos-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-pedidos-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './pedidos-modal.component.html',
  styleUrls: ['./pedidos-modal.component.scss']
})
export class PedidosModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PedidosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

imprimirPDF(): void {
  const pedido = this.data;

  // Paso 1: obtener todos los grados únicos
  const gradosUnicos: string[] = Array.from(
    new Set(
      pedido.dias.flatMap((dia: any) =>
        dia.detalles.map((d: any) => d.id_grado?.id_grado?.nombre)
      ).filter(Boolean)
    )
  );

  const docDefinition: any = {
    content: [
      { text: 'Detalle del Pedido', style: 'header' },
      {
        margin: [0, 10],
        ul: [
          `Escuela: ${pedido.id_escuela?.nombre}`,
          `NIT: ${pedido.id_escuela?.nit}`,
         // `Razón social: ${pedido.id_escuela?.razon_social}`,
         // `Usuario: ${pedido.id_usuario?.nombre}`,
         // `Correo: ${pedido.id_usuario?.correo}`,
          `Fecha de Inicio: ${new Date(pedido.fecha_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          `Fecha de Finalización: ${new Date(pedido.fecha_fin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          `Total de Productos: ${pedido.total}`
        ]
      },
      { text: 'Días del Pedido', style: 'subheader' },

      // Paso 2: sección por día
      ...pedido.dias.map((dia: any, index: number) => {
        // Agrupar por producto
        const productosAgrupados: {
          [key: string]: {
            producto: string;
            unidad: string;
            grados: { [grado: string]: number };
            total: number;
          };
        } = {};

        for (const detalle of dia.detalles) {
          const key = detalle.id_producto?._id;
          const nombre = detalle.id_producto?.nombre || 'N/A';
          const unidad = detalle.unidad_medida?.nombre || 'N/A';
          const grado = detalle.id_grado?.id_grado?.nombre || 'N/A';
          const cantidad = detalle.cantidad;

          if (!productosAgrupados[key]) {
            productosAgrupados[key] = {
              producto: nombre,
              unidad,
              grados: {},
              total: 0
            };
          }

          productosAgrupados[key].grados[grado] = (productosAgrupados[key].grados[grado] || 0) + cantidad;
          productosAgrupados[key].total += cantidad;
        }

        const encabezado = [
  'Producto',
  ...gradosUnicos.map(g => ({ text: g, noWrap: true, style: 'tableHeader' })),
  'Unidad',
  'Total'
];

        const filas = Object.values(productosAgrupados).map((p) => [
          p.producto,
          ...gradosUnicos.map(g => p.grados[g] || ''),
          p.unidad,
          p.total
        ]);

        return [
          { text: `Día ${index + 1} - ${dia.fecha}`, style: 'dayHeader' },
          {
            table: {
              headerRows: 1,
widths: [
  '30%',                         // Producto
  ...gradosUnicos.map(() => '16%'), // Cada grado
  '10%',                         // Unidad
  '10%'                          // Total
],



              body: [
                encabezado.map(h => ({ text: h, style: 'tableHeader' })),
                ...filas.map(row =>
                  row.map(cell => ({
                    text: cell.toString(),
                    style: 'cell',
                    alignment: 'center'
                  }))
                )
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => (rowIndex === 0 ? '#BBDEFB' : null)
            },
            margin: [0, 5, 0, 10]
          }
        ];
      }).flat()
    ],
    styles: {
      header: { fontSize: 18, bold: true, color: '#1565C0', marginBottom: 10 },
      subheader: { fontSize: 16, bold: true, marginTop: 15, color: '#0D47A1' },
      dayHeader: { fontSize: 14, bold: true, marginTop: 10, color: '#1E88E5' },
      tableHeader: { bold: true, fillColor: '#E3F2FD', color: 'black', alignment: 'center' },
      cell: { fontSize: 10 }
    }
  };

  pdfMake.createPdf(docDefinition).download(`Pedido_${pedido.id_escuela?.nombre || 'escuela'}.pdf`);
}


}
