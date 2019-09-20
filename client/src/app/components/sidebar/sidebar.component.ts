import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfilePicture } from 'src/app/models/profile/ProfilePicture';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;
  user: any;
  profileImg = 'assets/images/accounts.png';

  @Output() collapsedEvent = new EventEmitter<boolean>();

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
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  logOut() {
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
