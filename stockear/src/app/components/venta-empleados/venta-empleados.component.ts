import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-venta-empleados',
  templateUrl: './venta-empleados.component.html',
  styleUrls: ['./venta-empleados.component.css']
})
export class VentaEmpleadosComponent implements OnInit, OnDestroy {

  ventas: any[] = [];
  detalle: any[] = [];
  private subscription: Subscription = new Subscription();
  constructor(private ventaSVC: VentaService, private modalService: NgbModal) {
    //Object.assign(this, { single });
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.subscription.unsubscribe();
    console.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.ventaSVC.ventaEmpleados().subscribe(
      (res) => {
        this.ventas = res;
      }
    ));
  }

  open(content: any, info: any) {
    this.detalle = info;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
  }

}
