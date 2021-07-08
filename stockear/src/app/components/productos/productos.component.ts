import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from 'src/app/models/varios.interface';
import { CategoriaService } from 'src/app/service/categoria/categoria.service';
import { MedidaService } from 'src/app/service/medida/medida.service';
import { ProductoService } from 'src/app/service/producto/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {

  productos: Producto[];

  producto = this.formB.group({
    cantidad: ['', [Validators.required, Validators.min(1)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    costo: ['', [Validators.required]],
    minExistencia: ['', [Validators.required]],
    categoriaId: ['', [Validators.required]],
    imagen: [''],
    medidaId: [''],
  });
  idProd = 0;
  categoria: any[];
  edit: boolean = false;
  medida: any[];

  constructor(
    private prodSVC: ProductoService,
    private modalService: NgbModal,
    private formB: FormBuilder,
    private categoriaService: CategoriaService,
    private medidaService: MedidaService,
  ) { }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.prodSVC.getAll().subscribe(
      (res) => {
        this.productos = res
      });
    this.categoriaService.getAll().subscribe(
      (res) => {
        this.categoria = res;
      }
    );

    this.medidaService.getAll().subscribe(
      (res) => {
        this.medida = res;
      }
    )
  }

  open(content: any, producto?: any): void {
    if (producto) {
      this.producto.setValue({
        cantidad: producto.cantidad,
        descripcion: producto.descripcion,
        costo: producto.costo,
        minExistencia: producto.minExistencia,
        categoriaId: producto.categoria.id,
        imagen: producto.imagen,
        medidaId: producto.medida?.id || null,
      })
      this.idProd = producto.id;
      this.edit = true;
    }
    this.modalService.open(content);
  }

  guardar() {
    if (this.producto.invalid) {
      return;
    }
    const formData = this.producto.value;
    this.prodSVC.edit(formData, this.idProd).subscribe(
      (res) => {
        window.alert(res?.message);
        this.producto.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
      }
    )
  }

  eliminar(id: any) {
    if (window.confirm("¿Esta seguro?")) {
      this.prodSVC.delete(id).subscribe(
        (res) => {
          window.alert(res?.message)
          this.ngOnInit();
        }
      );
    }
  }

  agregar() {
    if (this.producto.invalid) {
      return;
    }

    const formData = this.producto.value;
    this.prodSVC.new(formData).subscribe(
      (res) => {
        window.alert(res?.message);
        this.producto.reset();
        this.modalService.dismissAll();
        this.ngOnInit();
        this.edit = false;
      }
    )
  }

}
