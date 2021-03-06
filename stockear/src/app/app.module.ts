import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { UsersService } from './service/admin/users.service'
import { AuthGuard } from './guards/auth/auth.guard';
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
import { MedidaComponent } from './components/medida/medida.component';
import { VentaEmpleadosComponent } from './components/venta-empleados/venta-empleados.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';

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
    MedidaComponent,
    VentaEmpleadosComponent,
    EstadisticasComponent,
    MiPerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxChartsModule,
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
