import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './reset-password-s2.component.html',
})
export class ResetPasswordS2Component implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      resetCode: ['', [Validators.required, Validators.minLength(6)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        ],
      ],
    });

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  reset() {
    if (this.registerForm.valid && this.email) {
      // Kiểm tra email đã có
      const resetCode = this.registerForm.get('resetCode')?.value;
      const password = this.registerForm.get('password')?.value;

      this.userService
        .resetPassword(this.email, resetCode, password)
        .subscribe({
          next: (response) => {
            // Xử lý thành công
            this.successMessage = 'Password reset successfully!';
            this.errorMessage = null;

            // Điều hướng đến trang đăng nhập sau 2 giây (hoặc bạn có thể tùy chỉnh)
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err) => {
            // Xử lý lỗi
            this.errorMessage = 'Error resetting password. Please try again.';
            this.successMessage = null;
          },
        });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
