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
      .pipe(catchError(this.handlerError))
  }

  handlerError(err): Observable<never> {
    let errorMessage = "Ha ocurrido un error al obtener los datos";
    if (err) {
      errorMessage = `Error: 
      code -> ${err.status}
      message -> ${err.error.message} `;
    }
    console.log(errorMessage);
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: err.error.message
    });
    return throwError(errorMessage);
  }
}
