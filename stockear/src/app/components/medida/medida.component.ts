import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { Medida } from 'src/app/models/varios.interface';
import { MedidaService } from 'src/app/service/medida/medida.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.css']
})
export class MedidaComponent implements OnInit, OnDestroy {

  medidas: Medida[] = null;

  medidaForm: FormGroup;
  edit: boolean = false;
  idMedida: number;
  private destroy$ = new Subject<any>();
  private subscription: Subscription = new Subscription();

  constructor(
    private medidaSVC: MedidaService,
    private formB: FormBuilder,
    private modalService: NgbModal,
    private baseError: BaseErrorMessage,
  ) { }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.subscription.unsubscribe();
    this.modalService.dismissAll();
    console.clear();
  }

  ngOnInit(): void {
    //this.modalService.dismissAll();
    this.subscription.add(this.medidaSVC.getAll().subscribe(
      (res) => {
        this.medidas = res;
      }
    ));
    this.medidaForm = this.formB.group({
      descripcion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
    });
    this.baseError.base = this.medidaForm;
  }


  open(content: any, medida: any) {
    if (medida != null) {
      this.medidaForm.setValue({
        descripcion: medida.descripcion
      });
      this.edit = true;
      this.idMedida = medida.id;
    } else {
      this.medidaForm.setValue({
        descripcion: ''
      });
      this.edit = false;
      this.idMedida = null;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit() {
    if (this.medidaForm.invalid) {
      return;
    }
    const formValue = this.medidaForm.value;
    if (this.edit == true) {
      this.subscription.add(this.medidaSVC.edit(this.idMedida, formValue).subscribe(
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
    } else {
      this.subscription.add(this.medidaSVC.new(formValue).subscribe(
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
    }
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: "No podra revertir los cambios",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      //lo de abajo funciona de igual manera que capturando el resultado del cuadro de dialogo
      /* preConfirm: () => {
        this.medidaSVC.delete(id).subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: res.message
            });
            this.ngOnInit();
          }
        );
      } */
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(this.medidaSVC.delete(id).subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: res.message
            });
            this.ngOnInit();
          }
        ));
      }
    });
    /* if (window.confirm("¿Esta seguro?")) {
      this.medidaSVC.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: res.message
            });
            this.ngOnInit();
          }
        );
    } */
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }

}
