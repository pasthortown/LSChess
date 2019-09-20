import { HttpModule } from '@angular/http';
import { AuthService } from './../../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { UserService } from './../../services/profile/user.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ProfilePictureService } from 'src/app/services/profile/profilepicture.service';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePage],
  providers: [AuthService, UserService, Camera, ProfilePictureService]
})
export class ProfilePageModule {}
