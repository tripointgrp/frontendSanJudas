import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'authToken';
  private EXPIRATION_KEY = 'tokenExpiration';
  private userToken = 'authUser';
  private authData = 'authData';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Guardar token y su expiración
  setToken(token: string) {
    if (!this.isBrowser()) return;

    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const expiration = decodedToken.exp * 1000;
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.userToken);
  }

  setUsuario(usuario: string) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.userToken, usuario);
  }

  getUserData(): any {
    if (!this.isBrowser()) return null;

    const userData = localStorage.getItem(this.authData);
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(userData: any) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.authData, JSON.stringify(userData));
  }

  getTokenExpiration(): number | null {
    if (!this.isBrowser()) return null;

    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    return expiration ? parseInt(expiration, 10) : null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;

    const expiration = this.getTokenExpiration();
    return expiration ? Date.now() < expiration : false;
  }

  decodeToken(token: string): any {
    if (!this.isBrowser()) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  logout() {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
