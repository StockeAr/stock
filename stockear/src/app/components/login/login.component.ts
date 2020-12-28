import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UsuarioService } from '../../service/usersFire/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  //este es otro modo que se aplico con firebase
  /* loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  }); */

  //private isValidEmail=/\S+@\S+\.\S+/;
  private isValidEmail=/(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;
  private subscription: Subscription=new Subscription();
  loginFB = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidEmail)]],
    password: ['',[Validators.required,Validators.minLength(8)]],
  });
  constructor(/* private authSvc: UsuarioService, */ private router: Router, private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    /* const userData = {
      username: 'nombre3',
      password: '12345678'
    };
    this.auth.login(userData).subscribe(res => console.log('Login')); */
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onlogin(): void {
    if(this.loginFB.invalid){
      return;
    }
    const formValue = this.loginFB.value;
    this.subscription.add(
      this.auth.login(formValue).subscribe(res => {
        if (res) {
          this.router.navigate(['']);
        }
      })
    );
  }

  getErrorMessage(field:string):string{
    let message;
    if(this.loginFB.get(field).errors.required){
      message='Ingrese un valor';
    }else{
      if(this.loginFB.get(field).hasError('pattern')){
        message="No es un email valido"
      }else{
        if(this.loginFB.get(field).hasError('minlength')){
          const min=this.loginFB.get(field).errors?.minlength.requiredLength;
          message=`Este campo requiere un minimo de ${min} caracteres`;
        }
      }
    }
    return message;
  }

  isValidField(field:string):boolean{
    return (
      (this.loginFB.get(field).touched || this.loginFB.get(field).dirty)&&
      !this.loginFB.get(field).valid
    );
  }

  recuperar(){
    const username="jt18.pruebas@gmail.com";
    this.auth.olvidoPassword(username).subscribe(res=>{console.log('mail: ',res)});
  }

  //este es otro modo que se aplico con firebase
  /* async onLoginFirebase() {
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.authSvc.login(email, password);
      if (user) {
        this.router.navigate(['']);
      }
    }
    catch (error) {
      console.log(error);
    }
  } */
}
