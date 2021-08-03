import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  //providers:[UsuarioService],
})
export class RegistroComponent implements OnInit, OnDestroy {

  private isValidEmail = /(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;
  private isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([A-Za-z\d$@!%*?&]|[^ ]){8,15}$/;

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.isValidPassword)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [Validators.required]]
  });

  private subscription: Subscription = new Subscription();

  boton: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private baseError: BaseErrorMessage
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.clear();
  }

  ngOnInit(): void {
    this.boton = false;
    this.baseError.base = this.registerForm;
  }
  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }
    this.subscription.add(
      this.auth.register(this.registerForm.value).subscribe(res => {
        if (res) {
          //window.alert(res.message);
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success'
          })
          this.registerForm.reset();
          this.router.navigate(['login']);
        }
      })
    );
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }

}
