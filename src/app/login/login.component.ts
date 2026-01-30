import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  onSubmit() {
    this.loading = true; // Mostrar spinner o deshabilitar botón
    this.http.post<any>(environment.apiUrl+'api/usuarios/login', { correo: this.email, clave: this.password }).subscribe(
      (response) => {
        if (response.token) {
          this.authService.setToken(response.token);
          this.authService.setUsuario(response.usuario.id);
          this.authService.setUserData(response.usuario);
          this.router.navigate(['/home']); // Redirigir si el login es exitoso
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        alert('Correo electrónico o contraseña incorrectos');
        console.error('Error en login:', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
