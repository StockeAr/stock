import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user$:Observable<any>=this.authSvc.afAuth.user;
  constructor(private authSvc: UsuarioService, private router: Router) { }

  async ngOnInit() {
    
  }
  async salir() {
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }
    catch (error){
      console.log(error);
    }
  }
}
