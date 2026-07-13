import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

interface LoginRequest {
  correo: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
    correo: string;
    estado: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'nutriconplus_token';
  private userKey = 'nutriconplus_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.usersApiUrl}/auth/login`, data)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}