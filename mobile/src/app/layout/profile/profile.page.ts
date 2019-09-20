import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/profile/user.service';
import { User } from 'src/app/models/profile/User';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ProfilePicture } from 'src/app/models/profile/ProfilePicture';
import { ProfilePictureService } from 'src/app/services/profile/profilepicture.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('fotoInput') fotoInput;
  cambiandoClaves = false;
  clavesCoinciden = false;
  clave: String = '';
  claveConfirm: String = '';
  user: User;
  profileImg = 'assets/images/accounts.png';
  profilePicture: ProfilePicture;
  appName = environment.app_name;

  constructor(
    private camera: Camera,
    public router: Router,
    private toastController: ToastController,
    private authDataServise: AuthService,
    private profilePictureDataService: ProfilePictureService,
    private userDataService: UserService) {
    this.user = new User();
    this.profilePicture = new ProfilePicture();
  }

  ngOnInit() {
    this.getUser();
    this.getProfilePicture();
  }

  getUser() {
    this.userDataService.get(JSON.parse(sessionStorage.getItem('user')).id).then( r => {
      this.user = r as User;
    }).catch( e => console.log(e));
  }

  getProfilePicture() {
    if ( JSON.parse(sessionStorage.getItem('profilePicture')) !== null ) {
      this.profilePicture = JSON.parse(sessionStorage.getItem('profilePicture')) as ProfilePicture;
      this.profileImg = 'data:' + this.profilePicture.file_type + ';base64,' + this.profilePicture.file;
    } else {
      this.profilePicture.id = 0;
    }
  }

  verificarCambioClaves() {
    if (this.clave.length !== 0 || this.claveConfirm.length !== 0) {
      this.cambiandoClaves = true;
    } else {
      this.cambiandoClaves = false;
    }
    if (this.clave === this.claveConfirm) {
      this.clavesCoinciden = true;
    } else {
      this.clavesCoinciden = false;
    }
  }

  guardar() {
    this.userDataService.put(this.user).then( r => {
      this.guardarFoto();
      if (this.cambiandoClaves && this.clavesCoinciden) {
        this.actualizarClave();
      } else {
        this.presentToastWithOptions('Datos guardados satisfactoriamente. Cierre sesión para visualizar los cambios.', 'middle', 'Aceptar', 'success').then(
          r_success => {
            r_success.onDidDismiss().then( r2 => {
            });
          }
        );
      }
    }).catch ( e => console.log(e));
  }

  guardarFoto() {
    if ( this.profileImg === 'assets/images/accounts.png' ) {
      return;
    }
    if (this.profilePicture.id === 0 ) {
      this.profilePictureDataService.post(this.profilePicture).then( r => {
        this.profileImg = 'data:' + r.file_type + ';base64,' + r.file;
        this.profilePicture.id = r.id;
        sessionStorage.setItem('profilePicture', JSON.stringify(this.profilePicture));
      }).catch( e => console.log(e) );
    } else {
      this.actualizarFoto();
    }
  }

  actualizarFoto() {
    this.profilePictureDataService.put(this.profilePicture).then( r => {
      sessionStorage.setItem('profilePicture', JSON.stringify(this.profilePicture));
      this.profileImg = 'data:' + r.file_type + ';base64,' + r.file;
    }).catch( e => console.log(e) );
  }

  actualizarClave() {
    this.authDataServise.password_change(this.clave).then( r => {
      this.presentToastWithOptions('Datos guardados satisfactoriamente. Cierre sesión y utilice su nueva contraseña.', 'middle', 'Aceptar', 'success').then(
        r_success => {
          r_success.onDidDismiss().then( r2 => {
          });
        }
      );
    }).catch( e => {
      console.log(e);
    });
  }

  getPicture(): void {
    if (Camera['installed']()) {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true
      };
      this.camera.getPicture(options).then((imageData) => {
        this.profilePicture.file_name = 'foto_desde_camara.jpg';
        this.profilePicture.file_type = 'image/jpeg';
        this.profilePicture.file = imageData;
        this.profileImg = 'data:' + this.profilePicture.file_type + ';base64,' + this.profilePicture.file;
       }, (err) => {
        this.profileImg = 'assets/images/accounts.png';
      });
    } else {
      this.fotoInput.nativeElement.click();
    }
  }

  desdeAlmacenamiento() {
    this.fotoInput.nativeElement.click();
  }

  subirImagen(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePicture.file_name = file.name;
        this.profilePicture.file_type = file.type;
        this.profilePicture.file = reader.result.toString().split(',')[1];
        this.profileImg = 'data:' + this.profilePicture.file_type + ';base64,' + this.profilePicture.file;
      };
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
