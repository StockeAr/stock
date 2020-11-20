import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioService } from '../../service/usersFire/usuario.service';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { UserResponse } from 'src/app/models/user.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAdmin = null;
  isLogged = null;
  @Output() toggleSidenav = new EventEmitter<void>();

  public user$: Observable<any> = this.authSvc.afAuth.user;//esto es con firebase

  //private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<any>();

  constructor(private authSvc: UsuarioService /*esto es con firebase*/, private router: Router, public auth: AuthService) { }

  ngOnInit() {
    /* this.subscription.add(
      this.auth.isLogged.subscribe((res) => (this.isLogged = res))
    ); */
    //la de abajo es la ultima que se uso
    /*  this.auth.isLogged.pipe(takeUntil(this.destroy$))
       .subscribe((res) => (this.isLogged = res));
 
     this.auth.isAdmin.pipe(takeUntil(this.destroy$))
       .subscribe(res => this.isAdmin = res); */

    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user:UserResponse) => {
        this.isLogged = true;
        this.isAdmin = user?.role;
      });
  }
  //esto era con Firebase
  /* async salir() {
    try {
      await this.authSvc.logout();
      this.router.navigate(['']);
    }
    catch (error) {
      console.log(error);
    }
  } */

  ngOndestroy(): void {
    //this.subscription.unsubscribe();
    this.destroy$.next({});
    this.destroy$.complete();
  }
  //esto es para cuando se implemente una barra de menu en el lateral
  async sidenav() {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
    /* this.isAdmin=null;
    this.isLogged=null; */
  }
}
