import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule],
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.scss']
})
export class EscuelasComponent {
  rows = [
    { nombre: 'Escuela Primaria Central', alias: 'EPC', nit: '1234567-8', razonSocial: 'Primaria Central, S.A.' },
    { nombre: 'Colegio Los Pinos', alias: 'CLP', nit: '7654321-0', razonSocial: 'Educación Pinos, S.A.' },
    { nombre: 'Instituto Galileo', alias: 'IG', nit: '1122334-5', razonSocial: 'Instituto Galileo, S.A.' },
    { nombre: 'Academia del Futuro', alias: 'ADF', nit: '9988776-5', razonSocial: 'Academia Futuro, S.A.' }
  ];

  editarEscuela(row: any) {
    console.log('Editar:', row);
    // Aquí puedes agregar la lógica para editar
  }

  eliminarEscuela(row: any) {
    console.log('Eliminar:', row);
    // Aquí puedes agregar la lógica para eliminar
  }
}
