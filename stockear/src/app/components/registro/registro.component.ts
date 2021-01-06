import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  //providers:[UsuarioService],
})
export class RegistroComponent implements OnInit {
  registerForm=new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl('')
  });
  constructor( private router:Router) { }

  ngOnInit(): void {
  }
  async onRegister(){
    
  }

}
