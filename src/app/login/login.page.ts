import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';

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

  constructor(private modalController: ModalController) {}

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
}
