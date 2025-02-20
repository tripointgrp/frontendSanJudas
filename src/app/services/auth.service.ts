import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false; // Variable para controlar si el usuario está autenticado

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Simulación de login (reemplázalo con una API real)
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('token', 'user-token');
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('token') !== null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}
