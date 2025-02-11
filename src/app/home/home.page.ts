import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  showMessage: boolean = false;

  constructor(private router: Router) {}

  showInfo() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 5000);
  }

  login(){
    this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
  }

}
