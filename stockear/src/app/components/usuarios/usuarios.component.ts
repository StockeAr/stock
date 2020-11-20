import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserData } from 'src/app/models/user.interface';
import { UsersService } from 'src/app/service/admin/users.service';
import { BaseFormUser } from 'src/app/utils/base-form-user';
import { parseJsonText } from 'typescript';

enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy{
  variable: UserData[];//aqui guardo los usuarios que vienen de mi api
  userForm: FormGroup;//esto es para el formulario
  flag: boolean;//para los cambios en los textos y botones del cuadro de dialogo
  closeResult = '';//esto es algo defaul del cuadro de dialogo
  idUser: any;//aqui recupero el id del usuario seleccionado

  actionToDo = Action.NEW;//con esto defino la accion a realizar, es un texto en cuestion

  private destroy$=new Subject<any>();

  constructor(private userSVC: UsersService, private modalService: NgbModal, public formBuilder: FormBuilder, public userF: BaseFormUser) {
  }

  ngOnInit(): void {
    //this.userSVC.getAll().subscribe((res) => console.log('User: ', res));
    this.userSVC.getAll().subscribe((res) => this.variable = res);
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      rol: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  guardar() {
    const formValue = this.userForm.value;
    if (this.actionToDo == Action.NEW) {
      this.userSVC.new(formValue).subscribe(res => { console.log('new ', res) });
    } else {
      const userId = this.idUser;
      this.userSVC.update(userId, formValue).subscribe(res => { console.log('Update ', res) });
    }
  }

  checkField(field: string): boolean {
    return this.userF.isValidField(field);
  }

  eliminar(id:number){
    if(window.confirm('¿Desea Usted eliminar el usuario seleccionado?')){
      this.userSVC.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res)=>{window.alert(JSON.stringify(res))});
    }
  }

  //esto es para abrir el cuadro de dialogo
  open(content, user: any) {
    if (user == null) {
      this.userForm.setValue({
        username: '',
        rol: '',
        password: ''
      });
      this.idUser=null;
      this.flag = false;
    } else {
      this.actionToDo = Action.EDIT;
      this.userForm.setValue({
        username: user?.username,
        rol: user?.rol,
        password: ''
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

  ngOnDestroy():void{
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
