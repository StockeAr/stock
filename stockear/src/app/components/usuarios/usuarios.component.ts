import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserData } from 'src/app/models/user.interface';
import { UsersService } from 'src/app/service/admin/users.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';

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
  private subscription: Subscription = new Subscription();

  //adminId: any;

  //aux: any;

  private isValidEmail = /(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$/;
  private isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([A-Za-z\d$@!%*?&]|[^ ]){8,15}$/;

  constructor(
    private userSVC: UsersService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public baseError: BaseErrorMessage,
    public auth: AuthService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userSVC.getAll().subscribe((res) => this.variable = res)
    );
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
      password: ['', [Validators.required, Validators.pattern(this.isValidPassword)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      activo: [true, [Validators.required]]
    });
    this.baseError.base = this.userForm;
  }

  guardar() {
    if (this.userForm.invalid) {
      return;
    }
    const formValue = this.userForm.value;
    if (this.actionToDo == Action.NEW) {
      this.subscription.add(
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
        })
      );
    } else {
      this.subscription.add(
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
        })
      );
    }
  }

  eliminar(id: number) {

    Swal.fire({
      title: '¿Desea eliminar el usuario seleccionado?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Atras'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.userSVC.delete(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              Swal.fire({
                icon: 'success',
                title: 'Ok',
                text: res.message
              });
              this.ngOnInit();
            })
        );
      }
    })
    /* if (window.confirm('¿Desea Usted eliminar el usuario seleccionado?')) {
      this.subscription.add(
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
          })
      );
    } */
  }

  //esto es para abrir el cuadro de dialogo
  open(content, user: any) {
    if (user == null) {
      this.actionToDo = Action.NEW;
      this.userForm.setValue({
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        activo: true,
      });
      this.idUser = null;
      this.flag = false;
    } else {
      this.actionToDo = Action.EDIT;
      this.userForm.setValue({
        username: user?.username,
        password: '@Simil123',
        nombre: user?.nombre,
        apellido: user?.apellido,
        activo: user?.activo
      });
      this.idUser = user?.id;
      this.flag = true;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.modalService.dismissAll();
    this.subscription.unsubscribe();
    console.clear();
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }


}
