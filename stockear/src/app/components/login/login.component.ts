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

  private isValidEmail=/\S+@\S+\.\S+/;
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
      message='Ingrese un Valor';
    }else{
      if(this.loginFB.get(field).hasError('pattern')){
        const min=this.loginFB.get(field).errors?.min.requiredLength;
        message=`Este campo requiere un minimo de ${min} caracteres`;
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
