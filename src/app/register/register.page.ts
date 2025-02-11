import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  users: any[] = []; 

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      user: ['', [Validators.required, Validators.pattern(/^\S*$/)]], // Sin espacios
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
    }, { validators: this.matchPasswords });
  }

  ngOnInit() {
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  toUpperCase() {
    const fullName = this.registerForm.get('fullName');
    if (fullName) {
      fullName.setValue(fullName.value.toUpperCase(), { emitEvent: false });
    }
  }

  get passwordsDoNotMatch() {
    return this.registerForm.hasError('passwordsMismatch') &&
           this.registerForm.get('confirmPassword')?.touched;
  }

  get email() { return this.registerForm.get('email'); }
  get user() { return this.registerForm.get('user'); }

  register() {
    if (this.registerForm.valid) {
      this.users.push(this.registerForm.value); //se guarda en el arreglo users
      console.log('Datos del usuario:', this.registerForm.value);
      alert('Registro exitoso');
      this.registerForm.reset();
    }
  }
}
