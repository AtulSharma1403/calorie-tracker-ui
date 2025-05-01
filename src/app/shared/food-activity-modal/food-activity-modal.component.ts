import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-food-activity-modal',
  templateUrl: './food-activity-modal.component.html',
  styleUrls: ['./food-activity-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FoodActivityModalComponent implements OnInit {
  foods: any[] = [];
  foodNames: any[] = [];
  allFoodNames: any[] = [];
  maxDate: string = '';
  minDate: string = '';
  
  // Alert properties
  alertMessage: string = '';
  showAlert: boolean = false;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'danger';

  // Validation properties
  formErrors: {[key: string]: boolean} = {};
  submitted: boolean = false;
  
  @Input() userId: string = '';
  @Input() set show(value: boolean) {
    if (value !== this._show) {
      this._show = value;
      if (value) {
        this.resetForm();
      }
    }
  }
  
  get show(): boolean {
    return this._show;
  }
  
  private _show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() successNotification = new EventEmitter<{message: string}>();
  
  activeTab: 'food' | 'activity' = 'food';
  
  foodData: any = {
    date: '',
    foodName: '',
    mealType: '',
    foodGroup: '',
    serving: ''
  };
  
  activityData: any = {
    date: '',
    activityName: '',
    specificMotion: '',
    description: '',
    metValue: '',
    durationHours: 0,
    durationMinutes: 0
  };

  users: any[] = [];
  activities: any[] = [];
  specificMotions: any[] = [];

  private apiUrl = 'https://calorie-tracker-bff.onrender.com/api';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${this.apiUrl}/activities`).subscribe(
      (data: any[]) => {
        this.activities = data;
      },
      (error) => {
        console.error('Failed to fetch activities:', error);
      }
    );
    this.http.get<any[]>(`${this.apiUrl}/foods/groups`).subscribe(
      (data: any[]) => {
        this.foods = data;
      },
      (error) => {
        console.error('Failed to fetch food groups:', error);
      }
    );
    
    // Set date constraints to last 30 days
    this.setDateConstraints();
  }
  
  closeModal(): void {
    this.close.emit();
  }
  
  // Display alert message
  showAlertMessage(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Validate food form fields
  validateFoodForm(): boolean {
    this.formErrors = {};
    this.submitted = true;
    
    let isValid = true;
    
    if (!this.foodData.date) {
      this.formErrors['foodDate'] = true;
      isValid = false;
    }
    
    if (!this.foodData.foodGroup) {
      this.formErrors['foodGroup'] = true;
      isValid = false;
    }
    
    if (!this.foodData.foodName) {
      this.formErrors['foodName'] = true;
      isValid = false;
    }
    
    if (!this.foodData.mealType) {
      this.formErrors['mealType'] = true;
      isValid = false;
    }
    
    if (!this.foodData.serving) {
      this.formErrors['serving'] = true;
      isValid = false;
    }
    
    return isValid;
  }
  
  // Validate activity form fields
  validateActivityForm(): boolean {
    this.formErrors = {};
    this.submitted = true;
    
    let isValid = true;
    
    if (!this.activityData.date) {
      this.formErrors['activityDate'] = true;
      isValid = false;
    }
    
    if (!this.activityData.activityName) {
      this.formErrors['activityName'] = true;
      isValid = false;
    }
    
    if (!this.activityData.specificMotion) {
      this.formErrors['specificMotion'] = true;
      isValid = false;
    }
    
    if (!this.activityData.metValue) {
      this.formErrors['metValue'] = true;
      isValid = false;
    }
    
    const hours = parseInt(this.activityData.durationHours) || 0;
    const minutes = parseInt(this.activityData.durationMinutes) || 0;
    
    if (hours === 0 && minutes === 0) {
      this.formErrors['durationRequired'] = true;
      isValid = false;
    }
    
    return isValid;
  }
  
  saveFood(): void {
    if (!this.validateFoodForm()) {
      this.showAlertMessage('Please fill in all required fields.', 'danger');
      return;
    }
    
    if (!this.userId) {
      console.error('No user selected');
      this.showAlertMessage('No user selected. Please select a user before saving data.', 'danger');
      return;
    }
    
    // Save food data directly using the process method
    this.processFoodDataSave(this.userId, this.foodData).subscribe(
      (response) => {
        console.log('Food data saved successfully:', response);
        this.successNotification.emit({ message: 'Food data saved successfully!' });
        this.closeModal();
      },
      (error) => {
        console.error('Failed to save food data:', error);
        this.showAlertMessage('Failed to save food data. Please try again.', 'danger');
      }
    );
  }
  
  saveActivity(): void {
    if (!this.validateActivityForm()) {
      this.showAlertMessage('Please fill in all required fields.', 'danger');
      return;
    }
    
    // Validate userId
    if (!this.userId) {
      console.error('No user selected');
      this.showAlertMessage('No user selected. Please select a user before saving data.', 'danger');
      return;
    }
    
    const hours = parseInt(this.activityData.durationHours) || 0;
    const minutes = parseInt(this.activityData.durationMinutes) || 0;
    const totalMinutes = (hours * 60) + minutes;
    
    // Create a copy of the activity data with duration in the format expected by the API
    const activityDataToSave = {
      ...this.activityData,
      duration: {
        hours,
        minutes,
        totalMinutes
      }
    };
    
    // Save activity data directly using the process method
    this.processActivityDataSave(this.userId, activityDataToSave).subscribe(
      (response) => {
        console.log('Activity data saved successfully:', response);
        this.successNotification.emit({ message: 'Activity data saved successfully!' });
        this.closeModal();
      },
      (error) => {
        console.error('Failed to save activity data:', error);
        this.showAlertMessage('Failed to save activity data. Please try again.', 'danger');
      }
    );
  }
  
  setActiveTab(tab: 'food' | 'activity'): void {
    this.activeTab = tab;
    this.submitted = false;
    this.formErrors = {};
  }

  onActivityChange(): void {
    if (this.activityData.activityName) {
      this.http.get<any[]>(`${this.apiUrl}/activities/${this.activityData.activityName}`).subscribe(
        (data: any[]) => {
          this.specificMotions = data;
          this.activityData.specificMotion = '';
          this.activityData.metValue = '';
        },
        (error) => {
          console.error('Failed to fetch specific motions:', error);
        }
      );
    }
  }

  onSpecificMotionChange(): void {
    if (this.activityData.specificMotion) {
      const selectedMotion = this.specificMotions.find(motion => motion['SPECIFIC_MOTION'] === this.activityData.specificMotion);
      if (selectedMotion) {
        this.activityData.metValue = selectedMotion.METs || '';
      }
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setDateConstraints(): void {
    // Set max date to today
    this.maxDate = this.getCurrentDate();
    
    // Set min date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const year = thirtyDaysAgo.getFullYear();
    const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
    const day = String(thirtyDaysAgo.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  resetForm(): void {
    // Reset food data
    this.foodData = {
      date: this.getCurrentDate(),
      foodName: '',
      mealType: '',
      foodGroup: '',
      serving: ''
    };
    
    // Reset activity data
    this.activityData = {
      date: this.getCurrentDate(),
      activityName: '',
      specificMotion: '',
      description: '',
      metValue: '',
      durationHours: 0,
      durationMinutes: 0
    };
    
    // Reset food names to show all options
    this.foodNames = this.allFoodNames;
    
    // Reset validation state
    this.submitted = false;
    this.formErrors = {};
    
    // Set default active tab
    this.activeTab = 'food';
  }

  onFoodGroupChange(): void {
    if (this.foodData.foodGroup) {
      this.http.get<any[]>(`${this.apiUrl}/foods/group/${this.foodData.foodGroup}`).subscribe(
        (data: any[]) => {
          this.foodNames = data;
          // Reset food name when group changes
          this.foodData.foodName = '';
        },
        (error) => {
          console.error('Failed to fetch foods by group:', error);
          // Reset to empty array
          this.foodNames = [];
          this.foodData.foodName = '';
        }
      );
    } else {
      // If no group selected, show all foods
      this.foodNames = this.allFoodNames;
    }
  }

  // Save food data directly to API
  processFoodDataSave(userId: string, foodData: any) {
    console.log('Saving food data:', foodData);
    
    // Format data according to API requirements
    const formattedData = {
      userId: userId,
      foodName: foodData.foodName,
      mealType: foodData.mealType,
      foodGroup: foodData.foodGroup,
      serving: foodData.serving,
      date: foodData.date
    };
    
    // Send food data to backend
    return this.http.post(`${this.apiUrl}/foods/userfood`, formattedData);
  }
  
  // Save activity data directly to API
  processActivityDataSave(userId: string, activityData: any) {
    console.log('Saving activity data:', activityData);
    
    // Format data according to API requirements
    const formattedData = {
      userId: userId,
      activityName: activityData.activityName,
      activityDescription: activityData.description,
      metValue: activityData.metValue,
      duration: activityData.duration.totalMinutes, // Total minutes
      date: activityData.date
    };
    
    // Send activity data to backend
    return this.http.post(`${this.apiUrl}/activities/useractivity`, formattedData);
  }
} 