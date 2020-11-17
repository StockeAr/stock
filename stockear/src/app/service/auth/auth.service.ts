import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserResponse, User, Roles } from 'src/app/models/user.interface';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<Roles>('ADMIN');
  constructor(private http: HttpClient) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isAdmin(): Observable<string> {
    return this.role.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http
    .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        map((res: UserResponse) => {
          //console.log('RES -> ', res);          
          this.saveLocalStorage(res);
          this.loggedIn.next(true);
          this.role.next(res.role);
          return res;
        }), 
        catchError((err) => this.handleError(err))
      );
  }
  logout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.role.next(null);
  }

  private checkToken(): void {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
      const isExpired = helper.isTokenExpired(user.token);
      if (isExpired) {
        this.logout()
      } else {
        this.loggedIn.next(true);
        this.role.next(user.role);
      }
    }

    /* console.log('isExpired -> ', isExpired);
    if (isExpired) {
      this.logout();
    } else {
      this.loggedIn.next(true);
    } */
  }

  private saveLocalStorage(user: UserResponse): void {
    //localStorage.setItem('token', token);
    const { userId, message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
  }

  private handleError(err): Observable<never> {
    let errorMessage = "Ha ocurrido un error al obtener los datos";
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}