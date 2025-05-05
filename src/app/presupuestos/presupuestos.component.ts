import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PresupuestosModalComponent } from './presupuestos-modal/presupuestos-modal.component';
import { ModaDialogPresupuestosComponent } from '../components/moda-dialog-presupuestos/moda-dialog-presupuestos.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// ✅ Asignar fuentes virtuales correctamente
(pdfMake as any).vfs = pdfFonts.vfs;
@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  title = 'Presupuestos';
    searchTerm = '';
    rows: any[] = [];
    rowsEscuelas: any[] = [];
    rowsProductos: any[] = [];
    filteredRows: any[] = [];
    grados: { id: any; nombre: any }[] = [];
    loading = true;
    errorMessage = '';
    form!: FormGroup;
    constructor(
      private apiService: ApiService,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private toastr: ToastrService
    ) {}

    ngOnInit() {
      this.obtenerPedidos();
      this.obtenerEscuelas();
      this.obtenerProductos();
    }

    // 🔹 Obtener pedidos desde la API
    obtenerPedidos() {
      this.apiService.obtenerPresupuestosSemanal().subscribe({
        next: (data) => {
          console.log('Pedidos obtenidos:', data);
          this.rows = data;
          this.filteredRows = [...data];
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al obtener los pedidos';
          console.error('Error en la consulta:', error);
          this.loading = false;
        },
      });
    }

    obtenerProductos() {
      this.apiService.obtenerProductos().subscribe({
        next: (data) => {
          console.log('Productos obtenidos:', data);
          this.rowsProductos = data;
          console.log(this.rowsProductos);
        },
        error: (error) => {
          this.errorMessage = 'Error al obtener los pedidos';
          console.error('Error en la consulta:', error);
          this.loading = false;
        },
      });
    }

    getGrados(idEscuela: string = ''): Promise<{ id: any; nombre: any }[]> {
      console.log('ID Escuela:', idEscuela);

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
          (pedido.fecha_pedido ?? '').includes(term)
      );
    }

    // 🔹 Ver detalles de un pedido
    verDetalle(pedido: any): void {
      console.log('Detalles del pedido:', pedido);
      this.dialog.open(PresupuestosModalComponent, {
        width: '90vw', // ✅ 90% del ancho de la ventana
        maxWidth: '95vw', // 🔹 Para asegurarte de que no lo restrinja el maxWidth default
        panelClass: 'wide-modal', // Opcional: aplicar estilos adicionales
        data: pedido,
      });


    }


    obtenerEscuelas() {
      this.apiService.obtenerEscuelas().subscribe({
        next: (data) => {
          console.log('Escuelas obtenidas:', data);
          this.rowsEscuelas = data;
        },
        error: (error) => {
          this.errorMessage = 'Error al obtener las escuelas';
          console.error('Error en la consulta:', error);
        },
      });
    }

    abrirModal(pedido: any = null): void {
      console.log('antes de entrar', this.rowsProductos)
      const dialogRef = this.dialog.open(ModaDialogPresupuestosComponent, {
        maxWidth: 'none', // 🔹 Permite que el diálogo tome el tamaño definido en width
        width: '80vh', // 🔹 El 90% del ancho de la ventana
        height: '90vh', // 🔹 El 80% del alto de la ventana
        disableClose: false,
        data: {
          title: pedido ? 'Editar Presupuesto' : 'Agregar Presupuesto',
          message: 'Ingrese los datos del presupuesto',
          showCancelButton: true,
          columns: 2,
          cancelButtonText: 'Cancelar',
          showActionButton: true,
          actionButtonText: pedido ? 'Actualizar' : 'Guardar',
          escuelas: this.rowsEscuelas,
          productos: this.rowsProductos,
          buscarGradosPorEscuela: (idEscuela: string) => this.getGrados(idEscuela),
          grados: ['Grado 1', 'Grado 2', 'Grado 3'], // Simulación de grados
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Pedido guardado:', result);
          if (pedido) {
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
          `¿Seguro que deseas eliminar el pedido de la escuela "${pedido.escuela}"?`
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



    generarPDF(row: any): void {
      // Asegúrate de que los datos del row están bien definidos
      const escuela = row.id_escuela ? row.id_escuela.nombre : 'N/A';
      const nit = row.id_escuela ? row.id_escuela.nit : 'N/A';
      const razonSocial = row.id_escuela ? row.id_escuela.razon_social : 'N/A';
      const fechaInicio = new Date(row.fecha_inicio).toLocaleDateString();
      const fechaFin = new Date(row.fecha_fin).toLocaleDateString();
      const usuario = row.id_usuario ? row.id_usuario.nombre : 'N/A';
      const correoUsuario = row.id_usuario ? row.id_usuario.correo : 'N/A';
      const totalPresupuesto = row.total.toFixed(2);

      const diasContent = row.dias.map((dia: any) => {
        // Extraer los detalles de productos por día
        const productos = dia.detalles || [];

        return {
          text: `📌 Fecha: ${dia.fecha}`,
          style: 'fechaDia',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Producto', 'Cantidad', 'Unidad', 'Precio Unitario', 'Subtotal'],
              ...productos.map((producto: any) => [
                producto.id_producto?.nombre || 'N/A', // Nombre del producto
                producto.cantidad_comprada || '0',     // Cantidad comprada
                producto.unidad_medida?.nombre || 'N/A', // Unidad de medida
                producto.precio_unitario || '0',       // Precio unitario
                producto.subtotal || '0',              // Subtotal
              ])
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        };
      });



      // Definición del contenido del PDF
      const docDefinition = {
        content: [
          { text: '📋 Detalle del Presupuesto', style: 'header' },
          {
            margin: [0, 10],
            ul: [
              `Escuela: ${escuela}`,
              `NIT: ${nit}`,
              `Razón social: ${razonSocial}`,
              `Usuario: ${usuario}`,
              `Correo: ${correoUsuario}`,
              `Fecha de Inicio: ${fechaInicio}`,
              `Fecha de Finalización: ${fechaFin}`,
              `Total del Presupuesto: ${totalPresupuesto}`
            ]
          },
          { text: '📅 Días del Presupuesto', style: 'subheader' },
          ...diasContent  // Añadir los días con los productos
        ],
        styles: {
          header: { fontSize: 18, bold: true, color: '#1A20B6' },
          subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 0] as [number, number, number, number], color: '#1D24CA' },
          fechaDia: { bold: true, color: '#000000', margin: [0, 10, 0, 5] as [number, number, number, number] }  // Cambiado a color negro
        }
      };

      // Crear y descargar el PDF
      pdfMake.createPdf(docDefinition).download('detalle-presupuesto.pdf');
    }




}
