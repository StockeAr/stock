import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
@Injectable()
export class UsuarioService {
  public user: User;

  constructor(public afAuth: AngularFireAuth) { }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('usuario logeado');
      console.log(result);
      return result;
    }
    catch (error) {
      console.log(error);
    }

  }
  async register(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('usuario registrado');
      console.log(result);
      return result;
    }
    catch (error) {
      console.log(error);
    }

  }
  async logout() {
    try {
      await this.afAuth.signOut();
      console.log('usuario deslogeado');
    }
    catch (error) {
      console.log(error);
    }

  }
}
