import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medida } from 'src/app/models/varios.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedidaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Medida[]> {
    return this.http
      .get<Medida[]>(`${environment.API_URL}/medida`)
      .pipe(
        catchError((err) => this.handlerError(err)
        )
      );
  }

  new(medida: any): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/medida`, medida)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  edit(id: any, medida: any): Observable<any> {
    return this.http
      .patch<any>(`${environment.API_URL}/medida/${id}`, medida)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  delete(id: any): Observable<any> {
    return this.http
      .delete(`${environment.API_URL}/medida/${id}`)
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
    //console.error(errorMessage);
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: err.error.message
    });
    if (err.error.erros) {
      console.log("errores: ", err.error?.errors);
    }
    return throwError(errorMessage);
  }
}
