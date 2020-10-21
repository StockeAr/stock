import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore'
//import { getHeapSnapshot } from 'v8';
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(private firestore:AngularFirestore) { }
  getAlgo(){
    return this.firestore.collection("algo").snapshotChanges();
  }
  createAlgo(algo:any){
    return this.firestore.collection("algo").add(algo);
  }
  updateAlgo(id:any,algo:any){
    return this.firestore.collection("algo").doc(id).update(algo);
  }
  deleteAlgo(id:any){
    return this.firestore.collection("algo").doc(id).delete();
  }
}
