import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  //providers:[UsuarioService],
})
export class RegistroComponent implements OnInit {


  private isValidEmail=/(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;
  private isValidPassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([A-Za-z\d$@!%*?&]|[^ ]){8,15}$/;

  registerForm=this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidEmail)]],
    password: ['',[Validators.required,Validators.minLength(8),Validators.pattern(this.isValidPassword)]],
    nombre: ['',[Validators.required,Validators.minLength(3)]],
    apellido: ['',[Validators.required,Validators.minLength(3)]],
    confirmPassword: ['', [Validators.required]]
  });

  boton:boolean;

  constructor( private router:Router, private fb:FormBuilder, private auth:AuthService) { }

  ngOnInit(): void {
    this.boton=false;
  }
  onRegister(){
    if(this.registerForm.invalid){
      return;
    }
    this.auth.register(this.registerForm.value).subscribe(res=>{
      if(res){
        window.alert(res.message);
        this.registerForm.reset();
      }
    },err=>{
      window.alert(err.error.message);
    });
  }

  getErrorMessage(field:string):string{
    let message;
    if(this.registerForm.get(field).errors.required){
      message='Ingrese un valor';
    }else{
      if(this.registerForm.get(field).hasError('pattern')){
        message="Ingrese un valor Valido";
      }else{
        if(this.registerForm.get(field).hasError('minlength')){
          const min=this.registerForm.get(field).errors?.minlength.requiredLength;
          message=`Este campo requiere un minimo de ${min} caracteres`;
        }
      }
    }
    return message;
  }

  isValidField(field:string):boolean{
    return (
      (this.registerForm.get(field).touched || this.registerForm.get(field).dirty)&&
      !this.registerForm.get(field).valid
    );
  }

}
