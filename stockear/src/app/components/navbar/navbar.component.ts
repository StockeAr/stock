import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../service/usuario.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  nombre:string="algo";
  email:string;
  isLogin:boolean;
  foto:string;
  constructor(private user:UsuarioService, private router:Router) { }

  ngOnInit(): void {
  }
  salir(){
    console.log("salir");
    //this.user.logout();
    console.log('ha salido con exito');
    this.router.navigate(['']);
  }
}
