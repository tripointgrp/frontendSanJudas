import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule],
  providers: [ApiService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  users = [
    { email: 'abel@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' }
  ];

  constructor(private router: Router, private service: ApiService) {
    this.service.getData().subscribe((data:any) => {
      // this.users = data;
      console.log(this.users);
    });

  }

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password', this.password);
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    console.log(user);
    if (user) {
      const token = btoa(`${this.email}:${this.password}`); // Genera un token básico (Base64)
      console.log(token)
      localStorage.setItem('token', token); // Guarda el token en localStorage
      this.router.navigate(['/home']);
    } else {
      alert('Correo electrónico o contraseña incorrectos');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
