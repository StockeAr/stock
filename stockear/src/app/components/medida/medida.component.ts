import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Medida } from 'src/app/models/varios.interface';
import { MedidaService } from 'src/app/service/medida/medida.service';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.css']
})
export class MedidaComponent implements OnInit {

  medidas: Medida[] = [];

  medidaForm: FormGroup;
  edit: boolean = false;
  idMedida: number;

  constructor(
    private medidaSVC: MedidaService,
    private formB: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.medidaSVC.getAll().subscribe(
      (res) => {
        this.medidas = res;
      }
    );

    this.medidaForm = this.formB.group({
      descripcion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
    });

    this.idMedida = null;
    this.modalService.dismissAll();
    this.medidaForm.reset();
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
    this.modalService.open(content);
  }

  onSubmit() {
    if (this.medidaForm.invalid) {
      return;
    }
    const formValue = this.medidaForm.value;
    if (this.edit == true) {
      this.medidaSVC.edit(this.idMedida, formValue).subscribe(
        (res) => {
          window.alert(res?.message);
          this.ngOnInit();
        }
      );
    } else {
      this.medidaSVC.new(formValue).subscribe(
        (res) => {
          window.alert(res?.message);
          this.ngOnInit();
        }
      )
    }
  }

  eliminar(id: number) {
    if (window.confirm("¿Esta seguro?")) {
      this.medidaSVC.delete(id).subscribe(
        (res) => {
          window.alert(res?.message);
          this.ngOnInit();
        }
      )
    }
  }

  isValidField(field: string): boolean {
    return (
      (this.medidaForm.get(field).touched || this.medidaForm.get(field).dirty) &&
      !this.medidaForm.get(field).valid
    );
  }

  getErrorMessage(field: string): string {
    let message;
    if (this.medidaForm.get(field).errors.required) {
      message = 'Ingrese un valor';
    }
    else {
      if (this.medidaForm.get(field).hasError('minlength')) {
        const min = this.medidaForm.get(field).errors?.minlength.requiredLength;
        message = `Este campo requiere un minimo de ${min} caracteres`;
      }
      else {
        if (this.medidaForm.get(field).hasError('maxLenght')) {
          const max = this.medidaForm.get(field).errors?.maxlength.requiredLength;
          message = `Este campo requiere un minimo de ${max} caracteres`;
        }
      }
    }
    return message;
  }

}
