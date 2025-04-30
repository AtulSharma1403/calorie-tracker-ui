import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodActivityModalComponent } from '../shared/food-activity-modal/food-activity-modal.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

interface CalorieEntry {
  date: string;
  bmr: string;
  calorieIn: string;
  calorieOut: string;
  netCalorie: string;
}

@Component({
  selector: 'app-user-data-component',
  standalone: true,
  imports: [CommonModule, FormsModule, FoodActivityModalComponent, HeaderComponent, FooterComponent],
  templateUrl: './user-data-component.component.html',
  styleUrls: ['./user-data-component.component.scss']
})
export class UserDataComponentComponent implements OnInit {
  userId: string = '';
  userName: string = 'James';
  selectedDate: string = '';
  calorieData: CalorieEntry[] = [];
  filteredEntry: CalorieEntry | null = null;
  isLoading: boolean = false;
  userBmr: any;
  showModal: boolean = false;
  showSuccessAlert: boolean = false;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    debugger
    // Get the user ID from the route
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.loadUserData();
      } else {
        this.loadCalorieData();
      }
    });
    
    // Set default selected date to today
    const today = new Date();
    this.selectedDate = today.toISOString().substring(0, 10);
  }

  loadUserData(): void {
    this.isLoading = true;
    
    // Get user info
    this.http.get<any>(`https://calorie-tracker-bff.onrender.com/api/users/${this.userId}`).subscribe(
      (userData) => {
        this.userBmr = userData.bmr
        this.userName = userData.name || 'James';
        this.loadCalorieData();
      },
      (error) => {
        console.error('Failed to fetch user data:', error);
        this.isLoading = false;
        this.loadCalorieData();
      }
    );
  }

  loadCalorieData(): void {
    this.isLoading = true;
    this.http.get<CalorieEntry[]>(`https://calorie-tracker-bff.onrender.com/api/activities/summary?userId=${this.userId}`).subscribe(
      (data) => {
        this.calorieData = data;
        this.updateFilteredEntry();
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch calorie data:', error);
        this.isLoading = false;
      }
    );
  }
  
  updateFilteredEntry(): void {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);
      this.filteredEntry = this.calorieData.find(entry => 
        this.formatDate(entry.date) === formattedDate
      ) || null;
    } else {
      this.filteredEntry = null;
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().substring(0, 10);
  }
  
  onDateChange(): void {
    this.updateFilteredEntry();
  }

  addData(): void {
    // Open food and activity data modal
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  saveData(data: any): void {
    console.log('Saved data:', data);
  }
  
  handleSuccess(event: {message: string}): void {
    this.showSuccessAlert = true;
    this.successMessage = event.message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
    
    // Refresh the data
    this.loadCalorieData();
  }

  viewDetails(entry: CalorieEntry): void {
    // Navigate to the user-details component with the userId and date
    this.router.navigate(['/user-details', this.userId, entry.date]);
    console.log(`Navigating to details for userId: ${this.userId}, date: ${entry.date}`);
  }
}
