import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-signup-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.scss']
})
export class SignupComponentComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.required]],
    weight: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    height: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
    gender: ['', [Validators.required]],
    age: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  navigateToUserList() {
    if (this.signupForm.valid) {
      this.router.navigate(['/user-list']);
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
}
