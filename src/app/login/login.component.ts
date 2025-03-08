import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  users = [
    { email: 'abel@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' }
  ];

  constructor(private router: Router) {}

  onSubmit() {
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      const token = btoa(`${this.email}:${this.password}`);
      localStorage.setItem('token', token);
      this.router.navigate(['/home']);
    } else {
      alert('Correo electrónico o contraseña incorrectos');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}