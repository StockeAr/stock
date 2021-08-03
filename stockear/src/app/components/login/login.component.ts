import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  private isValidEmail = /(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;

  private subscription: Subscription = new Subscription();

  loginFB = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  olvidoForm = this.fb.group({
    username: ['']
  });

  boton: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private baseError: BaseErrorMessage
  ) { }

  ngOnInit(): void {
    this.boton = false;
    this.baseError.base = this.loginFB;
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.subscription.unsubscribe();
    console.clear();
  }

  onlogin(): void {
    if (this.loginFB.invalid) {
      return;
    }
    const formValue = this.loginFB.value;
    this.subscription.add(
      this.auth.login(formValue).subscribe(res => {
        if (res) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            position: 'top-end',
            text: 'Bienvenido ' + res.nombre + ' ' + res.apellido,
            timer: 2000
          });
          this.router.navigate(['']);
        }
      })
    );
  }

  recuperar() {
    //console.log("form olvido: ",this.olvidoForm.value);
    this.auth.olvidoPassword(this.olvidoForm.value).subscribe(res => { window.alert(res.message) });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }
}
