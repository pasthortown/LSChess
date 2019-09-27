import { ProfilePictureService } from 'src/app/services/profile/profilepicture.service';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule, LayoutRoutingModule, NgbDropdownModule, HttpModule],
    declarations: [LayoutComponent, NavbarComponent, SidebarComponent],
    providers: [ProfilePictureService]
})
export class LayoutModule {}
