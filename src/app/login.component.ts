import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  login() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.userService.login(userData).then(
        (response) => {
          localStorage.setItem('token', response['token']);
          localStorage.setItem('user', JSON.stringify(response['user']));
          
          if (response['user'].role == 'NormalUser') {
            this.router.navigate(['/user/home']);
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
        },
        (error) => {
          this.errorMessage = 'Username or password is incorrect.';
        }
      );
    } else {
      this.errorMessage = 'Incorrect Info. Please check again!.';
    }
  }
}
