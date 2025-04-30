import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodActivityModalComponent } from './food-activity-modal.component';

describe('FoodActivityModalComponent', () => {
  let component: FoodActivityModalComponent;
  let fixture: ComponentFixture<FoodActivityModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FoodActivityModalComponent]
    });
    fixture = TestBed.createComponent(FoodActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 