import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';
import { getAuth } from 'firebase/auth';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isValid: boolean = false;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
  //Author: Xitlaly Félix Céspedes.
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.router.navigate(['/home']);
    } 
  }

  usuarios = [
    { username: 'admin', password: 'admin' },
    { username: 'xitlaly', password: '123456' }
  ];

  validarCampos() {
    this.username = this.username.replace(/\s+/g, '').toLowerCase(); 
    this.password = this.password.replace(/\s+/g, ''); 

    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        username: this.username,
        password: this.password,
      },
    });
    return await modal.present();
  }

  async inicio() {
 //Author: Xitlaly Félix Céspedes 
    const user: User = {
      uid: '',
      email: this.username,
      password: this.password,
      username: '',
      role: ''
    };
    try {
  
      const res = await this.firebaseSvc.signIn(user);
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const token = await this.firebaseSvc.getToken();
        if (token) {
          localStorage.setItem('token', token);
        }
        console.log(currentUser.uid);
        console.log(token);
        this.getUserInfo(res.user.uid);
        await this.presentLoading('Accediendo...', () => {
          this.router.navigate(['/home']);
        });
      }
    } catch (error) {
      console.error('Error en el login:', error);
   
    }
  }
  async getUserInfo(uid: string) {
        let path = `USERS/${uid}`;
  
        this.firebaseSvc.getUserData(path).then((user: User) => {
          localStorage.setItem('user', JSON.stringify({
            username: user['username'],
            role: user['role'],
            permissions: user['permissions']
          }));
        })
    }
  //Author: Xitlaly Félix Céspedes 
  async presentLoading(mensaje: string, callback: Function) {

    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000 
    });
    await loading.present();
    await loading.onDidDismiss();
    callback(); 
  }
 
  register() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      console.log('Ya tienes una sesión activa. No puedes ir al registro.');
      return; 
    }
    this.router.navigate(['/register']);
  }
}
