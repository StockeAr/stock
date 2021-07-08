import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-venta-empleados',
  templateUrl: './venta-empleados.component.html',
  styleUrls: ['./venta-empleados.component.css']
})
export class VentaEmpleadosComponent implements OnInit, OnDestroy {

  ventas: any[] = [];
  detalle: any[] = [];

  constructor(private ventaSVC: VentaService, private modalService: NgbModal) { }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.ventaSVC.ventaEmpleados().subscribe(
      (res) => {
        this.ventas = res;
      }
    );
  }

  open(content: any, info: any) {
    this.detalle = info;
    this.modalService.open(content)
  }

}
