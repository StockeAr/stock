import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';
import { NegocioService } from 'src/app/service/negocio/negocio.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit, OnDestroy {

  negocio: any = null;
  edit: boolean;
  create: boolean;
  usuario: any;
  idUser: number = null;
  private user: any = [];
  negocioForm = this.formB.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    //telefono: ['', [Validators.required, Validators.minLength(8)]],
    telefono: [null],
    img: [null],
    userId: [null],
    descripcion: [null],
    correo: [null]
  });

  adminForm = this.formB.group({
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(6)]],
    imagen: [null],
  });

  private subscription: Subscription = new Subscription();

  constructor(
    private formB: FormBuilder,
    private negocioSVC: NegocioService,
    private modalService: NgbModal,
    private authSVC: AuthService,
    private baseError: BaseErrorMessage
  ) { }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.negocioForm.reset();
    this.usuario = null;
    this.subscription.unsubscribe();
    console.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.negocioSVC.getData().subscribe(
      (res) => {
        this.negocio = res;
        if (this.negocio == null) {
          Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: 'Carge los datos de su negocio'
          });
        }
      }
    ));

    this.user = JSON.parse(localStorage.getItem('user'));
    this.usuario = {
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      email: this.user.email,
      perfil: this.user.perfil,
      id: this.user.userId
    };
  }

  open(content: any, flag: boolean) {
    if (flag == true) {
      this.negocioForm.setValue({
        img: this.negocio.imagen,
        name: this.negocio.nombre,
        descripcion: this.negocio.descripcion,
        telefono: this.negocio.telefono,
        direccion: this.negocio.direccion,
        correo: this.negocio.correo,
        userId: this.usuario.id,
      })
      this.edit = true;
    } else {
      this.edit = false;
      this.create = true;
    }
    this.baseError.base = this.negocioForm;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  abrir(content: any) {
    this.adminForm.setValue({
      apellido: this.usuario.apellido,
      nombre: this.usuario.nombre,
      imagen: this.usuario.perfil,
      username: this.usuario.email
    })
    this.baseError.base = this.adminForm;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSave() {
    if (!this.negocioForm.valid) {
      return;
    }
    if (this.create) {
      const formvalue = this.negocioForm.value;
      formvalue.userId = this.usuario.id;
      this.subscription.add(this.negocioSVC.new(formvalue).subscribe(
        (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll();
        }
      ));
      this.create = false;
    } else {
      console.log("equivocado 2");
    }

  }
  onEdit() {
    if (!this.negocioForm.valid) {
      return;
    }
    if (this.edit) {
      const formvalue = this.negocioForm.value;
      this.subscription.add(this.negocioSVC.edit(formvalue).subscribe(
        (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.ngOnInit();
          this.modalService.dismissAll();
        }
      ));
      this.edit = false;
    } else {
      console.log("equivocado");
    }
  }

  editarPerfil() {
    if (!this.adminForm.valid) {
      return;
    }
    const formvalue = this.adminForm.value;
    this.subscription.add(this.authSVC.editarPerfil(formvalue).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.modalService.dismissAll();
      }
    ));
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }

}
