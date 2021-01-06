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

import { AuthGuard } from './guards/auth.guard';
import { environment } from 'src/environments/environment';
import { PruebaComponent } from './components/prueba/prueba.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsuariosComponent } from './components/usuarios/usuarios.component'
import { AdminIntercetpor } from './interceptors/admin-interceptor';

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
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    UsersService,
    { provide: HTTP_INTERCEPTORS, useClass: AdminIntercetpor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  FormsModule: FormsModule;
  ReactiveFormsModule: ReactiveFormsModule;
}
