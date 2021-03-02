import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Venta, VentaDetalle } from 'src/app/models/venta.interface';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  ventas: Venta[];
  closeResult = '';
  ventaInfo:VentaDetalle[];

  constructor(private ventaSVC: VentaService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.ventaSVC.getAll().subscribe((res) => this.ventas = res);
  }

  open(content, id: number) {
    if(id){
      this.ventaSVC.getById(id).subscribe((res) => this.ventaInfo=res);
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

}
