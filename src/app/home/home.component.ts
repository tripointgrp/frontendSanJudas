import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'Bienvenido al Sistema de Gestión';
  description = 'Administra presupuestos, pedidos y más de forma eficiente y organizada';

  modules = [
    { name: 'Presupuestos', icon: 'attach_money', route: '/presupuestos' },
    { name: 'Pedidos', icon: 'shopping_cart', route: '/pedidos' },
    { name: 'Productos', icon: 'inventory', route: '/productos' },
    { name: 'Escuelas', icon: 'school', route: '/escuelas' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
