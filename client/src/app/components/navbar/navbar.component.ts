import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProfilePicture } from 'src/app/models/profile/ProfilePicture';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public pushRightClass: string;
  user: any;
  profileImg = 'assets/images/accounts.png';

  constructor(private router: Router) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
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
}
