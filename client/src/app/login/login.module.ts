import { HttpModule } from '@angular/http';
import { AuthService } from './../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ProfilePictureService } from '../services/profile/profilepicture.service';

@NgModule({
    imports: [CommonModule, LoginRoutingModule, FormsModule, HttpModule],
    declarations: [LoginComponent],
    providers: [AuthService, ProfilePictureService]
})
export class LoginModule {}
