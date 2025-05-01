import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FoodActivityModalComponent } from '../shared/food-activity-modal/food-activity-modal.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FoodActivityModalComponent, HeaderComponent, FooterComponent],
  templateUrl: './user-details-component.component.html',
  styleUrls: ['./user-details-component.component.scss']
})
export class UserDetailsComponentComponent implements OnInit {
  currentDate = new Date();
  displayDate = '6/27/2022';
  userName = '';
  userId: string = '';
  selectedDate: string = '';
  userBmr: number = 0;
  isLoading: boolean = true;
  isFoodLoading: boolean = true;
  isActivityLoading: boolean = true;
  showModal: boolean = false;
  showSuccessAlert: boolean = false;
  successMessage: string = '';
  
  foodData: any[] = [];
  activityData: any[] = [];

  calorieStats = {
    bmr:0,
    food: 0,
    activity: 0,
    netCalorie: 0
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.selectedDate = params['date'];
      this.displayDate = this.selectedDate || this.displayDate;
      this.isLoading = true;
      this.isFoodLoading = true;
      this.isActivityLoading = true;
      this.fetchUserData();
      this.fetchFoodData();
      this.fetchActivityData();
    });
  }

  fetchUserData(): void {
    this.http.get<any>(`https://calorie-tracker-bff.onrender.com/api/users/${this.userId}`).subscribe(
      (userData) => {
        this.userBmr = userData.bmr;
        this.userName = userData.name;
      },
      (error) => {
        console.error('Failed to fetch user data:', error);
      }
    );
  }

  fetchFoodData(): void {
    this.isFoodLoading = true;
    this.http.get<any[]>(`https://calorie-tracker-bff.onrender.com/api/foods/userfood?userId=${this.userId}&date=${this.selectedDate}`).subscribe(
      (data) => {
        this.foodData = data;
        this.isFoodLoading = false;
        this.updateCalorieStats();
        this.updateLoadingState();
      },
      (error) => {
        console.error('Failed to fetch food data:', error);
        this.isFoodLoading = false;
        this.updateLoadingState();
      }
    );
  }

  fetchActivityData(): void {
    this.isActivityLoading = true;
    this.http.get<any[]>(`https://calorie-tracker-bff.onrender.com/api/activities/useractivity?userId=${this.userId}&date=${this.selectedDate}`).subscribe(
      (data) => {
        this.activityData = data;
        this.isActivityLoading = false;
        this.updateCalorieStats();
        this.updateLoadingState();
      },
      (error) => {
        console.error('Failed to fetch activity data:', error);
        this.isActivityLoading = false;
        this.updateLoadingState();
      }
    );
  }

  updateLoadingState(): void {
    this.isLoading = this.isFoodLoading || this.isActivityLoading;
  }

  updateCalorieStats(): void {
    // Calculate total calories from food
    const foodCalories = this.foodData.reduce((total, item) => total + (item.calorie || 0), 0);
    
    // Calculate total calories burned from activities
    const activityCalories = this.activityData.reduce((total, item) => total + (item.calorie || 0), 0);
    
    this.calorieStats = {
      bmr: this.userBmr,
      food: foodCalories,
      activity: activityCalories,
      netCalorie: foodCalories - this.userBmr - activityCalories
    };
  }

  addData(): void {
    // Open the modal
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
    this.fetchFoodData();
    this.fetchActivityData();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.fetchFoodData();
    this.fetchActivityData();
  }
}
