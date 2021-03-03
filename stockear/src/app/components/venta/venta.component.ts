import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from 'src/app/models/user.interface';
import { Producto } from 'src/app/models/varios.interface';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ProductoService } from 'src/app/service/producto/producto.service';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  prod: Producto[];
  ventaInfo: Producto[] = [];
  ventaF: FormGroup;
  total: number = 0;

  myArray: {
    idProd: any[],
    cantidad: any[],
    adminId:number
  } = {
      idProd: [],
      cantidad: [],
      adminId:0
    };

  constructor(private productoSVC: ProductoService, private ventaSVC:VentaService, private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.productoSVC.getAll().subscribe((res) => this.prod = res);

    this.auth.user$.subscribe((user: UserResponse) => {
      this.myArray.adminId = user?.adminId;
    });
    this.ventaF = this.fb.group({
      prod: ['', [Validators.required, Validators.minLength(3)]],
      cant: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    this.ventaInfo.push(this.ventaF.value.prod);

    this.myArray.cantidad.push(this.ventaF.value.cant);
    this.myArray.idProd.push(this.ventaF.value.prod.id);

    this.total = this.total + ((this.ventaF.value.prod.costo) * (this.ventaF.value.cant));
  }

  /* ver() {
    console.log('idProd: '+JSON.stringify(this.idProd));
    console.log('cantidad: '+JSON.stringify(this.cantidad));
  } */

  eliminar(i: any, costo: any, cant: any) {
    this.myArray.idProd.splice(i, 1);
    this.myArray.cantidad.splice(i, 1);
    this.ventaInfo.splice(i, 1);
    this.total = this.total - (costo * cant);
  }

  confirmar() {
    if (this.myArray.cantidad.length == this.myArray.idProd.length) {
      this.ventaSVC.newVenta(this.myArray).subscribe((res)=>console.log(res));
    }
  }

}
