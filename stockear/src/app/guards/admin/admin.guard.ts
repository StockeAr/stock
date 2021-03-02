import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserResponse } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService,) {  }

  canActivate(): Observable<boolean> {
    //return this.auth.isLogged.pipe(take(1),map((islogged:boolean)=>!islogged));
    return this.auth.user$.pipe(
      take(1),
      map((user: UserResponse) => ((user ? true : false)&&((user.role=="admin") ? true:false)))
    );
  }
}
