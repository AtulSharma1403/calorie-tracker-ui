import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponentComponent } from './user-list-component/user-list-component.component';
import { UserDetailsComponentComponent } from './user-details-component/user-details-component.component';
import { SignupComponentComponent } from './signup-component/signup-component.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponentComponent,
    UserDetailsComponentComponent,
    SignupComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
