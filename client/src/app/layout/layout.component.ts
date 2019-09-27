import { Component, OnInit } from '@angular/core';
import { ProfilePictureService } from '../services/profile/profilepicture.service';
import { ProfilePicture } from '../models/profile/ProfilePicture';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    collapedSideBar: boolean;
    
    constructor(public profilePictureDataService: ProfilePictureService) {}

    ngOnInit() {
        this.getProfilePicture();
    }

    getProfilePicture() {
        this.profilePictureDataService.get().then( r2 => {
            if ( typeof r2 !== 'undefined') {
                if ( typeof r2.error === 'undefined' ) {
                    sessionStorage.setItem('profilePicture', JSON.stringify(r2 as ProfilePicture));
                }
            }
        }).catch( e => {
        });
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
