import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/models/user.interface';
import { Producto } from 'src/app/models/varios.interface';
import { AuthService } from 'src/app/service/auth/auth.service';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
import { MedidaService } from 'src/app/service/medida/medida.service';
import { ProductoService } from 'src/app/service/producto/producto.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {

  productos: Producto[];
  filterProd = '';
  productoForm = this.formB.group({
    cantidad: [0, [Validators.required, Validators.min(0.01)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    costo: [0, [Validators.required]],
    minExistencia: [0, [Validators.required]],
    categoriaId: ['', [Validators.required]],
    imagen: [''],
    medidaId: [''],
    activo: [true, [Validators.required]]
  });
  idProd = 0;
  categoria: any[];
  edit: boolean = false;
  medida: any[];

  rol: string = "";
  private subscription: Subscription = new Subscription();

  constructor(
    private prodSVC: ProductoService,
    private modalService: NgbModal,
    private formB: FormBuilder,
    private categoriaService: CategoriaService,
    private medidaService: MedidaService,
    private baseError: BaseErrorMessage,
    private authService: AuthService,
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.modalService.dismissAll();
    console.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.prodSVC.getAll().subscribe(
      (res) => {
        this.productos = res
      }
    ));

    this.subscription.add(this.categoriaService.getAll().subscribe(
      (res) => {
        this.categoria = res;
      }
    ));

    this.baseError.base = this.productoForm;

    this.subscription.add(this.authService.user$.subscribe((user: UserResponse) => {
      this.rol = user?.role;
    }));
  }

  open(content: any, producto?: any): void {
    this.subscription.add(this.medidaService.getAll().subscribe(
      (res) => {
        this.medida = res;
      }
    ));
    if (producto) {
      this.productoForm.setValue({
        cantidad: producto.cantidad,
        descripcion: producto.descripcion,
        costo: producto.costo,
        minExistencia: producto.minExistencia,
        categoriaId: producto.categoria?.id || null,
        imagen: producto.imagen,
        medidaId: producto.medida?.id || null,
        activo:producto.activo,
      })
      this.idProd = producto.id;
      this.edit = true;
    } else {
      this.edit = false;
      this.idProd = 0;
      this.productoForm.reset();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  guardar() {
    if (this.productoForm.invalid) {
      return;
    }
    const formData = this.productoForm.value;
    this.subscription.add(this.prodSVC.edit(formData, this.idProd).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.modalService.dismissAll();
        this.ngOnInit();
      }
    ));
  }

  eliminar(id: any) {
    Swal.fire({
      title: '¿Desea eliminar el usuario seleccionado?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Atras'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.prodSVC.delete(id).subscribe(
            (res) => {
              Swal.fire({
                icon: 'success',
                title: 'Ok',
                text: res.message
              });
              this.ngOnInit();
            }
          )
        );
      }
    });


    /* if (window.confirm("¿Esta seguro?")) {
      this.prodSVC.delete(id).subscribe(
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

  agregar() {
    if (this.productoForm.invalid) {
      return;
    }

    const formData = this.productoForm.value;
    this.subscription.add(this.prodSVC.new(formData).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: res.message
        });
        this.modalService.dismissAll();
        this.ngOnInit();
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
