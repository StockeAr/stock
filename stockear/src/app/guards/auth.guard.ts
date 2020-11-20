import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service/usersFire/usuario.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../service/auth/auth.service';
import { map, take } from 'rxjs/operators';
import { UserResponse } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(/* private user: UsuarioService,  private router: Router,*/ private auth: AuthService,/* angularfire: AngularFireAuth */) {

  }
  //esto era en la implementacion coon Firebase
  /* canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     //this.user.getInfoCuenta().subscribe(resultado =>{
        //if(!resultado){
          //this.router.navigate(['/login']);
          //return false;
        //}
      //}); 
      this.user.afAuth.user.subscribe(resultado=>{
        if(!resultado){
          this.router.navigate(['/login']);
          return false;
        }
      });
    return true;
  } */
  canActivate(): Observable<boolean> {
    //return this.auth.isLogged.pipe(take(1),map((islogged:boolean)=>!islogged));
    return this.auth.user$.pipe(
      take(1),
      map((user: UserResponse) => (!user ? true : false))
    );
  }

}
