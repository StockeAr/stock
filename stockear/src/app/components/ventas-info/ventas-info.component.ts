import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Venta, VentaDetalle } from 'src/app/models/venta.interface';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-ventas-info',
  templateUrl: './ventas-info.component.html',
  styleUrls: ['./ventas-info.component.css']
})
export class VentasInfoComponent implements OnInit, OnDestroy {

  ventas: Venta[];
  closeResult = '';
  ventaInfo: VentaDetalle[];

  private subscription: Subscription = new Subscription();

  constructor(private ventaSVC: VentaService, private modalService: NgbModal) { }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.subscription.unsubscribe();
    console.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.ventaSVC.getAll().subscribe((res) => this.ventas = res));
  }

  open(content, id: number) {
    this.ventaInfo = [];
    if (id) {
      this.subscription.add(this.ventaSVC.getById(id).subscribe(
        (res) => {
          this.ventaInfo = res
        }
      ));
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  }
}
