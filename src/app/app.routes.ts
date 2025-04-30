import { Routes } from '@angular/router';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { UserListComponentComponent } from './user-list-component/user-list-component.component';
import { UserDataComponentComponent } from './user-data-component/user-data-component.component';
import { UserDetailsComponentComponent } from './user-details-component/user-details-component.component';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponentComponent },
  { path: 'user-list', component: UserListComponentComponent },
  { path: 'user-data/:id', component: UserDataComponentComponent },
  { path: 'user-details/:userId/:date', component: UserDetailsComponentComponent }
]; 