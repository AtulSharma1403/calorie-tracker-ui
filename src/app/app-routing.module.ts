import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponentComponent } from './user-list-component/user-list-component.component';
import { UserDetailsComponentComponent } from './user-details-component/user-details-component.component';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { UserDataComponentComponent } from './user-data-component/user-data-component.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-up', pathMatch: 'full' },
  { path: 'sign-up', component: SignupComponentComponent },
  { path: 'users', component: UserListComponentComponent },
  { path: 'users/:id', component: UserDetailsComponentComponent },
  { path: 'user-data/:id', component: UserDataComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
