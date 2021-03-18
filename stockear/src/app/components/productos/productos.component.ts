import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/varios.interface';
import { ProductoService } from 'src/app/service/producto/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos:Producto[];

  constructor(private prodSVC:ProductoService) { }

  ngOnInit(): void {
    this.prodSVC.getAll().subscribe((res)=>this.productos=res);
  }

}
