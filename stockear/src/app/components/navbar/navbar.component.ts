import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLogin: boolean;
  user:any;
  constructor(private authSvc: UsuarioService, private router: Router) { }

  async ngOnInit() {
    console.log('navbar');
    this.user = await this.authSvc.getUser();
    if (this.user) {
      this.isLogin=true;
      console.log('User->', this.user);
    }
  }
  salir() {
    console.log("salir");
    this.authSvc.logout();
    console.log('ha salido con exito');
    this.router.navigate(['']);
  }
}
