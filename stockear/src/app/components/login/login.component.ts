import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
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
  private subscription: Subscription=new Subscription();
  loginFB = this.fb.group({
    username: [''],
    password: [''],
  });
  constructor(private authSvc: UsuarioService, private router: Router, private auth: AuthService, private fb: FormBuilder) { }

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
    const formValue = this.loginFB.value;
    this.subscription.add(
      this.auth.login(formValue).subscribe(res => {
        if (res) {
          this.router.navigate(['']);
        }
      })
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
