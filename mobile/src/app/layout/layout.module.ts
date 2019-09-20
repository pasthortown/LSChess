import { HttpModule } from '@angular/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

import { IonicModule } from '@ionic/angular';
import { ProfilePictureService } from '../services/profile/profilepicture.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutRoutingModule,
    HttpModule,
  ],
  declarations: [LayoutComponent, SidebarComponent],
  providers: [ProfilePictureService]
})
export class LayoutModule {}