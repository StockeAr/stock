import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService } from '../service/usersFire/usuario.service';
import { AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private user:UsuarioService,private router:Router, angularfire:AngularFireAuth){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     /*  this.user.getInfoCuenta().subscribe(resultado =>{
        if(!resultado){
          this.router.navigate(['/login']);
          return false;
        }
      }); */
      this.user.afAuth.user.subscribe(resultado=>{
        if(!resultado){
          this.router.navigate(['/login']);
          return false;
        }
      });
    return true;
  }
  
}
