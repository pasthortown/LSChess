import { ProfilePicture } from './../../models/profile/ProfilePicture';
import { ProfilePictureService } from './../../services/profile/profilepicture.service';
import { UserService } from './../../services/profile/user.service';
import { User } from './../../models/profile/User';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  cambiandoClaves = false;
  clavesCoinciden = false;
  clave: String = '';
  claveConfirm: String = '';
  profileImg = 'assets/images/accounts.png';
  profilePicture: ProfilePicture;
  user: User;
  @ViewChild('fotoInput') fotoInput;

  constructor(
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

  subirFoto() {
    this.fotoInput.nativeElement.click();
  }

  CodificarArchivo(event) {
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

  guardar() {
    const userData = { id: this.user.id, name: this.user.name };
    sessionStorage.setItem('user', JSON.stringify(userData));
    this.userDataService.put(this.user).then( r => {
      this.guardarFoto();
      if (this.cambiandoClaves && this.clavesCoinciden) {
        this.actualizarClave();
      } else {
        Swal.fire({
          title: 'Datos Guardados',
          text: 'Datos guardados satisfactoriamente.',
          type: 'success',
        });
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
      Swal.fire({
        title: 'Datos Guardados',
        text: 'Datos guardados satisfactoriamente. Cierre sesión y utilice su nueva contraseña.',
        type: 'success',
      });
    }).catch( e => {
      console.log(e);
    });
  }
}
