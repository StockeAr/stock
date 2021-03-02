import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venta, VentaDetalle } from 'src/app/models/venta.interface'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http:HttpClient) { }

  getAll(): Observable<Venta[]>{
    return this.http
    .get<Venta[]>(`${environment.API_URL}/venta`)
    .pipe(catchError(this.handlerError))
  }

  getById(id: number): Observable<VentaDetalle[]>{
    return this.http
    .get<VentaDetalle[]>(`${environment.API_URL}/venta/${id}`)
    .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
