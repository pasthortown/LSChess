import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProfilePicture } from 'src/app/models/profile/ProfilePicture';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: any;
  profileImg = 'assets/images/accounts.png';
  appName = environment.app_name;

  constructor(private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  refreshUser(): Boolean {
    if ( JSON.parse(sessionStorage.getItem('user')) !== null ) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
    if ( JSON.parse(sessionStorage.getItem('profilePicture')) !== null ) {
      const profilePicture = JSON.parse(sessionStorage.getItem('profilePicture')) as ProfilePicture;
      this.profileImg = 'data:' + profilePicture.file_type + ';base64,' + profilePicture.file;
    }
    return true;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
