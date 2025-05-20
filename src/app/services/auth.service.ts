import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private isAuthenticated = false; // Variable para controlar si el usuario está autenticado
  private TOKEN_KEY = 'authToken';
  private EXPIRATION_KEY = 'tokenExpiration';
  private userToken = 'authUser';
  private authData = 'authData';


  constructor(private router: Router) {}

  // Guardar token y su expiración
  setToken(token: string) {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const expiration = decodedToken.exp * 1000; // Convertir a milisegundos
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
    }
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): string | null {
    return localStorage.getItem(this.userToken);
  }

  setUsuario(usuario: string) {
      localStorage.setItem(this.userToken, usuario);
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.authData);
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(userData: any) {
    localStorage.setItem(this.authData, JSON.stringify(userData));
  }

  // Obtener la fecha de expiración
  getTokenExpiration(): number | null {
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    return expiration ? parseInt(expiration, 10) : null;
  }

  // Verificar si el token es válido
  isAuthenticated(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? Date.now() < expiration : false;
  }

  // Decodificar el token JWT
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // Extraer payload del JWT
      return JSON.parse(atob(payload)); // Decodificar Base64
    } catch (e) {
      return null;
    }
  }

  // Cerrar sesión (Eliminar token)
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.clear(); // Limpia cualquier otro dato almacenado
    this.router.navigate(['/login']); // Redirige al login
  }

  // login(username: string, password: string): boolean {
  //   // Simulación de login (reemplázalo con una API real)
  //   if (username === 'admin' && password === '123456') {
  //     localStorage.setItem('token', 'user-token');
  //     this.isAuthenticated = true;
  //     return true;
  //   }
  //   return false;
  // }

  // isLoggedIn(): boolean {
  //   return typeof window !== 'undefined' && localStorage.getItem('token') !== null;
  // }

  // logout(): void {
  //   if (typeof window !== 'undefined') {
  //     localStorage.removeItem('token');
  //   }
  // }
}
