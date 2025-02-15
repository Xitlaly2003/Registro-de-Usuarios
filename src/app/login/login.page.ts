import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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

  constructor(private modalController: ModalController, private router: Router, private loadingController: LoadingController) {}
   
  personas = [{username: 'xitlaly', password: '123456'}];

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

  inicio() {

    const usuarioEncontrado = this.personas.find(user => 
      user.username === this.username && user.password === this.password
    );
    if (usuarioEncontrado) {
      this.presentLoading('Iniciando...', () => {
        this.router.navigate(['/home']); 
      });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
  //Author: Xitlaly Félix Céspedes.
  async presentLoading(mensaje: string, callback: Function) {

    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000 
    });
    await loading.present();
    await loading.onDidDismiss();
    callback(); 
  }
}
