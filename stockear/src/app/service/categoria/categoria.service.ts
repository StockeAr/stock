import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Categoria } from 'src/app/models/varios.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Categoria[]> {
    return this.http
      .get<Categoria[]>(`${environment.API_URL}/categoria`)
      .pipe(
        catchError((err) => this.handlerError(err)
        )
      );
  }

  getById(id: number): Observable<Categoria> {
    return this.http
      .get<any>(`${environment.API_URL}/categoria/${id}`)
      .pipe(
        catchError((err) => this.handlerError(err)
        )
      );
  }
  new(categoria: any): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/categoria`, categoria)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  update(catId: number, categoria: Categoria): Observable<any> {
    return this.http
      .patch<any>(`${environment.API_URL}/categoria/${catId}`, categoria)
      .pipe(
        catchError((err) => this.handlerError(err))
      );
  }

  delete(catId: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.API_URL}/categoria/${catId}`)
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
