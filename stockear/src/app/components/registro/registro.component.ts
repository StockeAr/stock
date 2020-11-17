import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {UsuarioService} from '../../service/usersFire/usuario.service';

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
  constructor(private authSvc:UsuarioService, private router:Router) { }

  ngOnInit(): void {
  }
  async onRegister(){
    const {email, password}= this.registerForm.value;
    try{
      const user = await this.authSvc.register(email,password);
      if(user){
        this.router.navigate(['']);
      }
    }
    catch{}
    
  }

}
