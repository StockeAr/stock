import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {UsuarioService} from '../../service/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm=new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  constructor(private authSvc:UsuarioService) { }

  ngOnInit(): void {
  }
  onLogin(){
    const {email, password}= this.loginForm.value;
    this.authSvc.login(email,password);
  }

}
