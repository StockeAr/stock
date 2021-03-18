import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  private isValidEmail=/(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;

  private subscription: Subscription=new Subscription();

  loginFB = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidEmail)]],
    password: ['',[Validators.required,Validators.minLength(8)]],
  });

  
  olvidoForm=this.fb.group({
    username:['']
  });
  closeResult='';

  boton:boolean;

  constructor( private router: Router, private auth: AuthService, private fb: FormBuilder, private modalService:NgbModal) { 
  }

  ngOnInit(): void {
    /* const userData = {
      username: 'nombre3',
      password: '12345678'
    };
    this.auth.login(userData).subscribe(res => console.log('Login')); */
    this.boton=false;
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
          Swal.fire({
            title:'Success',
            icon:'success',
            position:'top-end',
            text:'Bienvenido '+res.nombre+' '+res.apellido,
            timer:2000
          });
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
    //console.log("form olvido: ",this.olvidoForm.value);
    this.auth.olvidoPassword(this.olvidoForm.value).subscribe(res=>{window.alert(res.message)});
  }

  open(content) {
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
