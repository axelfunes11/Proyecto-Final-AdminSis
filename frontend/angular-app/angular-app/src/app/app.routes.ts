import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(
        (m) => m.LoginComponent
      )
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then(
            (m) => m.DashboardComponent
          )
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/productos/pages/productos/productos').then(
            (m) => m.ProductosComponent
          )
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('./features/stock/pages/stock/stock').then(
            (m) => m.StockComponent
          )
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./features/ventas/pages/ventas/ventas').then(
            (m) => m.VentasComponent
          )
      },
      {
        path: 'cuadres',
        loadComponent: () =>
          import('./features/cuadres/pages/cuadres/cuadres').then(
            (m) => m.CuadresComponent
          )
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];