import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserData } from 'src/app/models/user.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserData[]> {
    /* let customHeaders=new HttpHeaders().set('admin',adminId);
    console.log('esto me llego:'+JSON.stringify(customHeaders)); */

    return this.http
      .get<UserData[]>(`${environment.API_URL}/users`)
      .pipe(catchError((err) => this.handlerError(err))
      );
  }

  getById(userId: number): Observable<User> {
    return this.http
      .get<any>(`${environment.API_URL}/users/${userId}`)
      .pipe(catchError((err) => this.handlerError(err))
      );
  }
  new(user: User): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/users`, user)
      .pipe(catchError((err) => this.handlerError(err))
      );
  }
  update(userId: number, user: User): Observable<any> {
    return this.http
      .patch<any>(`${environment.API_URL}/users/${userId}`, user)
      .pipe(catchError((err) => this.handlerError(err))
      );
  }
  delete(userId: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.API_URL}/users/${userId}`)
      .pipe(catchError((err) => this.handlerError(err))
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
