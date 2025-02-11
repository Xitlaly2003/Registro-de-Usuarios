import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class InfoModalComponent {
  @Input() username!: string;
  @Input() password!: string;

  constructor(private modalController: ModalController) {}

  cerrarModal() {
    this.modalController.dismiss();
  }
}
