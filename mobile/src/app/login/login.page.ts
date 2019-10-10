import { ProfilePictureService } from './../services/profile/profilepicture.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ProfilePicture } from '../models/profile/ProfilePicture';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password = '';
  email = '';
  busy: Promise<any>;
  esperando: boolean;

  constructor(
    private toastController: ToastController,
    private authDataServise: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.esperando = false;
  }

  login() {
    if ( !this.esperando ) {
      this.esperando = true;
      this.busy = this.authDataServise.login(this.email, this.password).then( r => {
        this.esperando = false;
        sessionStorage.setItem('api_token', r.token);
        sessionStorage.setItem('isLoggedin', 'true');
        const userData = { id: r.id, name: r.name };
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.router.navigate(['/main']);
      }).catch( e => {
        this.esperando = false;
        this.presentToastWithOptions('Credenciales Incorrectos', 'middle', 'Aceptar', 'danger').then(
          r => {
            r.onDidDismiss().then( r2 => {
              sessionStorage.clear();
              this.router.navigate(['/login']);
            });
          }
        );
      });
    }
  }

  password_recovery() {
    if ( !this.esperando ) {
      this.esperando = true;
      this.busy = this.authDataServise.password_recovery_request(this.email).then( r => {
        this.esperando = false;
        if ( r === 'Success!') {
          this.presentToastWithOptions('Para completar el proceso, revisa tu correo', 'middle', 'Aceptar', 'success').then(
            r_success => {
              r_success.onDidDismiss().then( r2 => {
                this.password = '';
                this.email = '';
              });
            }
          );
        } else {
          this.presentToastWithOptions('La dirección de correo proporcionada, no corresponde a cuenta alguna', 'middle', 'Aceptar', 'warning')
          .then(
            r_fail => {
              r_fail.onDidDismiss().then( r2 => {
                this.password = '';
                this.email = '';
              });
            }
          );
        }
      }).catch( e => {
        console.log(e);
        this.esperando = false;
      });
    }
  }

  async presentToastWithOptions(message, position, closeButtonText, color) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: position,
      color: color,
      closeButtonText: closeButtonText
    });
    toast.present();
    return toast;
  }
}
