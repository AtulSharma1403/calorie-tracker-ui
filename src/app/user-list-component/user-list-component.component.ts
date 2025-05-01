import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FoodActivityModalComponent } from '../shared/food-activity-modal/food-activity-modal.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-user-list-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FoodActivityModalComponent, HeaderComponent, FooterComponent],
  templateUrl: './user-list-component.component.html',
  styleUrls: ['./user-list-component.component.scss']
})
export class UserListComponentComponent implements OnInit {
  @ViewChild(FoodActivityModalComponent) foodActivityModal!: FoodActivityModalComponent;
  
  showModal: boolean = false;
  selectedUser: any = null;
  users: any[] = [];
  activities: any[] = [];
  specificMotions: any[] = [];
  selectedActivity: any = null;
  selectedMotion: any = null;
  showSuccessAlert: boolean = false;
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<any[]>('https://calorie-tracker-bff.onrender.com/api/users').subscribe(
      (data) => {
        this.users = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        this.isLoading = false;
      }
    );

    this.loadActivities();
    this.loadSpecificMotions();
  }

  loadActivities() {
    // Load activities from your service
    this.activities = [
      { ACTIVITY: 'Walking' },
      { ACTIVITY: 'Running' },
      { ACTIVITY: 'Cycling' }
      // Add more activities as needed
    ];
  }

  loadSpecificMotions() {
    // Load specific motions from your service
    this.specificMotions = [
      { 'SPECIFIC MOTION': 'Slow walking', METs: 2.5 },
      { 'SPECIFIC MOTION': 'Fast walking', METs: 4.0 },
      { 'SPECIFIC MOTION': 'Jogging', METs: 7.0 }
      // Add more motions as needed
    ];
  }

  openModal(user: any): void {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveData(data: any): void {
    console.log('Saved data (legacy method):', data);
    // Keep for backward compatibility
  }
  
  // Handle success notifications from the modal
  handleSuccess(event: {message: string}): void {
    this.showSuccessAlert = true;
    this.successMessage = event.message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
    
    this.showModal = false;
  }

  onActivityChange() {
    if (this.selectedActivity) {
      this.http.get<any[]>(`https://calorie-tracker-bff.onrender.com/api/activities/${this.selectedActivity}`).subscribe(
        (data) => {
          this.specificMotions = data;
          this.selectedMotion = null;
        },
        (error) => {
          console.error('Failed to fetch activity details:', error);
          this.specificMotions = [];
          this.selectedMotion = null;
        }
      );
    } else {
      this.specificMotions = [];
      this.selectedMotion = null;
    }
  }

  viewUserData(user: any): void {
    if (user && user._id) {
      this.router.navigate(['/user-data', user._id]);
      console.log(`Navigating to /user-data/${user._id}`);
    } else {
      console.error('User ID is undefined or null');
    }
  }
}
