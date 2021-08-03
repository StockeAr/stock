import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from 'src/app/models/varios.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(`${environment.API_URL}/producto/list`)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  getActive(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(`${environment.API_URL}/producto/list-active`)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  new(producto: any): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/producto/new`, producto)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  edit(producto: any, id: any): Observable<any> {
    return this.http
      .patch<any>(`${environment.API_URL}/producto/edit/${id}`, producto)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  delete(id: any): Observable<any | void> {
    return this.http
      .delete(`${environment.API_URL}/producto/delete/${id}`)
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
