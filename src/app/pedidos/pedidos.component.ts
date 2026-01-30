import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogComponent } from '../components/modal-dialog/modal-dialog.component';
import { ModalDialogPedidoComponent } from '../components/modal-dialog-pedido/modal-dialog-pedido.component';
import { ToastrService } from 'ngx-toastr';
import { PedidosModalComponent } from './pedidos-modal/pedidos-modal.component';
import { LoaderService } from '../services/loader.service';

// // ✅ Importar pdfMake y fuentes de forma compatible con Vite
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// // ✅ Asignar fuentes virtuales correctamente
// (pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  title = 'Pedidos';
  searchTerm = '';
  rows: any[] = [];
  rowsEscuelas: any[] = [];
  rowsProductos: any[] = [];
  filteredRows: any[] = [];
  grados: { id: any; nombre: any }[] = [];
  loading = true;
  errorMessage = '';
  form!: FormGroup;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  isSwitchOn = false;
  private pdfMake: any | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.obtenerPedidos();
    this.obtenerEscuelas();
    this.obtenerProductos();
  }

  formatearFechaLarga(fecha: Date): string {
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return fecha.toLocaleDateString('es-ES', opciones);
  }

  private async loadPdfMake() {
    if (typeof window === 'undefined') return null; // SSR guard

    if (this.pdfMake) return this.pdfMake;

    const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
    const pdfFontsModule: any = await import('pdfmake/build/vfs_fonts');

    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    // OJO: dependiendo del build, vfs puede venir en pdfFonts.pdfMake.vfs
    pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;

    this.pdfMake = pdfMake;
    return pdfMake;
  }

  async descargarProductos() {
    const pdfMake = await this.loadPdfMake();
    if (!pdfMake) return;

    if (!this.fechaInicio || !this.fechaFin) {
      this.toastr.error('Por favor selecciona fechas válidas', 'Error');
      return;
    }

    const fechaInicioStr = new Date(this.fechaInicio)
      .toISOString()
      .slice(0, 10);
    const fechaFinStr = new Date(this.fechaFin).toISOString().slice(0, 10);

    this.apiService.getPedidosFechas(fechaInicioStr, fechaFinStr).subscribe({
      next: (productos) => {
        if (!productos || productos.length === 0) {
          this.toastr.warning(
            'No se encontraron productos en ese rango de fechas.',
            'Sin datos',
          );
          return;
        }

        // Construir tabla
        const tablaBody = [
          ['Producto', 'Unidad', 'Cantidad'],
          ...productos.map((p) => [
            p.producto,
            p.unidad,
            Number.isInteger(p.cantidad_total)
              ? p.cantidad_total.toString()
              : p.cantidad_total.toFixed(2),
          ]),
        ];

        // Definir PDF
        const docDefinition: any = {
          content: [
            {
              text: 'Lista de Ingredientes',
              style: 'header',
              alignment: 'center',
            },
            {
              text: `De: ${this.formatFecha(fechaInicioStr)} - ${this.formatFecha(fechaFinStr)}`,

              alignment: 'center',
              margin: [0, 0, 0, 10],
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto'],
                body: tablaBody,
              },
              layout: 'lightHorizontalLines',
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              color: '#2E7D32',
              margin: [0, 0, 0, 10],
            },
          },
        };

        pdfMake
          .createPdf(docDefinition)
          .download(
            `Lista_Ingredientes_${fechaInicioStr}_a_${fechaFinStr}.pdf`,
          );
      },
      error: () => {
        this.toastr.error('Error al obtener los productos', 'Error');
      },
    });
  }

  formatFecha(fecha: string) {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  toggleSwitch() {
  }

  // 🔹 Obtener pedidos desde la API
  obtenerPedidos() {
    this.loader.show();
    this.apiService.obtenerPedidoCompleto().subscribe({
      next: (data) => {
        this.rows = data;
        this.filteredRows = [...data];
        this.loading = false;
          this.loader.hide();
      },
      error: (error) => {
        this.loader.hide();
        this.errorMessage = 'Error al obtener los pedidos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  obtenerProductos() {
    this.apiService.obtenerProductos().subscribe({
      next: (data) => {
        this.rowsProductos = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los pedidos';
        console.error('Error en la consulta:', error);
        this.loading = false;
      },
    });
  }

  getGrados(idEscuela: string = ''): Promise<{ id: any; nombre: any }[]> {

    return new Promise((resolve, reject) => {
      this.apiService.obtenerGradoEscuela(idEscuela).subscribe({
        next: (data) => {
          const grados = Array.isArray(data.grados)
            ? data.grados.map((grado: any) => ({
                id: grado.id,
                nombre: grado.nombre,
              }))
            : [];

          resolve(grados); // ✅ devolvemos los grados ya cargados
        },
        error: (error) => {
          console.error('Error al obtener grados:', error);
          this.toastr.error('Error al obtener grados', 'Error');
          reject(error); // ❌ en caso de error
        },
      });
    });
  }

  // 🔹 Filtrar pedidos en la tabla
  filterPedidos() {
    const term = this.searchTerm?.toLowerCase() ?? '';
    this.filteredRows = this.rows.filter(
      (pedido) =>
        (pedido.escuela?.toLowerCase() ?? '').includes(term) ||
        (pedido.grado?.toLowerCase() ?? '').includes(term) ||
        (pedido.fecha_pedido ?? '').includes(term),
    );
  }

  // 🔹 Ver detalles de un pedido
  verDetalle(pedido: any): void {
    this.dialog.open(PedidosModalComponent, {
      width: '90vw', // ✅ 90% del ancho de la ventana
      maxWidth: '95vw', // 🔹 Para asegurarte de que no lo restrinja el maxWidth default
      panelClass: 'wide-modal', // Opcional: aplicar estilos adicionales
      data: pedido,
    });
  }

  obtenerEscuelas() {
    this.apiService.obtenerEscuelas().subscribe({
      next: (data) => {
        this.rowsEscuelas = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las escuelas';
        console.error('Error en la consulta:', error);
      },
    });
  }

  abrirModal(pedido: any = null): void {
    const dialogRef = this.dialog.open(ModalDialogPedidoComponent, {
      maxWidth: 'none', // 🔹 Permite que el diálogo tome el tamaño definido en width
      width: '80vh', // 🔹 El 90% del ancho de la ventana
      height: '90vh', // 🔹 El 80% del alto de la ventana
      disableClose: false,
      data: {
        title: pedido ? 'Editar Pedido' : 'Agregar Pedido',
        message: 'Ingrese los datos del pedido',
        showCancelButton: true,
        columns: 2,
        pedidoEdit: pedido || null,
        cancelButtonText: 'Cancelar',
        showActionButton: true,
        actionButtonText: pedido ? 'Actualizar' : 'Guardar',
        escuelas: this.rowsEscuelas,
        productos: this.rowsProductos,
        buscarGradosPorEscuela: (idEscuela: string) =>
          this.getGrados(idEscuela),
        grados: ['Grado 1', 'Grado 2', 'Grado 3'], // Simulación de grados
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result) {
          // Actualizar pedido existente
          this.obtenerPedidos();
        }
      }
    });
  }

  // 🔹 Agregar un nuevo pedido a la API
  agregarPedido(nuevoPedido: any) {
    this.apiService.crearPedido(nuevoPedido).subscribe({
      next: () => {
        this.obtenerPedidos();
      },
      error: (error) => {
        console.error('Error al agregar pedido:', error);
      },
    });
  }

  // 🔹 Actualizar un pedido en la API
  actualizarPedido(id: string, pedido: any) {
    this.apiService.actualizarPedido(id, pedido).subscribe({
      next: () => {
        this.obtenerPedidos();
      },
      error: (error) => {
        console.error('Error al actualizar pedido:', error);
      },
    });
  }

  // 🔹 Eliminar un pedido de la API
  eliminarPedido(pedido: any) {
    if (
      confirm(
        `¿Seguro que deseas eliminar el pedido de la escuela "${pedido.escuela}"?`,
      )
    ) {
      this.apiService.eliminarPedido(pedido._id).subscribe({
        next: () => {
          this.obtenerPedidos();
        },
        error: (error) => {
          console.error('Error al eliminar pedido:', error);
        },
      });
    }
  }
  // 🔹 Función para generar PDF de un pedido
  async generarPDF(pedido: any): Promise<void> { // 🔍 Verifica si esto aparece
    const pdfMake = await this.loadPdfMake();
    if (!pdfMake) return;

    if (!pedido || !Array.isArray(pedido.dias)) {
      console.error('Pedido inválido o sin días');
      return;
    }

    const docDefinition = {
      content: [
        { text: 'Detalle del Pedido', style: 'header' },
        {
          margin: [0, 10],
          ul: [
            `Escuela: ${pedido.id_escuela?.nombre}`,
            `NIT: ${pedido.id_escuela?.nit}`,
            `Razón social: ${pedido.id_escuela?.razon_social}`,
            `Usuario: ${pedido.id_usuario?.nombre}`,
            `Correo: ${pedido.id_usuario?.correo}`,
            `Fecha de Inicio: ${new Date(pedido.fecha_inicio).toLocaleDateString()}`,
            `Fecha de Finalización: ${new Date(pedido.fecha_fin).toLocaleDateString()}`,
            `Total de Productos: ${pedido.total}`,
          ],
        },
        { text: 'Días del Pedido:', style: 'subheader' },
        ...pedido.dias
          .map((dia: any) => [
            { text: `Fecha: ${dia.fecha}`, style: 'fechaDia' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', 'auto', 'auto'],
                body: [
                  ['Producto', 'Grado', 'Cantidad', 'Unidad'],
                  ...dia.detalles.map((detalle: any) => [
                    detalle.id_producto?.nombre || 'N/A',
                    detalle.id_grado?.id_grado?.nombre || 'N/A',
                    detalle.cantidad,
                    detalle.unidad_medida?.nombre || 'N/A',
                  ]),
                ],
              },
              layout: 'lightHorizontalLines',
              margin: [0, 0, 0, 10],
            },
          ])
          .flat(),
      ],
      styles: {
        header: { fontSize: 18, bold: true, color: '#1A20B6' },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 0],
          color: '#1D24CA',
        },
        fechaDia: { bold: true, color: '#D91E36', margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(docDefinition as any).download('Lista_Compras.pdf');
  }
}
