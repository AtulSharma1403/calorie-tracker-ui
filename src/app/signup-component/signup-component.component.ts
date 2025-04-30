import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-signup-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule, HeaderComponent, FooterComponent],
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

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

  navigateToUserList() {
    if (this.signupForm.valid) {
      this.saveUser();
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  saveUser() {
    const userData = this.signupForm.value;
    
    this.http.post('https://calorie-tracker-bff.onrender.com/api/users', userData).subscribe(
      (response) => {
        console.log('User saved successfully:', response);
        this.router.navigate(['/user-list']);
      },
      (error) => {
        console.error('Failed to save user:', error);
        alert('Failed to save user data. Please try again.');
      }
    );
  }

  hasError(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
}
