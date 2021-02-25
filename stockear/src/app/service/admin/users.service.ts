import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User,UserData } from 'src/app/models/user.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserData[]> {
    /* let customHeaders=new HttpHeaders().set('admin',adminId);
    console.log('esto me llego:'+JSON.stringify(customHeaders)); */

    return this.http
      .get<UserData[]>(`${environment.API_URL}/users`/* ,{headers:customHeaders} */)
      .pipe(catchError(this.handlerError));
  }
  getById(userId: number): Observable<User> {
    return this.http
      .get<any>(`${environment.API_URL}/users/${userId}`)
      .pipe(catchError(this.handlerError));
  }
  new(user: User): Observable<any> {
    return this.http
      .post<any>(`${environment.API_URL}/users`,user)
      .pipe(catchError(this.handlerError));
  }
  update(userId: number, user: User): Observable<any> {
    return this.http
      .patch<any>(`${environment.API_URL}/users/${userId}`, user)
      .pipe(catchError(this.handlerError));
  }
  delete(userId: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.API_URL}/users/${userId}`)
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
