import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore directamente
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 
  // Inyecta AngularFirestore correctamente en el constructor
  constructor(
    //private auth: AngularFireAuth,
    //private firestore: AngularFirestore // Inyecta AngularFirestore en el constructor
  ) {}

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  // autenticación.
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }
  //Author:Xitlaly Félix Céspedes
  //base datos.
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  // Método documento de un rol
  getDocument(path: string) {
    const docRef = doc(getFirestore(), path);
    return getDoc(docRef); 
  }
  // Método datos del usuario
  async getUserData(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  // Método token del usuario
  async getToken(): Promise<string | null> {
    const user = getAuth().currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}
