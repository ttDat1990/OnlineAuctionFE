import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';
import { NavbarComponent } from './user/header/navbar.component';

declare var google: any;

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isRemembered: boolean = false;
  rememberedUsername: string | null = null;

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

    // Check if the user has previously chosen to remember their credentials
    const storedUser = localStorage.getItem('rememberedUser');
    if (storedUser) {
      const { username, password } = JSON.parse(storedUser);
      this.loginForm.patchValue({ username });
      this.isRemembered = true;
      this.rememberedUsername = username;
    }
  }
  login() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.userService.login(userData).then(
        (response) => {
          localStorage.setItem('token', response['token']);
          localStorage.setItem('user', JSON.stringify(response['user']));

          // Save credentials if "Remember Me" is checked
          console.log(this.isRemembered);
          if (this.isRemembered) {
            localStorage.setItem(
              'rememberedUser',
              JSON.stringify({
                username: userData.username,
              })
            );
          } else {
            localStorage.removeItem('rememberedUser');
          }

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

  check(event: Event): void {
    const checkbox = event.target as HTMLInputElement; // Cast event.target thành HTMLInputElement
    this.isRemembered = checkbox.checked; // Cập nhật trạng thái isRemembered
  }

  signInWithGoogle() {
    google.accounts.id.initialize({
      client_id:
        '449937410839-61opgrqr2ei4lkssp2jcs6gbrbtq993u.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.prompt(); // Chỉ cần gọi phương thức này
  }

  handleCredentialResponse(response: any) {
    if (!response) {
      return;
    }
    if (!response.credential) {
      return;
    }
    if (response && response.credential) {
      const idToken = response.credential;
      this.userService.loginWithGoogle(idToken).then(
        (response) => {
          // Kiểm tra xem có token hay không
          if (response && response['token']) {
            localStorage.setItem('token', response['token']);
            localStorage.setItem('user', JSON.stringify(response['user']));
            this.router.navigate(['/user/home']);
          } else if (response === 'User not registered') {
            // Hiển thị thông báo nếu người dùng chưa đăng ký
            this.errorMessage = 'User not registered. Please sign up first.';
          }
        },
        (error) => {
          console.error('Login with Google failed:', error);
          // Hiển thị lỗi nếu đăng nhập thất bại
          if (error.error && error.error.message === 'User not registered') {
            this.errorMessage = 'User not registered. Please sign up first.';
          } else {
            this.errorMessage = 'Google login failed.';
          }
        }
      );
    } else {
      console.error('No credential received in response');
    }
  }
}
