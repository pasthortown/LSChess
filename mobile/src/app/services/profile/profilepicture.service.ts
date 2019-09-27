import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../../environments/environment';
import { ProfilePicture } from './../../models/profile/ProfilePicture';

@Injectable({
   providedIn: 'root'
})
export class ProfilePictureService {

   url = environment.api + 'profilepicture/';
   options = new RequestOptions();

   constructor(private http: Http) {
      this.options.headers = new Headers();
      this.options.headers.append('api_token', sessionStorage.getItem('api_token'));
   }

   get(token?): Promise<any> {
      if ( typeof token !== 'undefined') {
         this.options.headers = new Headers();
         this.options.headers.append('api_token', token);
      }
      return this.http.get(this.url, this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { this.handledError(error.json()); });
   }

   get_paginate(size: number, page: number): Promise<any> {
      return this.http.get(this.url + 'paginate?size=' + size.toString() + '&page=' + page.toString(), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { this.handledError(error.json()); });
   }

   delete(id: number): Promise<any> {
      return this.http.delete(this.url + '?id=' + id.toString(), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { this.handledError(error.json()); });
   }

   post(profilepicture: ProfilePicture): Promise<any> {
      return this.http.post(this.url, JSON.stringify(profilepicture), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { this.handledError(error.json()); });
   }

   put(profilepicture: ProfilePicture): Promise<any> {
      return this.http.put(this.url, JSON.stringify(profilepicture), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { this.handledError(error.json()); });
   }

   handledError(error: any) {
      console.log(error);
   }
}