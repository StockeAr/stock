import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  userD=[];
  //@Output() toggleSidenav = new EventEmitter<void>();

  //private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<any>();

  constructor( private router: Router, public auth: AuthService) { }

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
        this.userD[0]=user?.nombre;
        this.userD[1]=user?.apellido;
      });
  }

  ngOndestroy(): void {
    //this.subscription.unsubscribe();
    this.destroy$.next({});
    this.destroy$.complete();
  }
  //esto es para cuando se implemente una barra de menu en el lateral
  /* async sidenav() {
    this.toggleSidenav.emit();
  } */

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
    /* this.isAdmin=null;
    this.isLogged=null; */
  }
}
