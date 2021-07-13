import { Component, OnInit } from '@angular/core';
import { VentaService } from 'src/app/service/venta/venta.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  dato: [{ name: string, value: number }];

  //ngscharts
  view: any[] = [700, 300];

  single = [
    { "name": "Germany", "value": 8940000 },
    { "name": "USA", "value": 5000000 },
    { "name": "France", "value": 7200000 },
    { "name": "UK", "value": 6200000 }
  ];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  //end

  constructor(private ventaSVC: VentaService) { }

  ngOnInit(): void {
    this.ventaSVC.estadisticas().subscribe(
      (res) => {
        //let result: any = res;
        console.log(res);
        const { venta } = res;
        this.dato = this.parseAndSaveData(venta);
      }
    );
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

  private parseAndSaveData(res: any[]): [{ name: string, value: number }] {
    let result: [{ name: string, value: number }] = [{ name: "", value: 0 }];
    for (let i of res) {
      let value=0;
      if(i.value!=null){
        value=parseInt(i.value);
      }
      result.push({
        name: i.name,
        value: value
      });
    }
    result.shift();
    return result;
  }

}
