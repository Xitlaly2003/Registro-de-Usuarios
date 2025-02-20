import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: any; 
  token: string = '';
  mensaje: boolean = false;
  mostrarInfoUsuario: boolean = false;
  mostrarAdminOpciones: boolean = false;

  constructor(private router: Router) { }
  //Author: 
  ngOnInit() {
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      this.user = JSON.parse(storedUser); 
      this.token = storedToken; 
    } else {
      
      this.router.navigate(['/login']);
    }
  }

  info() {
    this.mensaje = true;
    setTimeout(() => {
      this.mensaje = false;
    }, 5000);
  }
  //Author: 
  login() {
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      console.log('Ya tienes una sesión activa. No puedes ir al login.');
      return; 
    }
    this.router.navigate(['/login']);
  }
  
  logout() {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); 
    });
  }

  toggleUserInfo() {
    this.mostrarInfoUsuario = !this.mostrarInfoUsuario;
  }

  toggleAdminOptions() {
    this.mostrarAdminOpciones = !this.mostrarAdminOpciones;
  }

  verUsuarios() {
    console.log('Ver usuarios');
  }

  agregarUsuario() {
    console.log('Agregar usuario');
  }

  eliminarUsuario() {
    console.log('Eliminar usuario');
  }

}
