import { Routes } from '@angular/router';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { UserListComponentComponent } from './user-list-component/user-list-component.component';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponentComponent },
  { path: 'user-list', component: UserListComponentComponent }
]; 