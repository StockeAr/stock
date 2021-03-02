import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { map, take } from 'rxjs/operators';
import { UserResponse } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,) {  }

  canActivate(): Observable<boolean> {
    //return this.auth.isLogged.pipe(take(1),map((islogged:boolean)=>!islogged));
    return this.auth.user$.pipe(
      take(1),
      map((user: UserResponse) => ((user ? true : false)))
    );
  }
}
