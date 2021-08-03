import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Categoria } from 'src/app/models/varios.interface';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
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
export class CategoriaComponent implements OnInit, OnDestroy {

  categoria: Categoria[] = null;
  catForm: FormGroup;
  flag: boolean;//para los cambios en los textos y botones del cuadro de dialogo
  actionToDo = Action.NEW;//con esto defino la accion a realizar, es un texto en cuestion
  closeResult = '';
  idCat: any;
  private destroy$ = new Subject<any>();
  private subscription: Subscription = new Subscription();

  constructor(
    private catSVC: CategoriaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private baseError: BaseErrorMessage) { }

  ngOnInit(): void {
    this.subscription.add(this.catSVC.getAll().subscribe((res) => { this.categoria = res }));

    this.catForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]]
    });
    this.baseError.base = this.catForm;
  }

  guardar() {
    if (this.catForm.invalid) {
      return;
    }
    const formValue = this.catForm.value;
    if (this.actionToDo == Action.NEW) {
      this.subscription.add(this.catSVC.new(formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll(res.message);
          this.ngOnInit();
        }
      }));
    } else {
      const catId = this.idCat;
      this.subscription.add(this.catSVC.update(catId, formValue).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: res.message
          });
          this.modalService.dismissAll(res.message);
          this.ngOnInit();
        }
      }));
    }
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el categoria seleccionada?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Atras'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.catSVC.delete(id)
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
    });


    /* if (window.confirm('¿Desea Usted eliminar la categoria seleccionada?')) {
      this.subscription.add(this.catSVC.delete(id)
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
        }));
    } */
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.subscription.unsubscribe();
    this.modalService.dismissAll();
    console.clear();
  }
  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }
}
