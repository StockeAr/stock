import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {UsuarioService} from '../../service/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  //providers:[UsuarioService],
})
export class RegistroComponent implements OnInit {
  registerForm=new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  constructor(private authSvc:UsuarioService) { }

  ngOnInit(): void {
  }
  onRegister(){
    const {email, password}= this.registerForm.value;
    this.authSvc.register(email,password);
  }

}
