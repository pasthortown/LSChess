import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.page.html',
  styleUrls: ['./blank.page.scss'],
})
export class BlankPage implements OnInit {
  appName = environment.app_name;

  constructor() { }

  ngOnInit() {
  }
}
