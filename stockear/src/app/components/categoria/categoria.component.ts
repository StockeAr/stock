import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/varios.interface';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoria:Categoria[];
  constructor(private catSVC:CategoriaService) { }

  ngOnInit(): void {
    this.catSVC.getAll().subscribe((res)=>this.categoria=res)
  }

}
