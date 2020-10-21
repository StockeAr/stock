import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseServiceService } from '../../service/firebase/firebase-service.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  config: any;
  collection = { count: 5, data: [] };
  closeResult = '';
  algoForm: FormGroup;
  flag: boolean;
  idFirebaseActual: string;
  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private firebaseService: FirebaseServiceService) { }

  ngOnInit(): void {
    this.idFirebaseActual = '';
    this.flag=false;
    this.algoForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });

    //esto era para crear algos a modo de prueba
    /* for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push({
        id: i,
        nombre: 'algo' + i,
        apellido: 'ritmo' + i
      });
    } */

    this.firebaseService.getAlgo().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          id: e.payload.doc.data().id,
          nombre: e.payload.doc.data().nombre,
          apellido: e.payload.doc.data().apellido,
          idFirebase: e.payload.doc.id
        }
      })
    }, error => {
      console.error(error);
    }
    );
  }

  eliminar(item: any): void {
    /* var indice = item;
    console.log('este es el indice seleccionado ' + indice);
    var borrado = this.collection.data.splice(indice, 1);
    console.log('se ha borrado el item ' + borrado); */
    this.firebaseService.deleteAlgo(item.idFirebase);
  }

  editarOpen(content, item: any) {
    //esto llena el form
    this.algoForm.setValue({
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido
    });
    this.idFirebaseActual=item.idFirebase;
    this.flag=true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editar() {
    if (this.idFirebaseActual != null || this.idFirebaseActual != undefined) {
      this.firebaseService.updateAlgo(this.idFirebaseActual, this.algoForm.value).then(resp => {
        this.algoForm.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });
    }

  }

  open(content) {
    this.flag=false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  guardar(): void {
    /* this.collection.data.push(this.algoForm.value);
    this.algoForm.reset();
    this.modalService.dismissAll(); */
    this.firebaseService.createAlgo(this.algoForm.value).then(resp => {
      this.algoForm.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error);
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
