import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard'
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VentasInfoComponent } from './components/ventas-info/ventas-info.component';
import { VentaComponent } from './components/venta/venta.component'
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'prueba', component: PruebaComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'venta-info', component: VentasInfoComponent, canActivate: [AuthGuard] },
  { path: 'venta', component: VentaComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
  { path: 'categoria', component: CategoriaComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
