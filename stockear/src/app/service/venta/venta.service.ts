import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venta, VentaDetalle } from 'src/app/models/venta.interface'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Venta[]> {
    return this.http
      .get<Venta[]>(`${environment.API_URL}/venta`)
      .pipe(catchError(this.handlerError))
  }

  getById(id: number): Observable<VentaDetalle[]> {
    return this.http
      .get<VentaDetalle[]>(`${environment.API_URL}/venta/find/${id}`)
      .pipe(catchError(this.handlerError));
  }

  newVenta(myArray: any): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/venta`, myArray)
      .pipe(catchError(this.handlerError));
  }

  ventaEmpleados(): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.API_URL}/venta/empleados`)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  estadisticas(): Observable<any> {
    return this.http
      .get<any>(`${environment.API_URL}/venta/estadisticas`)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  private handlerError(err): Observable<never> {
    let errorMessage = "Ha ocurrido un error al obtener los datos";
    if (err) {
      errorMessage = `Error: 
      code -> ${err.status}
      message -> ${err.error.message} `;
    }
    //console.log(errorMessage);
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: err.error.message
    });
    if (err.error.errors) {
      console.log("errores: ", err.error?.errors);
    }
    return throwError(errorMessage);
  }
}
