import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  edit: boolean = false;
  usuario: any;
  idUser: number = null;
  negocioForm = this.formB.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    telefono: ['', [Validators.required, Validators.minLength(8)]],
    img: [null],
    userId: [null],
    descripcion: [null],
    correo: ['']
  });

  adminForm = this.formB.group({
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(6)]],
    imagen: [null],
  });

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
  }

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.negocioSVC.getData().subscribe(
      (res) => {
        this.negocio = res[0];
        if (this.negocio == null) {
          Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: 'Carge los datos de su negocio'
          });
        }
      }
    );
    this.authSVC.user$.subscribe(
      (user) => {
        this.usuario = {
          nombre: user?.nombre,
          apellido: user?.apellido,
          email: user?.email,
          perfil: user?.perfil
        };
        this.idUser = user?.userId;
      }
    );
  }

  open(content: any, flag: boolean) {
    if (flag == true) {
      this.negocioForm.setValue({
        img: this.negocio?.imagen,
        name: this.negocio?.nombre,
        descripcion: this.negocio?.descripcion,
        telefono: this.negocio?.telefono,
        direccion: this.negocio?.direccion,
        correo: this.negocio?.correo,
        userId: this.idUser,
      })
      this.edit = true;
    }
    this.baseError.base = this.negocioForm;
    this.modalService.open(content);
  }
  abrir(content: any) {
    this.adminForm.setValue({
      apellido: this.usuario?.apellido,
      nombre: this.usuario?.nombre,
      imagen: this.usuario?.perfil,
      username: this.usuario?.email
    })
    this.baseError.base = this.adminForm;
    this.modalService.open(content);
  }

  onSave() {
    if (!this.negocioForm.valid) {
      return;
    }
    const formvalue = this.negocioForm.value;
    this.negocioSVC.new(formvalue).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.ngOnInit();
        this.baseError.base = null;
      }
    );
  }
  onEdit() {
    if (!this.negocioForm.valid) {
      return;
    }
    const formvalue = this.negocioForm.value;
    this.negocioSVC.edit(formvalue).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.ngOnInit();
        this.baseError.base = null;
      }
    )
  }

  editarPerfil() {
    if (!this.adminForm.valid) {
      return;
    }
    const formvalue = this.adminForm.value;
    this.authSVC.editarPerfil(formvalue).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.ngOnInit();
        this.baseError.base = null;
      }
    )
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }

}
