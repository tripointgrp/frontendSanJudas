import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  tipoUsuario: string = '';
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {
      // Aquí puedes agregar lógica adicional si es necesario
      const datos = this.authService.getUserData();
      this.tipoUsuario = datos ? datos.tipo_usuario : '';
    }

    handleClick(item: any) {
      switch (item) {
        case 'home':
          this.router.navigate(['/home']);
          break;
        case 'logout':
          this.authService.logout();
          break;
        case 'escuelas':
          this.router.navigate(['/escuelas']);
          break;
        case 'productos':
          this.router.navigate(['/productos']);
          break;
        case 'pedidos':
          this.router.navigate(['/pedidos']);
          break;
        case 'presupuestos':
          this.router.navigate(['/presupuestos']);
          break;
        case 'reportes':
          this.router.navigate(['/reportes']);
          break;
        case 'mantenimientos':
          this.router.navigate(['/mantenimientos']);
          break;
        case 'usuarios':
          this.router.navigate(['/usuarios']);
          break;
        default:
          this.router.navigate(['/home']);
          break;
      }
    }



  // export const routes: Routes = [
  //   { path: '', redirectTo: 'home', pathMatch: 'full' },
  //   { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  //   { path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
  //       { path: 'home', component: HomeComponent },
  //       { path: 'escuelas', component: EscuelasComponent },
  //       { path: 'editar-escuelas', component: EditarEscuelasComponent },
  //       { path: 'productos', component: ProductosComponent },
  //       { path: 'pedidos', component: PedidosComponent },
  //       { path: 'presupuestos', component: PresupuestosComponent },
  //       { path: 'reportes', component: ReportesComponent }
  //     ]
  //   },
  //   { path: '**', redirectTo: 'home' }
  // ];


}
