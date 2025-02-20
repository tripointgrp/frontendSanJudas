import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { EscuelasComponent } from './escuelas/escuelas.component';
import { ProductosComponent } from './productos/productos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PresupuestosComponent } from './presupuestos/presupuestos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { EditarEscuelasComponent } from './escuelas/editar-escuelas/editar-escuelas.component';
import { LoginGuard } from './guards/login.guard';
import { LayoutComponent } from './layout/layout.component';
import { MantenimientosComponent } from './mantenimientos/mantenimientos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'home', component: HomeComponent },
      { path: 'escuelas', component: EscuelasComponent },
      { path: 'editar-escuelas', component: EditarEscuelasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'presupuestos', component: PresupuestosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'mantenimientos', component: MantenimientosComponent }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

