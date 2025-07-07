import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router,private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const tipoUsuario = this.authService.getUserData()?.tipo_usuario;

    const rolesPermitidos = route.data['roles'] as string[];

    if (rolesPermitidos.includes(tipoUsuario || '')) {
      return true;
    }

    // Si no tiene permiso, redirige
    return this.router.createUrlTree(['/home']);
  }
}
