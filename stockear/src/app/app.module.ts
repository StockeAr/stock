import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';

//import {Routes, RouterModule}from '@angular/router';

import { UsersService } from './service/admin/users.service'

import { AuthGuard } from './guards/auth/auth.guard';
import { environment } from 'src/environments/environment';
import { PruebaComponent } from './components/prueba/prueba.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsuariosComponent } from './components/usuarios/usuarios.component'
import { AdminIntercetpor } from './interceptors/admin-interceptor';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FooterComponent } from './components/footer/footer.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SortDirective } from './directiva/sort.directive';
import { VentasInfoComponent } from './components/ventas-info/ventas-info.component';
import { VentaComponent } from './components/venta/venta.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ServiceWorkerModule } from '@angular/service-worker';

/* const routes: Routes =[
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'registro', component:RegistroComponent},
  {path:'home', component:HomeComponent},
  {path:'prueba',component:PruebaComponent,canActivate:[AuthGuard]}
] */
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RegistroComponent,
    LoginComponent,
    PruebaComponent,
    UsuariosComponent,
    ForgotPasswordComponent,
    FooterComponent,
    FilterPipe,
    SortDirective,
    VentasInfoComponent,
    VentaComponent,
    ProductosComponent,
    CategoriaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    AuthGuard,
    UsersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminIntercetpor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  FormsModule: FormsModule;
  ReactiveFormsModule: ReactiveFormsModule;
}
