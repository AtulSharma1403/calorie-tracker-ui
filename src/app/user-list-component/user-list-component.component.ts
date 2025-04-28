import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var window: any; // Add this at the top if you get TS errors

@Component({
  selector: 'app-user-list-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list-component.component.html',
  styleUrls: ['./user-list-component.component.scss']
})
export class UserListComponentComponent implements OnInit {
  users: any[] = [];
  activities: any[] = [];
  specificMotions: any[] = [];
  selectedActivity: any = null;
  selectedMotion: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
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

  onSave(data: any) {
    console.log('Saved data:', data);
    // Handle the saved data here
    // You might want to:
    // 1. Add it to your table
    // 2. Send it to your backend
    // 3. Update your local state
  }

  onClose() {
    console.log('Modal closed');
    // Handle modal close if needed
  }

  onActivityChange() {
    if (this.selectedActivity) {
      this.http.get<any[]>(`http://localhost:3000/api/activities/${this.selectedActivity}`).subscribe(
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

  onMotionChange() {
    // METs will be set automatically via binding
  }
}
