import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserData } from 'src/app/models/user.interface';
import { UsersService } from 'src/app/service/admin/users.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { BaseFormUser } from 'src/app/utils/base-form-user';
import Swal from 'sweetalert2';
import { UserResponse } from '../../models/user.interface';

enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  variable: UserData[];//aqui guardo los usuarios que vienen de mi api
  userForm: FormGroup;//esto es para el formulario
  flag: boolean;//para los cambios en los textos y botones del cuadro de dialogo
  closeResult = '';//esto es algo defaul del cuadro de dialogo
  idUser: any;//aqui recupero el id del usuario seleccionado

  filterUser = '';

  actionToDo = Action.NEW;//con esto defino la accion a realizar, es un texto en cuestion

  private destroy$ = new Subject<any>();
  //adminId: any;

  //aux: any;

  private isValidEmail = /(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;
  private isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([A-Za-z\d$@!%*?&]|[^ ]){8,15}$/;

  constructor(private userSVC: UsersService, private modalService: NgbModal, public formBuilder: FormBuilder, public userF: BaseFormUser, private router: Router, public auth: AuthService) {
  }

  ngOnInit(): void {
    //this.userSVC.getAll().subscribe((res) => console.log('User: ', res));

    this.userSVC.getAll().subscribe((res) => this.variable = res);
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
      rol: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.isValidPassword)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]]
    });

    /* this.auth.user$.subscribe((user: UserResponse) => {
      this.adminId = user?.userId;
    }) */
  }

  guardar() {
    const formValue = this.userForm.value;
    if (this.actionToDo == Action.NEW) {
      this.userSVC.new(formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
    } else {
      this.userSVC.update(this.idUser, formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      });
    }
  }

  checkField(field: string): boolean {
    return this.userF.isValidField(field);
  }

  eliminar(id: number) {
    if (window.confirm('¿Desea Usted eliminar el usuario seleccionado?')) {
      this.userSVC.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: res.message
            });
            this.ngOnInit();
          }
        });
    }
  }

  //esto es para abrir el cuadro de dialogo
  open(content, user: any) {
    if (user == null) {
      this.actionToDo = Action.NEW;
      this.userForm.setValue({
        username: '',
        rol: '',
        password: '',
        nombre: '',
        apellido: ''
      });
      this.idUser = null;
      this.flag = false;
    } else {
      this.actionToDo = Action.EDIT;
      this.userForm.setValue({
        username: user?.username,
        rol: user?.rol,
        password: '',
        nombre: user?.nombre,
        apellido: user?.apellido
      });
      this.idUser = user?.id;
      this.flag = true;
    }
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

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.modalService.dismissAll();
  }

  getErrorMessage(field: string): string {
    let message;
    if (this.userForm.get(field).errors.required) {
      message = 'Ingrese un valor';
    } else {
      if (this.userForm.get(field).hasError('pattern')) {
        message = "Ingrese un valor Valido";
      } else {
        if (this.userForm.get(field).hasError('minlength')) {
          const min = this.userForm.get(field).errors?.minlength.requiredLength;
          message = `Este campo requiere un minimo de ${min} caracteres`;
        }
      }
    }
    return message;
  }

  isValidField(field: string): boolean {
    return (
      (this.userForm.get(field).touched || this.userForm.get(field).dirty) &&
      !this.userForm.get(field).valid
    );
  }

}
