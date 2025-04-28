import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataComponentComponent } from './user-data-component.component';

describe('UserDataComponentComponent', () => {
  let component: UserDataComponentComponent;
  let fixture: ComponentFixture<UserDataComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataComponentComponent]
    });
    fixture = TestBed.createComponent(UserDataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
