import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseServiceService } from '../../service/firebase/firebase-service.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  config: any;
  collection = [];
  closeResult = '';
  algoForm: FormGroup;
  flag: boolean;
  idFirebaseActual: string;

  emailPattern:any="(^\w{2,15}\.?\w{1,15})\@(\w{2,15}\.[a-zA-Z]{2,10})$";
  crearFormGroup(){
    return new FormGroup({
      mail:new FormControl('',[Validators.required,Validators.minLength(9),Validators.maxLength(57),Validators.pattern(this.emailPattern)]),
      texto:new FormControl('',[Validators.required]),
      fecha:new FormControl('',[Validators.required]),
      numero:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(8)]),
      contraseña:new FormControl('',[Validators.required]),
    })
  }
  prueba:FormGroup;

  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private firebaseService: FirebaseServiceService) { 
    this.prueba=this.crearFormGroup();
  }

  ngOnInit(): void {
    this.idFirebaseActual = '';
    this.flag = false;
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
      this.collection = resp.map((e: any) => {
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

    /*
    NOTA: las validaciones en elos campos tienen las siguiente forma.....

    'nombreCampo':[valor,[validacionSincronica],[validacionAsincronica]]
    */
  }

  resetForm(){
    this.prueba.reset();
  }

  saveData(){
    if(this.prueba.valid){
      console.log('Valido : ',this.prueba.value());
      this.resetForm();
    }else{
      console.log('no valido');
    }
  }
  get mail(){return this.prueba.get('mail');}
  get texto(){return this.prueba.get('texto');}
  get fecha(){return this.prueba.get('fecha');}
  get numero(){return this.prueba.get('numero');}
  get contraseña(){return this.prueba.get('contraseña');}



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
    this.idFirebaseActual = item.idFirebase;
    this.flag = true;
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
    this.flag = false;
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
