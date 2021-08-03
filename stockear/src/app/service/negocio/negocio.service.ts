import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Negocio } from 'src/app/models/varios.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http
      .get<any>(`${environment.API_URL}/negocio/find`)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  new(negocio: any): Observable<any> {
    return this.http
      .post(`${environment.API_URL}/negocio/new`, negocio)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  edit(negocio: Negocio): Observable<any> {
    return this.http
      .patch(`${environment.API_URL}/negocio/edit`, negocio)
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
      console.log("errores: ", err.error.errors);
    };
    return throwError(errorMessage);
  }
}
