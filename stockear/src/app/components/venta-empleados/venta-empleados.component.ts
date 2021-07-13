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

  //ngxcharts
  single = [
    { "name": "Germany", "value": 8940000 },
    { "name": "USA", "value": 5000000 },
    { "name": "France", "value": 7200000 },
    { "name": "UK", "value": 6200000 }
  ];

  view: any[] = [900, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  //end

  dibujar: [{ name: string, value: number }];
  constructor(private ventaSVC: VentaService, private modalService: NgbModal) {
    //Object.assign(this, { single });
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.ventaSVC.ventaEmpleados().subscribe(
      (res) => {
        this.ventas = res;
        this.loadData();
      }
    );
  }

  loadData() {
    //console.log("cargando datos");
    let dibu: any[] = [];
    let aux: any[] = [];
    for (let i of this.ventas) {
      dibu.push({
        "name": `${i.user.nombre} ${i.user.apellido}`,
        "value": i.total,
        "id": i.user.id
      })
    }
    for (let i = 0; i < dibu.length; i++) {
      if (i == 0) {
        aux.push({
          "name": dibu[i].name,
          "value": dibu[i].value,
          "id": dibu[i].id
        })
      } else {
        let insert = false;
        for (let j = 0; j < dibu.length; j++) {
          if (dibu[i]?.id == aux[j]?.id) {
            aux[j] = {
              "name": dibu[i].name,
              "value": dibu[i].value + aux[j].value,
              "id": aux[j].id
            }
            insert = true;
            break;
          }
        }
        if (!insert) {
          aux.push({
            "name": dibu[i].name,
            "value": dibu[i].value,
            "id": dibu[i].id
          })
        }
      }
    }
    this.dibujar=[{name:"alalal",value:11111}]
    for (let i of aux) {
      this.dibujar.push({ name: i.name, value: i.value });
    }
    this.dibujar.shift();
    console.log(this.dibujar);
  }

  open(content: any, info: any) {
    this.detalle = info;
    this.modalService.open(content)
  }

  //ngxcharts
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  //end

}
