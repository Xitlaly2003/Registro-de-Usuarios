import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { FirebaseService } from '../services/firebase.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  users: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private loadingController: LoadingController) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      name: ['', [Validators.required]], 
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', [Validators.required]], 
      birthDate: ['', [Validators.required]], 
    }, { validators: this.matchPasswords });
  }

  firebaseSvc = inject(FirebaseService);
  
  ngOnInit() {

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.router.navigate(['/home']);
    } 
  }
  //Author: Xitlaly Félix Céspedes.
  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value; 
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true }; 
  }

  toUpperCase() {
    const name = this.registerForm.get('name'); 
    if (name) {
      name.setValue(name.value.toUpperCase(), { emitEvent: false }); 
    }
  }

  get passwordsDoNotMatch() {
    return this.registerForm.hasError('passwordsMismatch') &&
      this.registerForm.get('confirmPassword')?.touched;
  }

  get email() { return this.registerForm.get('email'); }
  get user() { return this.registerForm.get('username'); }
  
  async register() {
    if (this.registerForm.valid) {
      const user: User = {
        uid: '',
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        role: ''
      };

      this.firebaseSvc.signUp(user).then(async res => {

        let uid = res.user.uid;
        this.registerFirestore(uid);
      }).catch(error => {
        console.log(error);
      })
    }
  }
 
  async registerFirestore(uid: string) {
    if (this.registerForm.valid) {
//Author: Xitlaly Félix Céspedes.
      const password = this.registerForm.value.password;
      const encryptedPassword = CryptoJS.AES.encrypt(password, '123456').toString();

      const user: User = {
        uid: uid,
        email: this.registerForm.value.email,
        password: encryptedPassword,
        username: this.registerForm.value.username,
        role: 'user' 
      };

      const loading = await this.presentLoading('Registrando...');
      let path = `USERS/${uid}`;
      try {
       
        const rolePath = `ROLES/${user.role}`;
        const roleDoc = await this.firebaseSvc.getDocument(rolePath);

        if (roleDoc.exists) {
          const roleData = roleDoc.data();
          const userWithPermissions = {
            ...user,
            permissions: roleData?.['permissions'] || []
          };

          await this.firebaseSvc.setDocument(path, userWithPermissions);
          await this.firebaseSvc.updateUser(this.registerForm.value.name);

          alert('Registro exitoso!');
          this.registerForm.reset();
          await loading.dismiss();
          this.router.navigate(['/login']);
        } else {
          console.log('Rol no encontrado');
          await loading.dismiss();
        }
      } catch (error) {
        console.log('Error en el registro:', error);
        await loading.dismiss();
      }
    }
  }
  
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent', 
      backdropDismiss: false,
      duration: 3000 
    });

    
    const loadingElement = await loading.present();
    const content = document.querySelector('.loading-content');

    if (content) {
      content.innerHTML = `
        <img src="/assets/Logo.png" class="loading-image" alt="UTEQ">
        <div class="loading-text" style="display: flex; justify-content: center; text-align: center; 15px; color: #fff;">
            ${message}
        </div>
      `;
    }
    return loading;
  }

}
