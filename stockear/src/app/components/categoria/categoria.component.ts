import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Categoria } from 'src/app/models/varios.interface';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
import { BaseFormGeneric } from 'src/app/utils/base-form-generic';
import Swal from 'sweetalert2';


enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoria: Categoria[];
  catForm: FormGroup;
  flag: boolean;//para los cambios en los textos y botones del cuadro de dialogo
  actionToDo = Action.NEW;//con esto defino la accion a realizar, es un texto en cuestion
  closeResult = '';
  idCat: any;
  private destroy$ = new Subject<any>();
  constructor(private catSVC: CategoriaService, private modalService: NgbModal, private formBuilder: FormBuilder, private router: Router, private baseForm: BaseFormGeneric) { }

  ngOnInit(): void {
    this.catSVC.getAll().subscribe((res) => { this.categoria = res });

    this.catForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]]
    });
  }

  guardar() {
    const formValue = this.catForm.value;
    if (this.actionToDo == Action.NEW) {
      this.catSVC.new(formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll(res.message);
          this.ngOnInit();
        }
      });
    } else {
      const catId = this.idCat;
      this.catSVC.update(catId, formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll(res.message);
          this.ngOnInit();
        }
      });
    }
  }

  checkField(field: string): boolean {
    return this.baseForm.isValidField(field);
  }

  eliminar(id: number) {
    if (window.confirm('¿Desea Usted eliminar la categoria seleccionada?')) {
      this.catSVC.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: res.message
            });
            /* window.location.reload();
            this.router.navigate(['usuarios']); */
            this.ngOnInit();
          }
        });
    }
  }

  //esto es para abrir el cuadro de dialogo
  open(content, cat: any) {
    if (cat == null) {
      this.actionToDo = Action.NEW;
      this.catForm.setValue({
        descripcion: ''
      });
      this.idCat = null;
      this.flag = false;
    } else {
      this.actionToDo = Action.EDIT;
      this.catForm.setValue({
        descripcion: cat?.descripcion,
      });
      this.idCat = cat?.id;
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
  }

  getErrorMessage(field: string): string {
    let message;
    if (this.catForm.get(field).errors.required) {
      message = 'Ingrese un valor';
    }
    else {
      if (this.catForm.get(field).hasError('minlength')) {
        const min = this.catForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un minimo de ${min} caracteres`;
      }
      else {
        if (this.catForm.get(field).hasError('maxLenght')) {
          const max = this.catForm.get(field).errors?.maxlength.requiredLength;
          message = `Este campo requiere un minimo de ${max} caracteres`;
        }
      }
    }
    return message;
  }

  isValidField(field: string): boolean {
    return (
      (this.catForm.get(field).touched || this.catForm.get(field).dirty) &&
      !this.catForm.get(field).valid
    );
  }
}
