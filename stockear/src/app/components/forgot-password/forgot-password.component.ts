import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private isValidEmail = /(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;


  olvidoForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]]
  })
  constructor(private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.olvidoForm.invalid) {
      return;
    }
    this.auth.olvidoPassword(this.olvidoForm.value)
      .subscribe(
        res => {
          if(res){
            window.alert(res.message);
            this.olvidoForm.reset();
          }
        }
      );
  }


  getErrorMessage(field: string): string {
    let message;
    if (this.olvidoForm.get(field).errors.required) {
      message = 'Ingrese un valor';
    } else {
      if (this.olvidoForm.get(field).hasError('pattern')) {
        message = "No es un email valido"
      }
    }
    return message;
  }

  isValidField(field: string): boolean {
    return (
      (this.olvidoForm.get(field).touched || this.olvidoForm.get(field).dirty) &&
      !this.olvidoForm.get(field).valid
    );
  }
}
