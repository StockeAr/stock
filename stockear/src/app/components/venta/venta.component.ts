import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/varios.interface';
import { ProductoService } from 'src/app/service/producto/producto.service';
import { VentaService } from 'src/app/service/venta/venta.service';
import { BaseErrorMessage } from 'src/app/utils/base-field-error';
import swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, OnDestroy {
  prod: Producto[];
  ventaInfo: Producto[] = [];
  ventaF = this.fb.group({
    prod: ['', [Validators.required, Validators.minLength(3)]],
    cant: [0, [Validators.required, Validators.min(0.01)]]
  });
  total: number = 0;

  myArray: {
    idProd: any[],
    cantidad: any[]
  } = {
      idProd: [],
      cantidad: []
    };

  filterProd = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private productoSVC: ProductoService,
    private ventaSVC: VentaService,
    private fb: FormBuilder,
    //private auth: AuthService,
    private baseError: BaseErrorMessage
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.productoSVC.getActive().subscribe((res) => this.prod = res));
    this.total = 0;
    this.myArray.cantidad = [];
    this.myArray.idProd = [];
    this.ventaInfo = [];
    /* this.auth.user$.subscribe((user: UserResponse) => {
      this.myArray.adminId = user?.adminId;
    }); */

    this.baseError.base = this.ventaF;
  }

  onSubmit() {
    if (this.ventaF.invalid) {
      console.log("no valido");
      return;
    }

    if (this.existe(this.ventaF.value.prod.id)) {
      swal.fire('Opps', `Elimine y actualize el pedido de ${this.ventaF.value.prod.descripcion}`, 'warning');
    } else {
      if (this.ventaF.value.prod.medida != null) {
        this.myArray.cantidad.push(this.ventaF.value.cant);
        this.myArray.idProd.push(this.ventaF.value.prod.id);
        this.total = this.total + ((this.ventaF.value.prod.costo) * (this.ventaF.value.cant));
      } else {
        if (this.ventaF.value.cant >= 1) {
          this.myArray.cantidad.push(Math.trunc(this.ventaF.value.cant));
          this.myArray.idProd.push(this.ventaF.value.prod.id);
          this.total = this.total + ((this.ventaF.value.prod.costo) * (Math.trunc(this.ventaF.value.cant)));
        } else {
          swal.fire('Opps', 'Ingrese un valor entero', 'error');
          return;
        }
      }
      this.ventaInfo.push(this.ventaF.value.prod);
    }
    this.ventaF.reset();
  }

  /* ver() {
    console.log('idProd: '+JSON.stringify(this.idProd));
    console.log('cantidad: '+JSON.stringify(this.cantidad));
  } */

  private existe(id: any): boolean {
    let aux: boolean = false;
    if (this.myArray.idProd.length > 0) {
      for (let i = 0; i < this.myArray.idProd.length; i++) {
        if (this.myArray.idProd[i] == id) {
          aux = true;
          break;
        }
      }
    }
    return aux;
  }

  eliminar(i: any, costo: any, cant: any) {
    this.myArray.idProd.splice(i, 1);
    this.myArray.cantidad.splice(i, 1);
    this.ventaInfo.splice(i, 1);
    this.total = this.total - (costo * cant);
  }

  confirmar() {
    if ((this.myArray.cantidad.length == this.myArray.idProd.length) && (this.myArray.cantidad.length > 0 && this.myArray.idProd.length > 0)) {
      //this.ventaSVC.newVenta(this.myArray).subscribe((res)=>console.log(res));
      swal.fire({
        title: '¿Desea realizar la venta?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Atras'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ventaSVC.newVenta(this.myArray).subscribe(
            (res) => {
              swal.fire('Realizado', res?.message, 'success');
              this.ngOnInit();
            })
        } else if (result.isDenied) {
          swal.fire('No se realizo la venta', '', 'info');
        }
      })
    } else {
      swal.fire('Opss', 'Añada articulos al Carrito', 'warning');
    }
  }

  checkField(field: string): boolean {
    return this.baseError.isValidField(field);
  }

  fieldMessage(field: string): string {
    return this.baseError.getErrorMessage(field);
  }
}
