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
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './reset-password-s1.component.html',
})
export class ResetPasswordS1Component implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendEmail() {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;

      this.userService.forgotPassword(email).subscribe({
        next: (response) => {
          this.successMessage = 'A reset code has been sent to your email.';
          this.errorMessage = null; // Reset error message
          // Optionally redirect or perform further actions
          this.router.navigate(['/reset-password-s2'], {
            queryParams: { email },
          });
        },
        error: (err) => {
          this.errorMessage = 'Failed to send email. Please try again later.';
          this.successMessage = null; // Reset success message
        },
      });
    } else {
      this.errorMessage = 'Incorrect Email. Please check again!';
      this.successMessage = null; // Reset success message
    }
  }
}
